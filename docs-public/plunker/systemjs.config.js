(function (global) {
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
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

      // angular testing umd bundles
      '@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
      '@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
      '@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
      '@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
      '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
      '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
      '@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',
      '@angular/forms/testing': 'npm:@angular/forms/bundles/forms-testing.umd.js',

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
          defaultExtension: 'js'
      },
      '@telerik/kendo-draggable': {
          defaultExtension: 'js',
          main: "./dist/npm/js/Draggable.js"
      },
      '@telerik/kendo-dropdowns-common': {
          defaultExtension: 'js',
          main: "./dist/npm/js/bundle.js"
      },
      '@telerik/kendo-intl': {
          defaultExtension: 'js',
          main: "dist/npm/js/main.js"
      },
      '@progress/kendo-angular-intl': {
          defaultExtension: 'js',
          main: "dist/npm/js/main.js"
      },
      '@progress/kendo-charts': {
          defaultExtension: 'js',
          main: "./dist/npm/js/main.js"
      },
      '@progress/kendo-drawing': {
          defaultExtension: 'js',
          main: "./dist/npm/js/main.js"
      },
      '@progress/kendo-popup-common': {
          defaultExtension: 'js',
          main: "./dist/npm/js/bundle.js"
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
