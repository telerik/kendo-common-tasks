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
                'chroma-js': {
                    defaultExtension: 'js'
                },
                //TODO Temporary solution for common modules
                '@telerik/kendo-inputs-common': {
                    defaultExtension: 'js'
                },
                '@telerik/kendo-draggable': {
                    defaultExtension: 'js',
                    main: "dist/npm/js/Draggable.js"
                },
                '@telerik/kendo-dropdowns-common': {
                    defaultExtension: 'js',
                    main: "dist/npm/js/bundle.js"
                },
                '@progress/kendo-charts': {
                    defaultExtension: 'js',
                    main: "dist/npm/js/main.js"
                },
                '@progress/kendo-drawing': {
                    defaultExtension: 'js',
                    main: "dist/npm/js/main.js"
                },
                '@progress/kendo-popup-common': {
                    defaultExtension: 'js',
                    main: "dist/npm/js/bundle.js"
                }
            };

            modules.forEach(function(directive) {
                packages[directive.module] = {
                  main: directive.main || 'dist/npm/js/main.js',
                  defaultExtension: directive.defaultExtension || 'js'
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
                '@angular': 'https://unpkg.com/@angular',
                'rxjs': 'https://unpkg.com/rxjs@5.0.0-beta.6',
                'chroma-js': 'https://unpkg.com/chroma-js@1.2.1'
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
