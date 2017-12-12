/* eslint no-var: 0 */
'use strict';

const path = require('path');
const fs = require('fs');
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
const express = require('express');
const mds = require('./markdown-serve');
const BrowserSync = require('browser-sync');
const serveIndex = require('serve-index');
const rewrite = require('express-urlrewrite');
const glob = require('glob');
const $ = require('gulp-load-plugins')();
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const contains = require('gulp-contains');
const gutil = require('gulp-util');
const packageName = require('./package.json').name;

const KarmaServer = require('karma').Server;

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
            calc,
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

exports.startKarma = (done, confPath, singleRun, configOverride) => (
    new KarmaServer(Object.assign({
        singleRun: singleRun,
        configFile: confPath
    }, configOverride || {}), function(exitStatus) {
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

exports.addTasks = (gulp, libraryName, srcGlob, webpackConfig, dtsGlob, options = {}) => { //eslint-disable-line max-params
    const libraryClassName = _.flow(_.camelCase, ucfirst)(libraryName);

    systemjsBundle(gulp, { distName: libraryName, modules: options.modules, webpackConfig });

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

    const reportError = message => (string, file, cb) => {
        const filename = /[\/\\](docs.*)$/.exec(file.path)[1];
        const error = `
    ${message.replace(/FILE/, filename)}
    I can't tell you exactly where due to technical limitations, sorry.
    Validation provided by ${packageName}.`;
        cb(new gutil.PluginError('gulp-contains', error));
    };

    gulp.task('lint-slugs', () =>
      gulp.src('docs/**/*.{md,hbs}')
        .pipe(contains({
            search: /{%\s*(?!(asset_path|embed_file|endmeta|meta|slug|platform_content|endplatform_content)\b)\w+/,
            onFound: reportError("Unknown Liquid tags found in 'FILE'.")
        }))
        .pipe(contains({
            search: /{%\s*slug\s+(?!([a-zA-Z0-9_\-])+\s*%})/,
            onFound: reportError("Slugs with invalid characters found in 'FILE'.")
        }))
    );

    gulp.task('docs', [ 'lint-slugs', 'build-cdn', 'build-npm-package', 'build-systemjs-bundle' ], (done) => {
        const browserSync = BrowserSync.create();
        const app = express();
        const platform = argv.platform || (/react/.test(libraryName) ? 'react' : 'angular');

        app.use(rewrite(/(.+)\.md$/, '/$1'));

        app.set('views', __dirname);
        app.set('view engine', 'hbs');

        app.use('/internals', express.static(path.join(__dirname, 'docs-public')));
        app.use('/cdn', express.static('dist/cdn/'));
        app.use('/npm', express.static('node_modules', {
            setHeaders: (response) => {
                response.set('Access-Control-Allow-Origin', 'http://run.plnkr.co');
            }
        }));
        app.use(`/npm/@progress/${libraryName}`, express.static('.', {
            setHeaders: (response) => {
                response.set('Access-Control-Allow-Origin', 'http://run.plnkr.co');
            }
        }));
        app.use('/', serveIndex('docs', { 'icons': true }));
        app.use('/', express.static('docs/'));

        const constant = (x) => () => x;
        const meta = (_, options) => {
            const opts = options.split(' ').reduce((hash, tuple) => {
                const [ key, value ] = tuple.split(':');
                if (key) {
                    hash[key] = value;
                }
                return hash;
            }, {});

            const attr = Object.keys(opts).map(
                (key) => `data-${key}='${opts[key]}'`
            );

            if (opts.hasOwnProperty('height')) {
                attr.push(`style='height: ${Number(opts['height']) + 50}px'`);
            }

            return `<div ${attr.join(' ')}>`;
        };
        const encode = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
        const escapeHtml = (str) => str.replace(/[&<>]/g, (char) => encode[char]);
        const exists = (file) => {
            try {
                fs.accessSync(file, fs.F_OK);
                return true;
            } catch (e) {
                return false;
            }
        };
        const embedFile = (_, options) => {
            const params = options.split(' ');
            const filepath = path.join("docs", "examples", params[0]);

            if (!exists(filepath)) {
                console.warn(`Demo file ${filepath} not found.`); // eslint-disable-line no-console
                return "";
            }

            const basename = path.basename(filepath);
            const language = path.extname(basename).replace('.','');
            const hidden = params.some(p => p === "hidden");
            const preview = params.some(p => p === "preview");
            const content = escapeHtml(fs.readFileSync(filepath, 'utf-8'));
            return `
    <pre data-file='${basename}' ${hidden ? "data-hidden='true'" : "" }>
    <code class='language-${language}-multiple${preview ? "-preview" : "" }'>${content}</code>
    </pre>`;
        };
        const platformContent = (_, platformCapture, contentCapture) => // eslint-disable-line no-arrow-condition
            (platformCapture === platform ? contentCapture : '');

        const processPlugins = (content, plugins) => {
            let result = content;
            plugins.forEach((plugin) => {
                const pluginRe = new RegExp(`{%\\s*${plugin.name}\\s*([^%]+)?\\s*%}`, 'g');
                result = result.replace(plugin.regExp || pluginRe, plugin.process);
            });
            return result;
        };

        app.use(mds.middleware({
            rootDirectory: 'docs',
            view: 'docs-layout',
            preParse: function(markdownFile) {
                let content = markdownFile.parseContent();

                content = processPlugins(content, [
                    {
                        name: "platform_content",
                        regExp: new RegExp('{%\\s*platform_content\\s*([^%]+?)\\s*%}((.|\\n)*?){%\\s*endplatform_content\\s*%}', 'g'),
                        process: platformContent
                    },
                    { name: "embed_file", process: embedFile },
                    { name: "meta", process: meta },
                    { name: "endmeta", process: constant("</div>") }
                ]);

                return {
                    scriptSrc: `js/${libraryName}.js`,
                    styleSrc: `css/${libraryName}.css`,
                    content: content,
                    platform: platform
                };
            }
        }));

        app.listen(3000, function() {
            browserSync.init({
                open: false,
                port: 8080,
                proxy: "localhost:3000"
            });

            gulp.watch("docs/**/*.{md,hbs}", [ 'lint-slugs' ]).on('change', browserSync.reload);
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
        browserDisconnectTolerance: 5,
        browserNoActivityTimeout: 30000,
        retryLimit: 5,
        customLaunchers: {
            TravisCI: {
                base: "Chrome",
                flags: [ '--no-sandbox' ]
            }
        }
    });
};
