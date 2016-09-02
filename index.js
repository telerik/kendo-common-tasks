/* eslint no-var: 0 */
'use strict';

const path = require('path');
const _ = require('lodash');
const argv = require('yargs').argv;
const merge = require('merge2');
const named = require('vinyl-named');

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

const KarmaServer = require('karma').Server;

const cssLoaderPath = require.resolve('css-loader');
const urlLoaderPath = require.resolve('url-loader');
const styleLoaderPath = require.resolve('style-loader');
const sassLoaderPath = require.resolve('sass-loader');
const postCssLoaderPath = require.resolve('postcss-loader');
const autoprefixer = require('autoprefixer');
const urlResolverPath = require.resolve('resolve-url-loader');
const verifyModules = require('./verify-modules');

const SRC = "src";
const SRC_EXT_GLOB = ".{jsx,ts,js}";

exports.webpack = webpack;

exports.webpackStream = webpackStream;

exports.CDNSassLoader = {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract(styleLoaderPath, [
        `${cssLoaderPath}?sourceMap`,
        postCssLoaderPath,
        sassLoaderPath
    ])
};

const hashedName = "[name].[ext]?[hash]";
const resourceLoaders = [
    {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: urlLoaderPath,
        query: {
            name: hashedName,
            limit: 10000
        }
    },
    {
        test: /\.(woff|woff2)$/,
        loader: urlLoaderPath,
        query: {
            name: hashedName,
            mimetype: "application/font-woff"
        }
    }
];

exports.resourceLoaders = resourceLoaders;

// alias, for now
exports.npmPackageSassLoader = exports.CDNSassLoader;

exports.extractCssPlugin = () =>
  new ExtractTextPlugin("[name].css");

exports.uglifyJsPlugin = () =>
  new webpack.optimize.UglifyJsPlugin();

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

exports.inlineSassLoader = {
    test: /\.scss$/,
    loaders: [
        styleLoaderPath,
        cssLoaderPath,
        postCssLoaderPath,
        urlResolverPath,
        `${sassLoaderPath}?sourceMap`
    ]
};

const stubLoader = {
    test: /\.(ttf|eot|svg|woff|woff2|jpe?g|png|gif|svg)$/i,
    loader: require.resolve('./stub-loader.js')
};

// adds theme configuration to webpack config
const webpackThemeConfig = (_settings, _webpackConfig) => {
    const options = _webpackConfig ? _settings : {};
    const webpackConfig = _webpackConfig ? _webpackConfig : _settings;

    const extract = options && options.extract;
    const sassLoader = extract ? exports.CDNSassLoader : exports.inlineSassLoader;
    const plugins = extract ? [ exports.extractCssPlugin() ] : [];

    return Object.assign({}, webpackConfig, {
        plugins: plugins.concat(webpackConfig.plugins || []),

        module: {
            loaders: _.flatten([
                webpackConfig.module && webpackConfig.module.loaders,
                sassLoader,
                options.stubResources ? stubLoader : resourceLoaders
            ])
        },
        postcss: () => ([
            autoprefixer
        ])
    });
};

exports.webpackThemeConfig = webpackThemeConfig;

exports.webpackDevConfig = (config) => webpackThemeConfig({
    resolve: config.resolve,

    entry: addHMR(config.entries),

    output: {
        publicPath: '/',
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
        loaders: config.loaders
    }
});

exports.startKarma = (done, confPath, singleRun) => (
    new KarmaServer({
        singleRun: singleRun,
        configFile: confPath
    }, function(exitStatus) {
        if (exitStatus !== 0) {
            done("specs failed");
        } else {
            done();
        }
    }).start()
);


function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

exports.addTasks = (gulp, libraryName, srcGlob, webpackConfig, dtsGlob) => { //eslint-disable-line max-params
    const libraryClassName = _.flow(_.camelCase, ucfirst)(libraryName);

    gulp.task('build-npm', () => {
        const config = _.assign({}, webpackConfig.npmPackage);

        const srcStream = gulp.src(srcGlob)
                .pipe(named(function(file) {
                    const thePath = file.path;
                    const relativeDir = path.relative(file.base, path.dirname(thePath));
                    const fileName = path.basename(thePath, path.extname(thePath));
                    return path.join(SRC, relativeDir, fileName);
                }))
                .pipe(webpackStream(config))
                .pipe($.rename((thePath) => {
                    if (thePath.extname === '.css') {
                        thePath.dirname = 'css';
                        thePath.basename = 'main';
                    } else {
                        thePath.dirname = path.join('js', path.relative(SRC, thePath.dirname));
                    }
                }));

        const dtsStream = gulp.src(_.compact(_.concat([], dtsGlob)))
                .pipe($.rename((thePath) =>
                    thePath.dirname = path.join('js', thePath.dirname)
                ));

        return merge(srcStream, dtsStream).pipe(gulp.dest('dist/npm'));
    });

    gulp.task('verify-npm', [ 'build-npm' ], (done) => {
        verifyModules('./dist/npm/js/main.js', done);
    });

    gulp.task('build-npm-package', [ 'verify-npm' ]);

    gulp.task('build-cdn', () => {
        if (!webpackConfig.CDN) {
            return gulp.src([]);
        }

        const config = _.assign({}, webpackConfig.CDN);

        config.output.library = libraryClassName;

        return gulp.src('src/main' + SRC_EXT_GLOB)
                   .pipe(webpackStream(config))
                   .pipe($.rename((path) => {
                       var dirname = path.extname.replace('.', '');
                       path.basename = libraryName;
                       path.dirname = dirname;
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

    gulp.task('docs', [ 'build-cdn', 'build-npm-package' ], (done) => {
        const browserSync = BrowserSync.create();
        const app = express();

        app.use(rewrite(/(.+)\.md$/, '/$1'));

        app.set('views', __dirname);
        app.set('view engine', 'hbs');

        app.use('/internals', express.static(path.join(__dirname, 'docs-public')));
        app.use('/cdn', express.static('dist/cdn/'));
        app.use('/npm', express.static('node_modules'));
        app.use(`/npm/@progress/${libraryName}/dist`, express.static('dist/', {
            setHeaders: (response) => {
                response.set('Access-Control-Allow-Origin', 'http://run.plnkr.co');
            }
        }));
        app.use('/', serveIndex('docs', { 'icons': true }));
        app.use('/', express.static('docs/'));

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
            gulp.watch("src/**/*" + SRC_EXT_GLOB, [ "build-cdn", "build-npm-package" ]);
        });

        process.on('exit', done);
    });
};

exports.karmaConfig = function(config, webpackConfig, bundleFile) {
    const USE_SANDBOXED_CHROME = process.env['TRAVIS'];

    const ENV_BROWSER = process.env['ENV_BROWSER'];

    let browsers;

    if (ENV_BROWSER) {
        browsers = [ ENV_BROWSER ];
    } else {
        browsers = USE_SANDBOXED_CHROME ? [ 'TravisCI' ] : [ 'Chrome' ];
    }

    config.set({
        basePath: '',
        frameworks: [ 'jasmine' ],

        exclude: [ ],

        files: [ { pattern: bundleFile, watched: false } ],

        preprocessors: { [bundleFile]: [ 'webpack', 'sourcemap' ] },

        webpack: webpackConfig,

        webpackServer: { noInfo: true },

        reporters: [ 'story' ],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: browsers,

        customLaunchers: {
            TravisCI: {
                base: "Chrome",
                flags: [ '--no-sandbox' ]
            }
        }
    });
};
