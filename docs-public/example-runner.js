var ExampleRunner = (function() {
    function endsWith(content, search) {
        var position = content.length - search.length;
        var lastIndex = content.indexOf(search, position);
        return lastIndex !== -1 && lastIndex === position;
    };

    function ExampleRunner() {}
    ExampleRunner.prototype = {
        // configures SystemJS to run with modules cloned to /npm
        // and cdn versions of angular / rxjs
        configure: function(system, npmUrl, modules, trackjs) {

            var ngVer = '@4.0.1'; // lock in the angular package version; do not let it float to current!

            //map tells the System loader where to look for things
            var map = {
                'app':                        '/demos-src',
                'systemjs-json-plugin':       'npm:systemjs-plugin-json',
                '@telerik':                   npmUrl + '/@telerik',
                '@progress':                  npmUrl + '/@progress',
                'cldr-data':                  npmUrl + '/cldr-data',
                '@angular':                   'https://unpkg.com/@angular', // sufficient if we didn't pin the version
                'angular2-in-memory-web-api': 'https://unpkg.com/angular2-in-memory-web-api', // get latest
                'rxjs':                       'https://unpkg.com/rxjs@5',
                'hammerjs':                   'https://unpkg.com/hammerjs@2',
                'ts':                         'https://unpkg.com/plugin-typescript@5/lib/plugin.js',
                'typescript':                 'https://unpkg.com/typescript@2.2/lib/typescript.js',
            };

            var packages = {
                app: {
                    main: './main.ts',
                    defaultExtension: 'ts'
                },
                rxjs: {
                    defaultExtension: 'js'
                },
                'chroma-js': {
                    defaultExtension: 'js'
                }
            };

            var paths = {};

            if(trackjs) {
                packages['raven-js'] = {
                    main: 'dist/raven.js'
                };

                paths['raven-js'] = npmUrl + "/raven-js";
            }

            var ngPackageNames = [
                'common',
                'compiler',
                'forms',
                'core',
                'http',
                'platform-browser',
                'platform-browser-dynamic',
                'upgrade',
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

            // Explicitly add the http/testing package. Required for MockBackend
            map['@angular/http/testing'] = 'https://unpkg.com/@angular/http' + ngVer + '/bundles/http-testing.umd.js';
            map['@angular/platform-browser/animations'] = 'https://unpkg.com/@angular/platform-browser' + ngVer + '/bundles/platform-browser-animations.umd.js';
            map['@angular/animations/browser'] = 'https://unpkg.com/@angular/animations' + ngVer + '/bundles/animations-browser.umd.js';

            modules.forEach(function(directive) {
                packages[directive.module] = {
                    main: directive.main || 'dist/npm/js/main.js',
                    defaultExtension: directive.defaultExtension || 'js'
                };
            });

            system.config({
                paths: paths,
                transpiler: 'typescript',
                typescriptOptions: {
                    diagnostics: true,
                    emitDecoratorMetadata: true
                },
                meta: {
                  '*.json': {
                    loader: 'systemjs-json-plugin'
                  }
                },
                map: map,
                packages: packages
            });

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
            this.files['demos-src/' + filename] = content;
        },
        start: function(system) {
            system.import('app').catch(console.error.bind(console));
        }
    };

    return ExampleRunner;
})();
