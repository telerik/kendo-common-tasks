const path = require('path');
const _ = require('lodash');
const named = require('vinyl-named');
const argv = require('yargs').argv;
const addsrc = require('gulp-add-src');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackStream = require('webpack-stream');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const express = require('express');
const mds = require('markdown-serve');
const BrowserSync = require('browser-sync');
const serveIndex = require('serve-index');
const rewrite = require('express-urlrewrite');

const glob = require('glob');
const $ = require('gulp-load-plugins')();
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const cssLoaderPath = require.resolve('css-loader');
const urlLoaderPath = require.resolve('url-loader');
const fileLoaderPath = require.resolve('file-loader');
const styleLoaderPath = require.resolve('style-loader');
const sassLoaderPath = require.resolve('sass-loader');

const cssModuleIdentName = 'k-[local]';

const SRC_EXT_GLOB = ".{jsx,ts}";

exports.webpack = webpack;

exports.webpackStream = webpackStream;

exports.CDNSassLoader = {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract(styleLoaderPath, [
        `${cssLoaderPath}?modules&sourceMap&localIdentName=${cssModuleIdentName}`,
        sassLoaderPath
    ])
};

const resourceLoaders = [
    { test: /\.(jpe?g|png|gif|svg)$/i, loader: `${urlLoaderPath}?limit=10000` },
    { test: /\.(woff|woff2)$/, loader: `${fileLoaderPath}?mimetype=application/font-woff` },
    { test: /\.ttf$/, loader: `${fileLoaderPath}?mimetype=application/octet-stream` },
    { test: /\.eot$/, loader: `${fileLoaderPath}` },
    { test: /\.svg$/, loader: `${fileLoaderPath}?mimetype=image/svg+xml` }
];

exports.resourceLoaders = resourceLoaders;

// alias, for now
exports.npmPackageSassLoader = exports.CDNSassLoader;

exports.extractCssPlugin = () =>
  new ExtractTextPlugin("[name].css");

exports.uglifyJsPlugin = () =>
  new webpack.optimize.UglifyJsPlugin();

const inlineSassLoader = {
    test: /\.scss$/,
    loaders: [
        styleLoaderPath,
        `${cssLoaderPath}?modules&localIdentName=${cssModuleIdentName}`,
        `${sassLoaderPath}?sourceMap`
    ]
};

// Used in [].reduce below, to convert each script entry in
// the examples directory to webpack entry object with HMR scripts injected
// {
//  script1Name: [ script1.jsx, 'w/h/d-s', 'w-d-s/client' ]
//  script2Name: [ script2.jsx, 'w/h/d-s', 'w-d-s/client' ]
// }
const addHMRCallback = (entries, name) => {
    entries[path.basename(name).replace(/\.(ts|jsx)$/, '')] = [
        "webpack/hot/dev-server",
        `webpack-dev-server/client?http://0.0.0.0:8888`,
        `./${name}`
    ];

    return entries;
};

const addHMR = (path) =>
  glob.sync(path).reduce(addHMRCallback, {});

exports.resolveConfig = ( extensions, nodeModulesPath ) => ({
    extensions: [ '', '.js' ].concat(extensions, [ '.scss' ]),
    fallback: [ nodeModulesPath, path.join(__dirname, 'node_modules') ]
});

exports.inlineSassLoader = inlineSassLoader;

exports.webpackDevConfig = (config) => ({
    resolve: config.resolve,

    entry: addHMR(config.entries),

    output: {
        path: '/',
        filename: 'examples/[name].js'
    },

    devtool: 'cheap-module-eval-source-map',

    plugins: [
        new BrowserSyncPlugin(
            // BrowserSync options
            {
                open: false,
                host: '0.0.0.0',
                port: 3000,
                proxy: 'http://0.0.0.0:8888/'
            },
            // plugin options
            {
                // prevent BrowserSync from reloading the page
                // and let Webpack Dev Server take care of this
                reload: false
            }
        ),
        new webpack.HotModuleReplacementPlugin()
    ],

    module: {
        loaders: config.loaders.concat([ inlineSassLoader ]).concat(resourceLoaders)
    }
});

exports.addTasks = (gulp, libraryName, srcGlob, webpackConfig, dtsGlob) => { //eslint-disable-line max-params
    const libraryClassName = _.flow(_.camelCase, _.capitalize)(libraryName);

    gulp.task('build-npm-package', () => {
        const config = _.assign({}, webpackConfig.npmPackage);

        return gulp.src(srcGlob)
                   .pipe(named())
                   .pipe(webpackStream(config))
                   .pipe(addsrc.append(_.compact(_.concat([], dtsGlob))))
                   .pipe($.rename((path) => {
                       if (path.extname === '.css') {
                           path.dirname = 'css';
                           path.basename = 'main';
                       } else {
                           path.dirname = 'js';
                       }
                   }))
                   .pipe(gulp.dest('dist/npm'));
    });

    gulp.task('build-cdn', () => {
        const config = _.assign({}, webpackConfig.CDN);

        config.output.library = libraryClassName;

        return gulp.src('src/main' + SRC_EXT_GLOB)
                   .pipe(webpackStream(config))
                   .pipe($.rename((path) => {
                       path.basename = libraryName;
                       path.dirname = path.extname.replace('.', '');
                   }))
                   .pipe(gulp.dest('dist/cdn'));
    });

    gulp.task("start", callback => {
        const webpackPort = 8888;
        const host = '0.0.0.0';

        const packageInfo = require(path.join(process.cwd(), 'package.json'));

        const config = _.assign({}, webpackConfig.dev);

        config.resolve = Object.assign({}, config.resolve, { alias: { [packageInfo.name]: '../src/main' } });

        const server = new WebpackDevServer(webpack(config), {
            contentBase: './',
            hot: true,
            noInfo: true,
            stats: { colors: true }
        });

        server.listen(webpackPort, host, err => {
            if (err) {
                callback();
                throw new $.util.PluginError('webpack-dev-server', err);
            }
        });
    });

    gulp.task('lint', () => {
        const isFixed = (file) => file.eslint != null && file.eslint.fixed;

        return gulp.src([ srcGlob, 'test' ])
                   .pipe($.eslint({ fix: argv.fix }))
                   .pipe($.eslint.format())
                   .pipe($.if(isFixed, gulp.dest(".")))
                   .pipe($.eslint.failAfterError());
    });

    gulp.task('docs', [ 'build-cdn' ], (done) => {
        const browserSync = BrowserSync.create();
        const app = express();

        app.use(rewrite(/(.+)\.md$/, '/$1'));

        app.set('views', __dirname);
        app.set('view engine', 'hbs');

        app.use('/internals', express.static(path.join(__dirname, 'docs-public')));
        app.use('/cdn', express.static('dist/cdn/'));

        app.use('/', serveIndex('docs', { 'icons': true }));

        app.use(mds.middleware({
            rootDirectory: 'docs',
            view: 'docs-layout',
            preParse: function(markdownFile) {
                return {
                    scriptSrc: `js/${libraryName}.js`,
                    styleSrc: `css/${libraryName}.css`,
                    content: markdownFile.parseContent()
                };
            }
        }));

        app.listen(3000, function() {
            browserSync.init({
                port: 8080,
                proxy: "localhost:3000"
            });

            gulp.watch("docs/**/*.{md,hbs}").on('change', browserSync.reload);
            gulp.watch("public/**/*.{css,js}").on('change', browserSync.reload);
            gulp.watch("dist/cdn/**/*.{css,js}").on('change', browserSync.reload);
            gulp.watch("src/**/*" + SRC_EXT_GLOB, [ "build-cdn" ]);
        });

        process.on('exit', done);
    });
};
