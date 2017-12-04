/* eslint no-var: 0 */
window.ExampleRunner = (function() {
    function endsWith(content, search) {
        var position = content.length - search.length;
        var lastIndex = content.indexOf(search, position);
        return lastIndex !== -1 && lastIndex === position;
    }

    var systemjsConfig = {
        react: function(npmUrl, modules, trackjs) {
            var config = {
                transpiler: "plugin-babel",

                meta: {
                    '*.json': {
                        loader: 'systemjs-json-plugin'
                    },
                    '*.jsx': {
                        babelOptions: {
                            react: true
                        }
                    }
                },

                packages: {
                    'app': {
                        main: './main.jsx',
                        defaultExtension: 'jsx'
                    }
                },

                map: {
                    "app": "app",
                    'systemjs-json-plugin': 'https://unpkg.com/systemjs-plugin-json@0.3.0',
                    //Babel transpiler
                    "plugin-babel": "https://unpkg.com/systemjs-plugin-babel@0.0.25/plugin-babel.js",
                    'systemjs-babel-build': 'https://unpkg.com/systemjs-plugin-babel@0.0.25/systemjs-babel-browser.js',
                    //React packages
                    "react": "https://unpkg.com/react@16.0.0/umd/react.production.min.js",
                    "react-dom": "https://unpkg.com/react-dom@16.0.0/umd/react-dom.production.min.js",
                    "redux": "https://unpkg.com/redux@3.7.2/dist/redux.min.js",
                    "react-redux": "https://unpkg.com/react-redux@5.0.6/dist/react-redux.min.js",
                    "react-router": "https://unpkg.com/react-router@4.2.0/umd/react-router.min.js",
                    "react-router-dom": "https://unpkg.com/react-router-dom@4.2.2/umd/react-router-dom.min.js",
                    "react-transition-group": "https://unpkg.com/react-transition-group@2.2.1/dist/react-transition-group.min.js",
                    "prop-types": "https://unpkg.com/prop-types@15.6.0/prop-types.js",
                    // Misc packages used by the kendo-react-* packages
                    "classnames": "https://unpkg.com/classnames",
                    'cldr-data': npmUrl + '/cldr-data',
                    //Inhouse pacakges
                    '@telerik': npmUrl + '/@telerik',
                    '@progress': npmUrl + '/@progress',
                    //Legacy kendo
                    "jquery": "https://unpkg.com/jquery@3.2.1/dist/jquery.js",
                    "kendo.culture.en-GB.min": npmUrl + '/@progress' + "/cultures/kendo.culture.en-GB.min.js",
                    "kendo.messages.en-GB.min": npmUrl + '/@progress' + "/messages/kendo.messages.en-GB.min.js",
                    "kendo.autocomplete.min": npmUrl + '/@progress' + "/kendo.autocomplete.min.js",
                    "kendo.binder.min": npmUrl + '/@progress' + "/kendo.binder.min.js",
                    "kendo.button.min": npmUrl + '/@progress' + "/kendo.button.min.js",
                    "kendo.calendar.min": npmUrl + '/@progress' + "/kendo.calendar.min.js",
                    "kendo.color.min": npmUrl + '/@progress' + "/kendo.color.min.js",
                    "kendo.colorpicker.min": npmUrl + '/@progress' + "/kendo.colorpicker.min.js",
                    "kendo.columnmenu.min": npmUrl + '/@progress' + "/kendo.columnmenu.min.js",
                    "kendo.columnsorter.min": npmUrl + '/@progress' + "/kendo.columnsorter.min.js",
                    "kendo.combobox.min": npmUrl + '/@progress' + "/kendo.combobox.min.js",
                    "kendo.core.min": npmUrl + '/@progress' + "/kendo.core.min.js",
                    "kendo.data.min": npmUrl + '/@progress' + "/kendo.data.min.js",
                    "kendo.data.odata.min": npmUrl + '/@progress' + "/kendo.data.odata.min.js",
                    "kendo.data.signalr.min": npmUrl + '/@progress' + "/kendo.data.signalr.min.js",
                    "kendo.data.xml.min": npmUrl + '/@progress' + "/kendo.data.xml.min.js",
                    "kendo.datepicker.min": npmUrl + '/@progress' + "/kendo.datepicker.min.js",
                    "kendo.datetimepicker.min": npmUrl + '/@progress' + "/kendo.datetimepicker.min.js",
                    "kendo.dialog.min": npmUrl + '/@progress' + "/kendo.dialog.min.js",
                    "kendo.dom.min": npmUrl + '/@progress' + "/kendo.dom.min.js",
                    "kendo.draganddrop.min": npmUrl + '/@progress' + "/kendo.draganddrop.min.js",
                    "kendo.dropdownlist.min": npmUrl + '/@progress' + "/kendo.dropdownlist.min.js",
                    "kendo.editable.min": npmUrl + '/@progress' + "/kendo.editable.min.js",
                    "kendo.excel.min": npmUrl + '/@progress' + "/kendo.excel.min.js",
                    "kendo.filebrowser.min": npmUrl + '/@progress' + "/kendo.filebrowser.min.js",
                    "kendo.filtercell.min": npmUrl + '/@progress' + "/kendo.filtercell.min.js",
                    "kendo.filtermenu.min": npmUrl + '/@progress' + "/kendo.filtermenu.min.js",
                    "kendo.fx.min": npmUrl + '/@progress' + "/kendo.fx.min.js",
                    "kendo.gantt.list.min": npmUrl + '/@progress' + "/kendo.gantt.list.min.js",
                    "kendo.gantt.timeline.min": npmUrl + '/@progress' + "/kendo.gantt.timeline.min.js",
                    "kendo.groupable.min": npmUrl + '/@progress' + "/kendo.groupable.min.js",
                    "kendo.imagebrowser.min": npmUrl + '/@progress' + "/kendo.imagebrowser.min.js",
                    "kendo.list.min": npmUrl + '/@progress' + "/kendo.list.min.js",
                    "kendo.listview.min": npmUrl + '/@progress' + "/kendo.listview.min.js",
                    "kendo.maskedtextbox.min": npmUrl + '/@progress' + "/kendo.maskedtextbox.min.js",
                    "kendo.mediaplayer.min": npmUrl + '/@progress' + "/kendo.mediaplayer.min.js",
                    "kendo.menu.min": npmUrl + '/@progress' + "/kendo.menu.min.js",
                    "kendo.mobile.actionsheet.min": npmUrl + '/@progress' + "/kendo.mobile.actionsheet.min.js",
                    "kendo.mobile.application.min": npmUrl + '/@progress' + "/kendo.mobile.application.min.js",
                    "kendo.mobile.button.min": npmUrl + '/@progress' + "/kendo.mobile.button.min.js",
                    "kendo.mobile.buttongroup.min": npmUrl + '/@progress' + "/kendo.mobile.buttongroup.min.js",
                    "kendo.mobile.collapsible.min": npmUrl + '/@progress' + "/kendo.mobile.collapsible.min.js",
                    "kendo.mobile.drawer.min": npmUrl + '/@progress' + "/kendo.mobile.drawer.min.js",
                    "kendo.mobile.listview.min": npmUrl + '/@progress' + "/kendo.mobile.listview.min.js",
                    "kendo.mobile.loader.min": npmUrl + '/@progress' + "/kendo.mobile.loader.min.js",
                    "kendo.mobile.modalview.min": npmUrl + '/@progress' + "/kendo.mobile.modalview.min.js",
                    "kendo.mobile.navbar.min": npmUrl + '/@progress' + "/kendo.mobile.navbar.min.js",
                    "kendo.mobile.pane.min": npmUrl + '/@progress' + "/kendo.mobile.pane.min.js",
                    "kendo.mobile.popover.min": npmUrl + '/@progress' + "/kendo.mobile.popover.min.js",
                    "kendo.mobile.scroller.min": npmUrl + '/@progress' + "/kendo.mobile.scroller.min.js",
                    "kendo.mobile.scrollview.min": npmUrl + '/@progress' + "/kendo.mobile.scrollview.min.js",
                    "kendo.mobile.shim.min": npmUrl + '/@progress' + "/kendo.mobile.shim.min.js",
                    "kendo.mobile.splitview.min": npmUrl + '/@progress' + "/kendo.mobile.splitview.min.js",
                    "kendo.mobile.switch.min": npmUrl + '/@progress' + "/kendo.mobile.switch.min.js",
                    "kendo.mobile.tabstrip.min": npmUrl + '/@progress' + "/kendo.mobile.tabstrip.min.js",
                    "kendo.mobile.view.min": npmUrl + '/@progress' + "/kendo.mobile.view.min.js",
                    "kendo.multiselect.min": npmUrl + '/@progress' + "/kendo.multiselect.min.js",
                    "kendo.notification.min": npmUrl + '/@progress' + "/kendo.notification.min.js",
                    "kendo.numerictextbox.min": npmUrl + '/@progress' + "/kendo.numerictextbox.min.js",
                    "kendo.ooxml.min": npmUrl + '/@progress' + "/kendo.ooxml.min.js",
                    "kendo.pager.min": npmUrl + '/@progress' + "/kendo.pager.min.js",
                    "kendo.panelbar.min": npmUrl + '/@progress' + "/kendo.panelbar.min.js",
                    "kendo.pivot.configurator.min": npmUrl + '/@progress' + "/kendo.pivot.configurator.min.js",
                    "kendo.pivot.fieldmenu.min": npmUrl + '/@progress' + "/kendo.pivot.fieldmenu.min.js",
                    "kendo.pivotgrid.min": npmUrl + '/@progress' + "/kendo.pivotgrid.min.js",
                    "kendo.popup.min": npmUrl + '/@progress' + "/kendo.popup.min.js",
                    "kendo.progressbar.min": npmUrl + '/@progress' + "/kendo.progressbar.min.js",
                    "kendo.reorderable.min": npmUrl + '/@progress' + "/kendo.reorderable.min.js",
                    "kendo.resizable.min": npmUrl + '/@progress' + "/kendo.resizable.min.js",
                    "kendo.responsivepanel.min": npmUrl + '/@progress' + "/kendo.responsivepanel.min.js",
                    "kendo.router.min": npmUrl + '/@progress' + "/kendo.router.min.js",
                    "kendo.scheduler.agendaview.min": npmUrl + '/@progress' + "/kendo.scheduler.agendaview.min.js",
                    "kendo.scheduler.dayview.min": npmUrl + '/@progress' + "/kendo.scheduler.dayview.min.js",
                    "kendo.scheduler.monthview.min": npmUrl + '/@progress' + "/kendo.scheduler.monthview.min.js",
                    "kendo.scheduler.recurrence.min": npmUrl + '/@progress' + "/kendo.scheduler.recurrence.min.js",
                    "kendo.scheduler.timelineview.min": npmUrl + '/@progress' + "/kendo.scheduler.timelineview.min.js",
                    "kendo.scheduler.view.min": npmUrl + '/@progress' + "/kendo.scheduler.view.min.js",
                    "kendo.selectable.min": npmUrl + '/@progress' + "/kendo.selectable.min.js",
                    "kendo.slider.min": npmUrl + '/@progress' + "/kendo.slider.min.js",
                    "kendo.sortable.min": npmUrl + '/@progress' + "/kendo.sortable.min.js",
                    "kendo.splitter.min": npmUrl + '/@progress' + "/kendo.splitter.min.js",
                    "kendo.tabstrip.min": npmUrl + '/@progress' + "/kendo.tabstrip.min.js",
                    "kendo.timepicker.min": npmUrl + '/@progress' + "/kendo.timepicker.min.js",
                    "kendo.timezones.min": npmUrl + '/@progress' + "/kendo.timezones.min.js",
                    "kendo.toolbar.min": npmUrl + '/@progress' + "/kendo.toolbar.min.js",
                    "kendo.tooltip.min": npmUrl + '/@progress' + "/kendo.tooltip.min.js",
                    "kendo.touch.min": npmUrl + '/@progress' + "/kendo.touch.min.js",
                    "kendo.treelist.min": npmUrl + '/@progress' + "/kendo.treelist.min.js",
                    "kendo.treeview.draganddrop.min": npmUrl + '/@progress' + "/kendo.treeview.draganddrop.min.js",
                    "kendo.treeview.min": npmUrl + '/@progress' + "/kendo.treeview.min.js",
                    "kendo.upload.min": npmUrl + '/@progress' + "/kendo.upload.min.js",
                    "kendo.userevents.min": npmUrl + '/@progress' + "/kendo.userevents.min.js",
                    "kendo.validator.min": npmUrl + '/@progress' + "/kendo.validator.min.js",
                    "kendo.view.min": npmUrl + '/@progress' + "/kendo.view.min.js",
                    "kendo.virtuallist.min": npmUrl + '/@progress' + "/kendo.virtuallist.min.js",
                    "kendo.window.min": npmUrl + '/@progress' + "/kendo.window.min.js",
                    "pako_deflate.min": npmUrl + '/@progress' + "/pako_deflate.min.js",
                    "kendoaspnetmvc": npmUrl + '/@progress' + "/kendo.aspnetmvc.min.js",
                    "kendodatavizbarcode": npmUrl + '/@progress' + "/kendo.dataviz.barcode.min.js",
                    "kendodatavizchart": npmUrl + '/@progress' + "/kendo.dataviz.chart.min.js",
                    "kendodatavizcore": npmUrl + '/@progress' + "/kendo.dataviz.core.min.js",
                    "kendodatavizdiagram": npmUrl + '/@progress' + "/kendo.dataviz.diagram.min.js",
                    "kendodatavizgauge": npmUrl + '/@progress' + "/kendo.dataviz.gauge.min.js",
                    "kendodatavizmap": npmUrl + '/@progress' + "/kendo.dataviz.map.min.js",
                    "kendodatavizqrcode": npmUrl + '/@progress' + "/kendo.dataviz.qrcode.min.js",
                    "kendodatavizsparkline": npmUrl + '/@progress' + "/kendo.dataviz.sparkline.min.js",
                    "kendodatavizstock": npmUrl + '/@progress' + "/kendo.dataviz.stock.min.js",
                    "kendodatavizthemes": npmUrl + '/@progress' + "/kendo.dataviz.themes.min.js",
                    "kendodataviztreemap": npmUrl + '/@progress' + "/kendo.dataviz.treemap.min.js",
                    "kendodrawing": npmUrl + '/@progress' + "/kendo.drawing.min.js",
                    "kendoeditor": npmUrl + '/@progress' + "/kendo.editor.min.js",
                    "kendogantt": npmUrl + '/@progress' + "/kendo.gantt.min.js",
                    "kendogrid": npmUrl + '/@progress' + "/kendo.grid.min.js",
                    "kendopdf": npmUrl + '/@progress' + "/kendo.pdf.min.js",
                    "kendoscheduler": npmUrl + '/@progress' + "/kendo.scheduler.min.js"
                },
                bundles: {
                    "kendogrid": [ "kendo.grid.min" ],
                    "kendoaspnetmvc": [ "kendo.aspnetmvc.min" ],
                    "kendodatavizbarcode": [ "kendo.dataviz.barcode.min" ],
                    "kendodatavizchart": [ "kendo.dataviz.chart.min" ],
                    "kendodatavizcore": [ "kendo.dataviz.core.min" ],
                    "kendodatavizdiagram": [ "kendo.dataviz.diagram.min" ],
                    "kendodatavizgauge": [ "kendo.dataviz.gauge.min" ],
                    "kendodatavizmap": [ "kendo.dataviz.map.min" ],
                    "kendodatavizqrcode": [ "kendo.dataviz.qrcode.min" ],
                    "kendodatavizsparkline": [ "kendo.dataviz.sparkline.min" ],
                    "kendodatavizstock": [ "kendo.dataviz.stock.min" ],
                    "kendodatavizthemes": [ "kendo.dataviz.themes.min" ],
                    "kendodataviztreemap": [ "kendo.dataviz.treemap.min" ],
                    "kendodrawing": [ "kendo.drawing.min" ],
                    "kendoeditor": [ "kendo.editor.min" ],
                    "kendogantt": [ "kendo.gantt.min" ],
                    "kendopdf": [ "kendo.pdf.min" ],
                    "kendoscheduler": [ "kendo.scheduler.min" ]
                }
            };

            /* Add Kendo Packages */
            modules.forEach(function(kendoPackage) {
                config.packages[kendoPackage.module] = {
                    main: kendoPackage.main,
                    defaultExtension: kendoPackage.defaultExtension || 'js'
                };
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
        angular: function(npmUrl, modules, trackjs) {
            var ngVer = '@5.0.0'; // lock in the angular package version; do not let it float to current!
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
                    "https://unpkg.com/rxjs-system-bundle@5.5.2/Rx.system.min.js": [
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
                'app': 'app',
                'systemjs-json-plugin': 'https://unpkg.com/systemjs-plugin-json@0.3.0',
                '@telerik': npmUrl + '/@telerik',
                '@progress': npmUrl + '/@progress',
                'cldr-data': npmUrl + '/cldr-data',
                '@angular': 'https://unpkg.com/@angular', // sufficient if we didn't pin the version
                'angular2-in-memory-web-api': 'https://unpkg.com/angular2-in-memory-web-api', // get latest
                'hammerjs': 'https://unpkg.com/hammerjs@2.0.8',
                'pako': 'https://unpkg.com/pako@1.0.5',
                'ts': 'https://unpkg.com/plugin-typescript@5.3.3/lib/plugin.js',
                'tslib': 'https://unpkg.com/tslib@1.7.1',
                'typescript': 'https://unpkg.com/typescript@2.4.2/lib/typescript.js',

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
        configure: function(system, npmUrl, modules, trackjs) {
            system.config(systemjsConfig[this.platform](npmUrl, modules, trackjs));

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
