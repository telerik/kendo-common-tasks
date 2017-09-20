var ExampleRunner = (function() {
    function endsWith(content, search) {
        var position = content.length - search.length;
        var lastIndex = content.indexOf(search, position);
        return lastIndex !== -1 && lastIndex === position;
    };

    function ExampleRunner() {}
    ExampleRunner.prototype = {
        // returns the runner SystemJS configuration
        // runs with modules cloned to /npm
        // and cdn versions of angular / rxjs
        systemjsConfig: function(npmUrl, modules, trackjs) {
            var ngVer = '@4.2.2'; // lock in the angular package version; do not let it float to current!

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
                "https://unpkg.com/rxjs-system-bundle@5.4.3/Rx.system.min.js": [
                  "rxjs",
                  "rxjs/*",
                  "rxjs/operator/*",
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
                'app':                        'app',
                'systemjs-json-plugin':       'https://unpkg.com/systemjs-plugin-json@0.3.0',
                '@telerik':                   npmUrl + '/@telerik',
                '@progress':                  npmUrl + '/@progress',
                'cldr-data':                  npmUrl + '/cldr-data',
                '@angular':                   'https://unpkg.com/@angular', // sufficient if we didn't pin the version
                'angular2-in-memory-web-api': 'https://unpkg.com/angular2-in-memory-web-api', // get latest
                'hammerjs':                   'https://unpkg.com/hammerjs@2.0.8',
                'pako':                       'https://unpkg.com/pako@1.0.5',
                'ts':                         'https://unpkg.com/plugin-typescript@5.3.3/lib/plugin.js',
                'tslib':                      'https://unpkg.com/tslib@1.7.1',
                'typescript':                 'https://unpkg.com/typescript@2.3.4/lib/typescript.js',

                // explicitly add subpackages
                '@angular/http/testing':                'https://unpkg.com/@angular/http' + ngVer + '/bundles/http-testing.umd.js',
                '@angular/platform-browser/animations': 'https://unpkg.com/@angular/platform-browser' + ngVer + '/bundles/platform-browser-animations.umd.js',
                '@angular/animations/browser':          'https://unpkg.com/@angular/animations' + ngVer + '/bundles/animations-browser.umd.js'
            };

            var packages = {
                app: {
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
                'http',
                'platform-browser',
                'platform-browser-dynamic',
                'upgrade'
            ];

            // Add map entries for each angular package
            // only because we're pinning the version with `ngVer`.
            ngPackageNames.forEach(function(pkgName) {
                map['@angular/'+pkgName] = 'https://unpkg.com/@angular/' + pkgName + ngVer;
            });

            // Add package entries for angular packages
            ngPackageNames.concat(['forms', 'animations']).forEach(function(pkgName) {
                packages['@angular/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.js' };
            });

            modules.forEach(function(directive) {
                packages[directive.module] = {
                    main: directive.main || 'dist/npm/js/main.js',
                    defaultExtension: directive.defaultExtension || 'js'
                };
            });

            config.map = map;
            config.packages = packages;

            return config;
        },

        configure: function(system, npmUrl, modules, trackjs) {
            system.config(this.systemjsConfig(npmUrl, modules, trackjs));

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
        start: function(system) {
            system.import('app').catch(console.error.bind(console));
        }
    };

    return ExampleRunner;
})();
