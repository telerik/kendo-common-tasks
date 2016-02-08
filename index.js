const path = require('path');
const _ = require('lodash');
const named = require('vinyl-named');
const argv = require('yargs').argv;

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackStream = require('webpack-stream');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');


const glob = require('glob');
const $ = require('gulp-load-plugins')();
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const cssLoaderPath = require.resolve('css-loader');
const styleLoaderPath = require.resolve('style-loader');
const sassLoaderPath = require.resolve('sass-loader');

const cssModuleIdentName = 'k-[local]';

exports.webpack = webpack;

exports.webpackStream = webpackStream;

exports.CDNSassLoader = {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract(styleLoaderPath, [
        `${cssLoaderPath}?modules&sourceMaplocalIdentName=${cssModuleIdentName}`,
        sassLoaderPath
    ])
};

// alias, for now
exports.npmPackageSassLoader = exports.CDNSassLoader;

exports.extractCssPlugin = () =>
  new ExtractTextPlugin("[name].css");

exports.uglifyJsPlugin = () =>
  new webpack.optimize.UglifyJsPlugin();

const devSassLoader = {
    test: /\.scss$/,
    loaders: [
        styleLoaderPath,
        `${cssLoaderPath}?modules&sourceMap&localIdentName=${cssModuleIdentName}`,
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
        loaders: config.loaders.concat([ devSassLoader ])
    }
});

exports.addTasks = (gulp, libraryName, srcGlob, webpackConfig) => {
    const libraryClassName = _.flow(_.camelCase, _.capitalize)(libraryName);

    gulp.task('build-npm-package', () => {
        const config = _.assign({}, webpackConfig.npmPackage);

        config.output.library = libraryClassName;

        return gulp.src(srcGlob)
                   .pipe(named())
                   .pipe(webpackStream(config))
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

        return gulp.src('src/bundle.*')
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

        const server = new WebpackDevServer(webpack(webpackConfig.dev), {
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
};
