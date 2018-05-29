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
//BrowserSync will work only on first port
const listenAddress = process.env['LISTEN_ADDRESS'] || '0.0.0.0';
const glob = require('glob');
const $ = require('gulp-load-plugins')();
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const packageName = require('./package.json').name;

const cssLoaderPath = require.resolve('css-loader');
const urlLoaderPath = require.resolve('url-loader');
const styleLoaderPath = require.resolve('style-loader');
const sassLoaderPath = require.resolve('sass-loader');
const postCssLoaderPath = require.resolve('postcss-loader');
const autoprefixer = require('autoprefixer');
const calc = require('postcss-calc');
const urlResolverPath = require.resolve('resolve-url-loader');
const verifyModules = require('./verify-modules');
const jsonLoaderPath = require.resolve('json-loader');
const systemjsBundle = require('./systemjs-bundle/task');
const docsServer = require('./docs-server');
const startKarma = require('./start-karma');
const lintSlugsTask = require('./lint-slugs');

const SRC = "src";
const SRC_EXT_GLOB = ".{jsx,ts,tsx,js}";

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
    },
    {
        test: /\.json$/i,
        loader: jsonLoaderPath
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
    entries[path.basename(name).replace(/\.(tsx?|jsx)$/, '')] = [
        "webpack/hot/dev-server",
        `webpack-dev-server/client?http://` + listenAddress + `:8888`,
        `./${name}`
    ];

    return entries;
};

const addHMR = (path) =>
    glob.sync(path).reduce(addHMRCallback, {});

exports.resolveConfig = ( extensions, nodeModulesPath ) => ({
    extensions: [ '', '.js' ].concat(extensions, [ '.scss' ]),
    fallback: [ nodeModulesPath, path.join(__dirname, 'node_modules'), path.join(process.cwd(), 'node_modules') ]
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
            ]),
            noParse: (webpackConfig.module || {}).noParse
        },
        postcss: () => ([
            calc({ precision: 10 }),
            autoprefixer
        ]),
        sassLoader: {
            precision: 10
        }
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
                host: listenAddress,
                port: 3000,
                proxy: 'http://' + listenAddress + ':8888/'
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
        loaders: config.loaders,
        noParse: config.noParse
    }
});

exports.startKarma = startKarma;

function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

exports.addTasks = (gulp, libraryName, srcGlob, webpackConfig, dtsGlob, options = {}) => { //eslint-disable-line max-params
    const libraryClassName = _.flow(_.camelCase, ucfirst)(libraryName);

    systemjsBundle(
        gulp,
        { distName: libraryName, modules: options.modules, webpackConfig: webpackConfig.systemjs, webpackStream, webpack }
    );

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
        const host = listenAddress;

        const packageInfo = require(path.join(process.cwd(), 'package.json'));

        const config = _.assign({}, webpackConfig.dev);
        config.resolve = Object.assign({}, config.resolve, { alias: { [packageInfo.name]: process.cwd() + '/src/main' }, fallback: path.join(process.cwd(), 'node_modules') });

        const server = new WebpackDevServer(webpack(config), {
            contentBase: './',
            hot: true,
            noInfo: true,
            stats: { hash: false, version: false, timings: false, assets: false, chunks: false },
            disableHostCheck: true
        });

        server.listen(webpackPort, host, err => {
            if (err) {
                callback();
                throw new $.util.PluginError('webpack-dev-server', err);
            }
        });
    });

    gulp.task('lint', [ 'lint-slugs' ], () => {
        const isFixed = (file) => file.eslint != null && file.eslint.fixed;

        return gulp.src([ srcGlob, 'test' ])
            .pipe($.eslint({ fix: argv.fix }))
            .pipe($.eslint.format())
            .pipe($.if(isFixed, gulp.dest(".")))
            .pipe($.eslint.failAfterError());
    });

    lintSlugsTask(gulp, packageName);

    gulp.task('docs', [ 'lint-slugs', 'build-cdn', 'build-npm-package', 'build-systemjs-bundle' ], (done) => docsServer(libraryName, (browserSync) => {
        gulp.watch("docs/**/*.{md,hbs}", [ 'lint-slugs' ]).on('change', browserSync.reload);
        gulp.watch("public/**/*.{css,js}").on('change', browserSync.reload);
        gulp.watch("dist/cdn/**/*.{css,js}").on('change', browserSync.reload);
        gulp.watch("src/**/*" + SRC_EXT_GLOB, [ "build-cdn", "build-npm-package" ]);
    }, done));
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
        browserDisconnectTolerance: 5,
        browserNoActivityTimeout: 30000,
        retryLimit: 5,
        customLaunchers: {
            TravisCI: {
                base: "Chrome",
                flags: [ '--no-sandbox' ]
            },
            Chrome_headless: {
                base: 'Chrome',
                    flags: [
                    '--headless',
                    '--disable-gpu',
                    '--remote-debugging-port=9222'
                ]
        }
        }
    });
};
