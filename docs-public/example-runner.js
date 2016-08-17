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
        configure: function(system, npmUrl, modules) {
            var packages = {
                app: {
                    main: './main.ts',
                    defaultExtension: 'ts'
                },
                '@angular/core': {
                    main: 'bundles/core.umd.js',
                    defaultExtension: 'js'
                },
                '@angular/compiler': {
                    main: 'bundles/compiler.umd.js',
                    defaultExtension: 'js'
                },
                '@angular/common': {
                    main: 'bundles/common.umd.js',
                    defaultExtension: 'js'
                },
                '@angular/platform-browser-dynamic': {
                    main: 'bundles/platform-browser-dynamic.umd.js',
                    defaultExtension: 'js'
                },
                '@angular/platform-browser': {
                    main: 'bundles/platform-browser.umd.js',
                    defaultExtension: 'js'
                },
                rxjs: {
                    defaultExtension: 'js'
                },
                //TODO Temporary dependancy for the Charts
                kendo: {
                    defaultExtension: 'js'
                },
                jQuery: {
                    defaultExtension: 'js'
                }
            };

            modules.forEach(function(directive) {
                packages[directive.module] = {
                  main: 'dist/npm/js/main.js',
                  defaultExtension: 'js'
                };
            });

            system.config({
              transpiler: 'typescript',
              typescriptOptions: {
                diagnostics: true,
                emitDecoratorMetadata: true
              },
              map: {
                app: "/demos-src",

                '@telerik': npmUrl + '/@telerik',
                '@progress': npmUrl + '/@progress',
                '@angular': 'https://npmcdn.com/@angular',
                'rxjs': 'https://npmcdn.com/rxjs@5.0.0-beta.6',
                //TODO Temporary dependancy for the Charts
                'kendo': npmUrl + '/kendo',
                'jquery': 'https://code.jquery.com/jquery-2.1.4.min.js'
              },
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
