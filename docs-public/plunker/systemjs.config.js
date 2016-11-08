(function (global) {
  var angularVersion = '2.0.0';

  System.config({
    // DEMO ONLY! REAL CODE SHOULD NOT TRANSPILE IN THE BROWSER
    transpiler: 'ts',
    typescriptOptions: {
      tsconfig: true
    },
    meta: {
      'typescript': {
        "exports": "ts"
      }
    },
    paths: {
      // paths serve as alias
      'npm:': 'https://unpkg.com/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',
      '@progress': '#= npmUrl #@progress',
      '@telerik': '#= npmUrl #@telerik',

      // angular bundles
      '@angular/core': 'npm:@angular/core@' + angularVersion +'/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common@' + angularVersion +'/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler@' + angularVersion +'/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser@' + angularVersion +'/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@' + angularVersion +'/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http@' + angularVersion +'/bundles/http.umd.js',
      '@angular/forms': 'npm:@angular/forms@' + angularVersion + '/bundles/forms.umd.js',
      '@angular/router': 'npm:@angular/router@3.0.0-rc.3/bundles/router.umd.js',

      // other libraries
      'rxjs':                       'npm:rxjs',
      'chroma-js':                  'npm:chroma-js@1.2.1',
      'angular2-in-memory-web-api': 'npm:angular2-in-memory-web-api',
      'ts':                         'npm:plugin-typescript@4.0.10/lib/plugin.js',
      'typescript':                 'npm:typescript@1.9.0-dev.20160409/lib/typescript.js'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      #= systemjsPackages #

      '@telerik/kendo-inputs-common': {
          defaultExtension: 'js',
          main: "./dist/npm/js/main.js"
      },
      '@telerik/kendo-draggable': {
          defaultExtension: 'js',
          main: "./dist/npm/js/Draggable.js"
      },
      '@telerik/kendo-dropdowns-common': {
          defaultExtension: 'js',
          main: "./dist/npm/js/main.js"
      },
      '@telerik/kendo-intl': {
          defaultExtension: 'js',
          main: "./dist/npm/js/main.js"
      },
      '@progress/kendo-angular-intl': {
          defaultExtension: 'js',
          main: "./dist/npm/js/main.js"
      },
      '@progress/kendo-angular-popup': {
          defaultExtension: 'js',
          main: "./dist/npm/js/main.js"
      },
      '@progress/kendo-angular-resize-sensor': {
          defaultExtension: 'js',
          main: "./dist/npm/js/main.js"
      },
      '@progress/kendo-charts': {
          defaultExtension: 'js',
          main: "./dist/npm/js/main.js"
      },
      '@progress/kendo-drawing': {
          defaultExtension: 'js',
          main: "./dist/npm/js/main.js"
      },
      '@progress/kendo-data-query': {
	  defaultExtension: 'js',
	  main: "./dist/npm/js/main.js"
      },
      '@progress/kendo-popup-common': {
          defaultExtension: 'js',
          main: "./dist/npm/js/main.js"
      },

      app: {
        main: './main.ts',
        defaultExtension: 'ts'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'angular2-in-memory-web-api': {
        main: './index.js',
        defaultExtension: 'js'
      }
    }
  });
})(this);
