/* eslint no-var: 0 */
window.ExampleRunner = (function() {
    function endsWith(content, search) {
        var position = content.length - search.length;
        var lastIndex = content.indexOf(search, position);
        return lastIndex !== -1 && lastIndex === position;
    }

    /**
     * Add legacy Kendo UI configuration to the SystemJs config. This is used in the React wrappers demos.
     */
    var jqueryConfiguration = {
        module: "jquery",
        path: "https://unpkg.com/jquery@3.2.1/dist/jquery.min.js"
    };

    var kendoConfiguration = {
        module: "@progress/kendo-ui",
        path: "https://unpkg.com/@progress/kendo-ui/"
    };

    /**
     * SystemJS config for jsx/js demos.
     */
    function addBabelConfiguration(config, language) {
        config.transpiler = "plugin-babel";
        config.meta['*.jsx'] = {
            babelOptions: {
                react: true
            }
        };

        config.packages['app'] = {
            main: './main.' + language
        };

        config.map['plugin-babel'] = "https://unpkg.com/systemjs-plugin-babel@0.0.25/plugin-babel.js";
        config.map['systemjs-babel-build'] = 'https://unpkg.com/systemjs-plugin-babel@0.0.25/systemjs-babel-browser.js';
    }

    /**
     * SystemJS config for ts demos.
     */
    function addTSConfiguration(config) {
        config.transpiler = 'ts';
        config.typescriptOptions = {
            target: 'es5',
            module: 'system',
            moduleResolution: 'node',
            sourceMap: true,
            jsx: "react",
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            removeComments: false,
            noImplicitAny: true,
            suppressImplicitAnyIndexErrors: true
        };
        config.meta['typescript'] = {
            'exports': 'ts'
        };
        config.packages['app'] = {
            main: './main.ts',
            defaultExtension: 'ts'
        };

        config.map['ts'] = "https://unpkg.com/plugin-typescript@5.3.3/lib/plugin.js";
        config.map['tslib'] = "https://unpkg.com/tslib@1.7.1";
        config.map['typescript'] = 'https://unpkg.com/typescript@2.4.2/lib/typescript.js';
    }

    var systemjsConfig = {
        vue: function(options) {
            var npmUrl = options.npmUrl;
            var modules = options.modules;
            var trackjs = options.trackjs;
            var config = {
                transpiler: "plugin-babel",

                meta: {
                    '*.json': {
                        loader: 'systemjs-json-plugin'
                    }
                },

                packages: {
                    'app': {
                        main: './main.js',
                        defaultExtension: 'js'
                    }
                },

                map: {
                    "app": "app",
                    'systemjs-json-plugin': 'https://unpkg.com/systemjs-plugin-json@0.3.0',
                    //Babel transpiler
                    "plugin-babel": "https://unpkg.com/systemjs-plugin-babel@0.0.25/plugin-babel.js",
                    'systemjs-babel-build': 'https://unpkg.com/systemjs-plugin-babel@0.0.25/systemjs-babel-browser.js',
                    //Vue packages
                    "vue": "https://unpkg.com/vue/dist/vue.min.js",
                    // Misc packages used by the kendo-vue-* packages

                    //Inhouse pacakges
                    '@telerik': npmUrl + '/@telerik',
                    '@progress': npmUrl + '/@progress'
                }
            };

            /* Add Kendo Packages */
            modules.forEach(function(kendoPackage) {
                /* Only include legacy Kendo UI configuration when it is included into the auto imports */
                if (kendoPackage.module === '@progress/kendo-ui') {
                    /* Map kendo-ui && add package configuration */
                    config.map[kendoConfiguration.module] = kendoConfiguration.path;

                    config.packages[kendoConfiguration.module] = {
                        main: kendoPackage.main || 'js/kendo.all.js',
                        defaultExtension: 'js'
                    };
                } else if (kendoPackage.module === 'jquery') {
                    /* Map jQuery */
                    config.map[jqueryConfiguration.module] = jqueryConfiguration.path;
                } else {
                    config.packages[kendoPackage.module] = {
                        main: kendoPackage.main || 'dist/cdn/'.concat(kendoPackage.module.replace(/(@progress\/|@telerik\/)/, ''), '.min.js'),
                        defaultExtension: kendoPackage.defaultExtension || 'js'
                    };
                }
            });

            if (trackjs) {
                config.packages['raven-js'] = {
                    main: 'dist/raven.js'
                };

                config.paths = {
                    'raven-js': npmUrl + "/raven-js"
                };
            }

            return config;
        },
        react: function(options) {
            var npmUrl = options.npmUrl;
            var modules = options.modules;
            var trackjs = options.trackjs;
            var language = options.language;
            var SYSTEM_BUNDLES = [ {
                name: "@progress/kendo-drawing",
                file: "kendo-drawing.js",
                modules: true
            } ];

            var config = {
                meta: {
                    '*.json': {
                        loader: 'systemjs-json-plugin'
                    }
                },

                packages: {
                    pako: {
                        defaultExtension: 'js',
                        main: './index.js'
                    }
                },

                bundles: {},

                map: {
                    "app": "app",
                    'systemjs-json-plugin': 'https://unpkg.com/systemjs-plugin-json@0.3.0',
                    //React packages
                    "react": "https://unpkg.com/react@16.0.0/umd/react.production.min.js",
                    "react-dom": "https://unpkg.com/react-dom@16.0.0/umd/react-dom.production.min.js",
                    "react-dom/server": "https://unpkg.com/react-dom@16.0.0/umd/react-dom-server.browser.production.min.js",
                    "redux": "https://unpkg.com/redux@3.7.2/dist/redux.min.js",
                    "react-redux": "https://unpkg.com/react-redux@5.0.6/dist/react-redux.min.js",
                    "react-router": "https://unpkg.com/react-router@4.2.0/umd/react-router.min.js",
                    "react-router-dom": "https://unpkg.com/react-router-dom@4.2.2/umd/react-router-dom.min.js",
                    "react-transition-group": "https://unpkg.com/react-transition-group@2.2.1/dist/react-transition-group.min.js",
                    "prop-types": "https://unpkg.com/prop-types@15.6.0/prop-types.js",
                    // Misc packages used by the kendo-react-* packages
                    'tslib': 'https://unpkg.com/tslib@1.7.1',
                    'hammerjs': 'https://unpkg.com/hammerjs@2.0.8',
                    "pako": "https://unpkg.com/pako@1.0.5",
                    'cldr-data': npmUrl + '/cldr-data',
                    'api-ai-javascript': 'https://unpkg.com/api-ai-javascript@2.0.0-beta.21/index.js',
                    'adaptivecards': 'https://unpkg.com/adaptivecards@1.0.0/lib/adaptivecards.js',
                    'botframework-directlinejs': 'https://unpkg.com/botframework-directlinejs@0.9.15/directLine.js',
                    'marked': 'https://unpkg.com/marked@0.3.19/lib/marked.js',
                    //Inhouse pacakges
                    '@telerik': npmUrl + '/@telerik',
                    '@progress': npmUrl + '/@progress'
                }
            };

            /* Use appropriate configuration based on demo language */
            if (language === 'ts') {
                addTSConfiguration(config);
            } else {
                /* Support both js and jsx */
                addBabelConfiguration(config, language);
            }

            /* Add Kendo Packages */
            modules.forEach(function(kendoPackage) {
                /* Only include legacy Kendo UI configuration when it is included into the auto imports */
                if (kendoPackage.module === '@progress/kendo-ui') {
                    /* Map kendo-ui && add package configuration */
                    config.map[kendoConfiguration.module] = kendoConfiguration.path;

                    config.packages[kendoConfiguration.module] = {
                        main: kendoPackage.main || 'js/kendo.all.js',
                        defaultExtension: 'js'
                    };
                } else if (kendoPackage.module === 'jquery') {
                    /* Map jQuery */
                    config.map[jqueryConfiguration.module] = jqueryConfiguration.path;
                } else if (!SYSTEM_BUNDLES.filter(function(bundle) { return bundle.name === kendoPackage.module; }).length) {
                    config.packages[kendoPackage.module] = {
                        main: kendoPackage.main || 'dist/cdn/js/'.concat(kendoPackage.module.replace(/(@progress\/|@telerik\/)/, ''), '.js'),
                        defaultExtension: kendoPackage.defaultExtension || 'js'
                    };
                }
            });

            if (trackjs) {
                config.packages['raven-js'] = {
                    main: 'dist/raven.js'
                };

                config.paths = {
                    'raven-js': npmUrl + "/raven-js"
                };
            }

            SYSTEM_BUNDLES.forEach(function(bundle) {
                var paths = [ bundle.name ];
                if (bundle.modules) {
                    paths.push(bundle.name + '/*');
                }
                config.bundles[npmUrl + "/" + bundle.name + "/dist/systemjs/" + bundle.file] = paths;

                if (bundle.map) {
                    config.packages[bundle.name] = {
                        defaultExtension: 'js'
                    };
                }
            });

            return config;
        },
        angular: function(options) {
            var npmUrl = options.npmUrl;
            var modules = options.modules;
            var trackjs = options.trackjs;
            var ngVer = '@5.2.2'; // lock in the angular package version; do not let it float to current!
            var SYSTEM_BUNDLES = [ {
                name: "@progress/kendo-drawing",
                file: "kendo-drawing.js",
                modules: true
            }, {
                name: "@progress/kendo-charts",
                file: "kendo-charts.js"
            }, {
                name: "@progress/kendo-angular-charts",
                file: "kendo-angular-charts.js"
            }, {
                name: "@progress/kendo-angular-gauges",
                file: "kendo-angular-gauges.js"
            }, {
                name: "@progress/kendo-angular-gauges",
                file: "kendo-angular-gauges.js"
            }, {
                name: "@progress/kendo-angular-resize-sensor",
                file: "kendo-angular-resize-sensor.js"
            }, {
                name: "@telerik/kendo-intl",
                file: "kendo-intl.js"
            }, {
                name: "@progress/kendo-angular-intl",
                file: "kendo-angular-intl.js",
                map: true
            } ];

            var config = {
                transpiler: 'ts',
                typescriptOptions: {
                    target: 'es5',
                    module: 'system',
                    moduleResolution: 'node',
                    sourceMap: true,
                    emitDecoratorMetadata: true,
                    experimentalDecorators: true,
                    removeComments: false,
                    noImplicitAny: true,
                    suppressImplicitAnyIndexErrors: true
                },
                bundles: {
                    "https://unpkg.com/rxjs-system-bundle@5.5.6/Rx.system.min.js": [
                        "rxjs",
                        "rxjs/*",
                        "rxjs/operator/*",
                        "rxjs/operators/*",
                        "rxjs/observable/*",
                        "rxjs/scheduler/*",
                        "rxjs/symbol/*",
                        "rxjs/add/operator/*",
                        "rxjs/add/observable/*",
                        "rxjs/util/*"
                    ]
                },
                meta: {
                    'typescript': {
                        'exports': 'ts'
                    },
                    '*.json': {
                        loader: 'systemjs-json-plugin'
                    }
                }
            };

            // map tells the System loader where to look for things
            var map = {
                'app': 'app',
                'systemjs-json-plugin': 'https://unpkg.com/systemjs-plugin-json@0.3.0',
                '@telerik': npmUrl + '/@telerik',
                '@progress': npmUrl + '/@progress',
                'cldr-data': npmUrl + '/cldr-data',
                '@angular': 'https://unpkg.com/@angular', // sufficient if we didn't pin the version
                'angular2-in-memory-web-api': 'https://unpkg.com/angular2-in-memory-web-api', // get latest
                'api-ai-javascript': 'https://unpkg.com/api-ai-javascript@2.0.0-beta.21/index.js',
                'marked': 'https://unpkg.com/marked@0.3.19/lib/marked.js',
                'hammerjs': 'https://unpkg.com/hammerjs@2.0.8',
                'pako': 'https://unpkg.com/pako@1.0.5',
                'ts': 'https://unpkg.com/plugin-typescript@5.3.3/lib/plugin.js',
                'tslib': 'https://unpkg.com/tslib@1.7.1',
                'typescript': 'https://unpkg.com/typescript@2.4.2/lib/typescript.js',
                'adaptivecards': 'https://unpkg.com/adaptivecards@1.0.0/lib/adaptivecards.js',
                'botframework-directlinejs': 'https://unpkg.com/botframework-directlinejs@0.9.15/built/directLine.js',

                // explicitly add subpackages
                '@angular/common/http': 'https://unpkg.com/@angular/common' + ngVer + '/bundles/common-http.umd.js',
                '@angular/platform-browser/animations': 'https://unpkg.com/@angular/platform-browser' + ngVer + '/bundles/platform-browser-animations.umd.js',
                '@angular/animations/browser': 'https://unpkg.com/@angular/animations' + ngVer + '/bundles/animations-browser.umd.js'
            };

            var packages = {
                'app': {
                    main: './main.ts',
                    defaultExtension: 'ts'
                },
                rxjs: {
                    defaultExtension: false
                },
                pako: {
                    defaultExtension: 'js',
                    main: './index.js'
                }
            };

            if (trackjs) {
                packages['raven-js'] = {
                    main: 'dist/raven.js'
                };

                config.paths = {
                    'raven-js': npmUrl + "/raven-js"
                };
            }

            var ngPackageNames = [
                'common',
                'compiler',
                'forms',
                'core',
                'platform-browser',
                'platform-browser-dynamic',
                'router',
                'upgrade'
            ];

            // Add map entries for each angular package
            // only because we're pinning the version with `ngVer`.
            ngPackageNames.forEach(function(pkgName) {
                map['@angular/' + pkgName] = 'https://unpkg.com/@angular/' + pkgName + ngVer;
            });

            // Add package entries for angular packages
            ngPackageNames.concat([ 'forms', 'animations' ]).forEach(function(pkgName) {
                packages['@angular/' + pkgName] = { main: '/bundles/' + pkgName + '.umd.js' };
            });

            modules.forEach(function(directive) {
                if (!SYSTEM_BUNDLES.filter(function(bundle) { return bundle.name === directive.module; }).length) {
                    packages[directive.module] = {
                        main: directive.main || 'dist/npm/js/main.js',
                        defaultExtension: directive.defaultExtension || 'js'
                    };
                }
            });

            SYSTEM_BUNDLES.forEach(function(bundle) {
                var paths = [ bundle.name ];
                if (bundle.modules) {
                    paths.push(bundle.name + '/*');
                }
                config.bundles[npmUrl + "/" + bundle.name + "/dist/systemjs/" + bundle.file] = paths;

                if (bundle.map) {
                    packages[bundle.name] = {
                        defaultExtension: 'js'
                    };
                }
            });

            config.map = map;
            config.packages = packages;

            return config;
        }
    };

    function ExampleRunner(platform) {
        this.platform = platform;
    }

    ExampleRunner.prototype = {
        configure: function(system, options) {
            system.config(systemjsConfig[this.platform](options));

            // allow mocking of files via custom fetch function
            this.files = {};

            var files = this.files;

            var systemFetch = system.fetch;
            system.fetch = function(metadata) {
                var requestedFile = metadata.name;

                for (var mockedFile in files) {
                    if (!files.hasOwnProperty(mockedFile)) {
                        continue;
                    }

                    if (endsWith(requestedFile, mockedFile)) {
                        return files[mockedFile];
                    }
                }

                return systemFetch.apply(this, Array.prototype.slice.call(arguments));
            };
        },

        register: function(filename, content) {
            this.files['app/' + filename] = content;
        },
        /* eslint no-console: 0 */
        start: function(system) {
            system.import('app').catch(console.error.bind(console));
        }
    };

    ExampleRunner.systemjsConfig = function(platform) {
        return systemjsConfig[platform];
    };

    return ExampleRunner;
})();
