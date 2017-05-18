(function (global) {
  var angularVersion = '4.1.2';

  System.config({
    // DEMO ONLY! REAL CODE SHOULD NOT TRANSPILE IN THE BROWSER
    transpiler: 'ts',
    typescriptOptions: {
      tsconfig: true
    },
    meta: {
      'typescript': {
        "exports": "ts"
      },
      '*.json': {
        loader: 'systemjs-json-plugin'
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
      'systemjs-json-plugin': 'npm:systemjs-plugin-json',
      '@progress': '#= npmUrl #@progress',
      '@telerik': '#= npmUrl #@telerik',
      'cldr-data': '#= npmUrl #cldr-data',

      // angular bundles
      '@angular/animations': 'npm:@angular/animations@' + angularVersion +'/bundles/animations.umd.js',
      '@angular/animations/browser': 'npm:@angular/animations@' + angularVersion +'/bundles/animations-browser.umd.js',
      '@angular/core': 'npm:@angular/core@' + angularVersion +'/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common@' + angularVersion +'/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler@' + angularVersion +'/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser@' + angularVersion +'/bundles/platform-browser.umd.js',
      '@angular/platform-browser/animations': 'npm:@angular/platform-browser@' + angularVersion +'/bundles/platform-browser-animations.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@' + angularVersion +'/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http@' + angularVersion +'/bundles/http.umd.js',
      '@angular/http/testing': 'npm:@angular/http@' + angularVersion +'/bundles/http-testing.umd.js',
      '@angular/forms': 'npm:@angular/forms@' + angularVersion + '/bundles/forms.umd.js',
      '@angular/router': 'npm:@angular/router@' + angularVersion + '/bundles/router.umd.js',

      // other libraries
      'rxjs':                       'npm:rxjs',
      'hammerjs':                   'npm:hammerjs@2',
      'angular2-in-memory-web-api': 'npm:angular2-in-memory-web-api',
      'ts':                         'npm:plugin-typescript@5/lib/plugin.js',
      'typescript':                 'npm:typescript@2.2/lib/typescript.js'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      #= systemjsPackages #

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
