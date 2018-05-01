/* eslint no-var: 0 */
/* eslint no-invalid-this: 0 */
/* eslint consistent-this: 0 */
/* eslint-env browser, jquery */
/* global kendo */

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this;
        var args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}

var previewTemplate = kendo.template(
    "<ul class='docs-tabstrip' >" +
    "<li class='active'><a href='\\#preview-#= index #' data-toggle='tab'>Example</a></li>" +
    "<li><a href='\\#code-#= index #' data-toggle='tab'>View Source</a></li>" +
    "<li class='editor-container'>" +
    "#= editButtonTemplate #" +
    "</li>" +
    "</ul>" +
    "<div class='tab-content'>" +
    "<div class='tab-pane active tab-preview' id='preview-#= index #'></div>" +
    "<div class='tab-pane tab-code' id='code-#= index #'></div>" +
    "</div>");

var fileListTemplate = kendo.template(
    "<div class='file-list'>" +
    "<ul class='docs-tabstrip'>" +
    "# for (var i = 0; i < files.length; i++) { #" +
    "#var filename = files[i].getAttribute('data-file')#" +
    "#if(i === 0){# <li class='active'> #}else{# <li> #}#" +
    "<a href='\\#filename#=i#-#=index#' data-toggle='tab'>#=filename#</a>" +
    "</li>" +
    "# } #" +
    "</ul>" +
    "<div class='tab-content'></div>" +
    "</div>"
);

var editorTemplate = kendo.template(
    "<div class='dialog-overlay'>" +
    "<div class='editor dialog dialog-enter'>" +
    "<h3>Sandbox</h3>" +
    "<button class='button-close'><span>X</span></button>" +
    "<div class='editor-container'>" +
    "#= editButtonTemplate #" +
    "</div>" +
    "<div class='edit-area clearfix'>" +
    "<div class='col-xs-6 col-md-6 col-lg-6'>" +
    "# for (var i = 0; i < block.types.length; i++) { #" +
    "<div class='pane pane-#: block.types[i].language #' data-code-language='#: block.types[i].label #' />" +
    "# } #" +
    "</div>" +
    "<div class='col-xs-6 col-md-6 col-lg-6'>" +
    "<div class='pane-preview' data-code-language='Preview' />" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>"
);

var htmlTemplate = kendo.template(
    '<!doctype html>\
<html>\
<head>\
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">\
    <link rel="stylesheet" href="#: data.npmUrl #/@progress/kendo-theme-#: data.theme || "default" #/dist/all.css" crossorigin="anonymous" />\
    <style>\
        body { font-family: "RobotoRegular",Helvetica,Arial,sans-serif; font-size: 14px; margin: 0; }\
    </style>\
</head>\
<body>\
    #= data.html #\
</body>\
</html>\
', { useWithBlock: false });

var plunkerTemplate = kendo.template(
    '<!doctype html>\
<html>\
<head>\
    # if (data.platform === \'builder\') { # <base href="#= window.plunkerBluePrintPath + window.platform + "/" #" /> #}# \
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">\
    <link rel="stylesheet" href="#: data.npmUrl #/@progress/kendo-theme-#: data.theme || "default" #/dist/all.css" crossorigin="anonymous" />\
    <style>\
        body { font-family: "RobotoRegular",Helvetica,Arial,sans-serif; font-size: 14px; margin: 0; }\
        my-app, \\#vueapp { display: block; width: 100%; overflow: hidden; min-height: 80px; box-sizing: border-box; padding: 30px; }\
        my-app > .k-icon.k-i-loading, \\#vueapp > .k-icon.k-i-loading { font-size: 64px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }\
        .example-wrapper { min-height: 280px; align-content: flex-start; }\
        .example-wrapper p, .example-col p { margin: 20px 0 10px; }\
        .example-wrapper p:first-child, .example-col p:first-child { margin-top: 0; }\
        .example-col { display: inline-block; vertical-align: top; padding-right: 20px; padding-bottom: 20px; }\
        .example-config { margin: 0 0 20px; padding: 20px; background-color: rgba(0,0,0,.03); border: 1px solid rgba(0,0,0,.08); }\
        .event-log { margin: 0; padding: 0; max-height: 100px; overflow-y: auto; list-style-type: none; border: 1px solid rgba(0,0,0,.08); background-color: \\#fff; }\
        .event-log li {margin: 0; padding: .3em; line-height: 1.2em; border-bottom: 1px solid rgba(0,0,0,.08); }\
        .event-log li:last-child { margin-bottom: -1px;}\
        \\#vueapp:not([v-cloak]) > .k-icon.k-i-loading {display: none }\
        \\#vueapp[v-cloak] :not(.k-i-loading) { display: none; } \
    </style>\
    <script src="https://unpkg.com/core-js/client/shim.min.js"></script>\
    # if (data.platform === \'builder\') { # <script src="https://unpkg.com/zone.js"></script> #}#\
    #= data.cdnResources #\
    <script src="https://unpkg.com/systemjs@0.19.27/dist/system.js"></script>\
    <script src="#: data.exampleRunner #"></script>\
    <script>\
        var runner = new ExampleRunner("#= data.platform #");\
        runner.configure(System, { npmUrl: "#: data.npmUrl #", modules: ' + JSON.stringify(moduleDirectives) + ', language: "#: data.language #", trackjs: #= data.track # });\
        # for (var i = 0; i < data.files.length; i++) { #\
        runner.register("#= data.root #", "#= data.files[i].name #", "#= data.files[i].content #");\
        # } #\
        runner.start(System, "#= data.importRoot || \'app\' #");\
    </script>\
</head>\
<body>\
    #= data.html #\
    # if (data.platform !== "vue") { #\
    <my-app>\
        <span class="k-icon k-i-loading" style="color: #: data.themeAccent || "\\#ff6358" #"></span>\
    </my-app>\
    # } else {#\
    <script>\
        var loadingIcon = document.createElement("span");\
        loadingIcon.className = "k-icon k-i-loading";\
        loadingIcon.style.color = "#: data.themeAccent || "\\#ff6358" #";\
        var vueapp = document.getElementById("vueapp");\
        vueapp.appendChild(loadingIcon);\
        vueapp.setAttribute("v-cloak", null);\
    </script>\
    # }#\
</body>\
</html>\
', { useWithBlock: false });

var stackBlitzDependencies = {
    'angular': {
        'core-js': '2.5.3',
        'rxjs': '5.5.6',
        'zone.js': '0.8.12',
        '@angular/animations': '5.2.2',
        '@angular/core': '5.2.2',
        '@angular/common': '5.2.2',
        '@angular/compiler': '5.2.2',
        '@angular/platform-browser': '5.2.2',
        '@angular/platform-browser-dynamic': '5.2.2',
        '@angular/http': '5.2.2',
        '@angular/router': '5.2.2',
        '@angular/forms': '5.2.2',
        'hammerjs': '*',
        '@telerik/kendo-intl': '*',
        '@progress/kendo-date-math': '*',
        '@progress/kendo-drawing': '*',
        '@progress/kendo-data-query': '*',
        '@progress/kendo-file-saver': '*',
        '@progress/kendo-charts': '*',
        '@progress/kendo-angular-buttons': '*',
        '@progress/kendo-angular-charts': '*',
        '@progress/kendo-angular-dateinputs': '*',
        '@progress/kendo-angular-dialog': '*',
        '@progress/kendo-angular-dropdowns': '*',
        '@progress/kendo-angular-excel-export': '*',
        '@progress/kendo-angular-gauges': '*',
        '@progress/kendo-angular-grid': '*',
        '@progress/kendo-angular-inputs': '*',
        '@progress/kendo-angular-intl': '*',
        '@progress/kendo-angular-l10n': '*',
        '@progress/kendo-angular-label': '*',
        '@progress/kendo-angular-layout': '*',
        '@progress/kendo-angular-menu': '*',
        '@progress/kendo-angular-pdf-export': '*',
        '@progress/kendo-angular-popup': '*',
        '@progress/kendo-angular-resize-sensor': '*',
        '@progress/kendo-angular-ripple': '*',
        '@progress/kendo-angular-scrollview': '*',
        '@progress/kendo-angular-sortable': '*',
        //TODO: Add '@progress/kendo-angular-tooltip': '*',
        '@progress/kendo-angular-treeview': '*',
        '@progress/kendo-angular-upload': '*'
    },
    'builder': {
        "@angular/animations": "^5.2.10",
        "@angular/common": "^5.2.10",
        "@angular/compiler": "^5.2.10",
        "@angular/core": "^5.2.10",
        "@angular/forms": "^5.2.10",
        "@angular/http": "^5.2.10",
        "@angular/platform-browser": "^5.2.10",
        "@angular/platform-browser-dynamic": "^5.2.10",
        "@angular/router": "^5.2.10",
        "@progress/kendo-angular-buttons": "^2.0.0",
        "@progress/kendo-angular-charts": "^1.4.0",
        "@progress/kendo-angular-dateinputs": "^1.4.3",
        "@progress/kendo-angular-dialog": "^3.1.2",
        "@progress/kendo-angular-dropdowns": "^2.1.0",
        "@progress/kendo-angular-excel-export": "^1.0.5",
        "@progress/kendo-angular-grid": "^1.7.1",
        "@progress/kendo-angular-inputs": "^1.4.2",
        "@progress/kendo-angular-intl": "^1.3.0",
        "@progress/kendo-angular-l10n": "^1.0.5",
        "@progress/kendo-angular-label": "1.0.5",
        "@progress/kendo-angular-layout": "^2.2.0",
        "@progress/kendo-angular-popup": "^1.3.2",
        "@progress/kendo-data-query": "^1.1.2",
        "@progress/kendo-drawing": "^1.4.1",
        "@progress/kendo-theme-bootstrap": "^2.11.11",
        "@progress/kendo-theme-default": "^2.50.0",
        "@progress/kendo-theme-material": "^0.3.0",
        "bootstrap": "4.0.0-beta.2",
        "font-awesome": "^4.7.0",
        "rxjs": "^5.5.6",
        "zone.js": "^0.8.26"
    },
    'react': {
        "@progress/kendo-data-query": "^1.0.0",
        "@progress/kendo-react-dateinputs": "0.1.2",
        "@progress/kendo-react-dropdowns": "0.1.2",
        "@progress/kendo-react-inputs": "0.1.2",
        "@progress/kendo-react-intl": "0.1.2",
        "@progress/kendo-react-grid": "0.5.1",
        "@progress/kendo-drawing": "1.5.3",
        "@progress/kendo-react-pdf": "0.5.1",
        "react": "^16.0.0",
        "react-dom": "^16.0.0",
        "object-assign": "^4.0.1",
        "prop-types": "^15.6.0",
        "rxjs": "^5.5.10",
        "cldr-data": "^32.0.1"
    }
};

function SnippetRunner(container) {
    this.container = container;
    this.iframe = $();
}

SnippetRunner.prototype = {
    resizeFrame: function() {
        var RESIZE_THRESHOLD = 5;
        var iframe, body;

        if ($(this.iframe).closest("[data-height]").length) {
            // height is set through {% meta %}
            return;
        }

        try {
            iframe = this.iframe;
            body = iframe.contents().find("body")[0];
        } catch (e) {
            // iframe may not be available
            return;
        }

        if (!iframe || !body) {
            return;
        }

        var height = body.offsetHeight;
        if (Math.abs(height - iframe.height()) > RESIZE_THRESHOLD) {
            iframe.height(height);
        }
    },

    call: function(name) {
        var iframe = this.iframe[0];
        var iframeWnd = iframe.contentWindow || iframe;
        var method = iframeWnd[name] || $.noop;

        method.apply(iframeWnd, Array.prototype.slice.call(arguments, 1));
    },

    _closestHeader: function(element) {
        return element.closest('article > *').prevAll('h1,h2,h3,h4,h5,h6').first();
    },

    _idFromText: function(text) {
        return $.trim(text.toLowerCase()).replace(/\s+/g, '-');
    },

    update: function(content) {
        this.container.empty();

        var attributes = { src: 'javascript:void(0)' };

        var metaContainer = $(this.container).closest("[data-height]");
        var height = metaContainer.attr("data-height") || 340;
        attributes.style = 'height:' + height + 'px';

        var id = metaContainer.attr("data-id") || this._idFromText(this._closestHeader(this.container).text());
        attributes.id = 'example-' + id;

        this.iframe =
            $('<iframe class="snippet-runner">')
                .attr(attributes)
                .show()
                .appendTo(this.container);

        metaContainer.height("");

        var contents = this.iframe.contents();
        contents[0].open();
        contents[0].write(content);
        contents[0].close();

        var iframe = this.iframe[0];
        var iframeWnd = iframe.contentWindow || iframe;
        iframeWnd._runnerInit = this.resizeFrame.bind(this);
    }
};

var CDNResources = {
    angular: [
        "https://unpkg.com/zone.js@0.8.12/dist/zone.js",
        "https://unpkg.com/reflect-metadata@0.1.3/Reflect.js"
    ],
    react: [
    ],
    vue: [
    ]

};

function resourceLinks(resources) {
    return $.map(resources, function(resource) {
        return resource.match(/\.css$/) ? "<link rel='stylesheet' href='" + resource + "'>" :
            "<script src='" + resource + "'></script>";
    }).join("");
}

var groupExtractor = /^\((.*?)\)$/g;
function extractRules(value) {
    var result = (value || "").match(groupExtractor);

    if (!result) {
        return value ? [ value ] : [];
    }

    return result
        .map(function(m) {
            var result = groupExtractor.exec(m);
            return result ? result[1] : "";
        });
}

function concatMatchers(current, additional) {
    var currentRules = extractRules(current);
    var additionalRules = extractRules(additional);

    return '(' + currentRules.concat(additionalRules).join('|') + ')';
}

function registerDirectives(moduleDirectives) {
    var directives = [];

    moduleDirectives.forEach(function(current) {
        var filtered = false;

        directives.forEach(function(uniqueDirective) {
            if (current.module === uniqueDirective.module) {
                uniqueDirective.import = uniqueDirective.import || current.import;

                if (current.match) {
                    uniqueDirective.match = concatMatchers(uniqueDirective.match, current.match);
                }

                filtered = true;
            }
        });

        if (!filtered) {
            directives.push(current);
        }
    });

    return directives;
}

var moduleDirectives = registerDirectives(window.moduleDirectives || []);

function wrapAngularTemplate(template) {
    if (!/^\s*</.test(template)) {
        // not a template
        return template;
    }
    // template-only code, wrap in component
    return [
        "@Component({",
        "    selector: 'my-app',",
        "    template: `" + template + "`",
        "})",
        "class AppComponent {}"
    ].join("\n");
}

var directivesByModule = {
    angular: [
        { module: '@angular/core', match: '@(Component)', import: "Component" },
        { module: '@angular/forms', match: 'ngModel', import: "FormsModule" },
        { module: '@angular/platform-browser', match: '.', import: "BrowserModule" },
        { module: '@angular/platform-browser/animations', match: '.', import: "BrowserAnimationsModule" }
    ].concat(moduleDirectives),
    react: [].concat(moduleDirectives),
    vue: [].concat(moduleDirectives),
    builder: [].concat(moduleDirectives)
};

/* The following method replaces code characters to allow embedding in a js double-quote string ("") */
function codeToString(code) {
    return code.replace(/"/g, '\\"') // escape nested quotes
        .replace(/\n/g, '\\n'); // escape line endings
}

function getFullContent(options) {
    var listing = options.listing;
    var platform = options.platform;

    if (listing['ts-multiple']) {
        var fullContent = "";
        listing['multifile-listing'].forEach(function(file) {
            fullContent = fullContent.concat(file.content);
        });

        return fullContent;
    }

    if (listing['html'] && platform === 'vue') {
        return listing['html'];
    }

    return listing['ts'] || listing['jsx'] || listing['js'];
}

/* The following block deals with the imports from the kendo-*-packages(s) */

function usedModules(code) {
    return directivesByModule[window.platform].filter(function(directive) {
        return (new RegExp(directive.match)).test(code);
    }).filter(Boolean);
}

function toModuleImport(directive) {
    var exportStatement = " from '" + directive.module + "';";

    if (directive.defaultExport) {
        exportStatement = "import " + directive.import + exportStatement;
    } else {
        exportStatement = "import { " + directive.import + " }" + exportStatement;
    }

    return exportStatement;
}

function moduleImports(code, directives) {
    var imports = [];

    directives.forEach(function(directive) {
        // test if directive is imported
        var imported = new RegExp("^\\s*import .* from\\s+[\"']" + directive.module + "[\"'];");

        if (directive.import && !imported.test(code)) {
            imports.push(toModuleImport(directive));
        }
    });

    return imports;
}

/* This code is used only in the angular version to extract the modules defined in the "imports" section */
function angularAppModuleImports(directives) {
    return directives
        .filter(function(directive) { return /Module$/.test(directive.import); })
        .map(function(dir) { return dir.import; })
        .join(", ");
}

/* end */

function jsTrackingCode() {
    return [
        "import Raven from 'raven-js';",
        "import { ErrorHandler } from '@angular/core';",
        "Raven.config('https://e7cc5054385e4b4cb97bd7ea376c6174@sentry.io/112659').install();",
        "class RavenErrorHandler implements ErrorHandler {",
        "handleError(err:any) : void {",
        "Raven.captureException(err.originalError || err);",
        "}",
        "}"
    ].join("\n");
}

function bootstrapReact(options) {
    var code = options.example.code;
    var directives = usedModules(code);
    var imports = moduleImports(code, directives);
    return [].concat([
        "import React from 'react';",
        "import ReactDOM from 'react-dom';"
    ])
    .concat(imports)
    .concat(code)
    .filter(Boolean)
    .join('\n');
}

function bootstrapVue(options) {
    // in vue we extract the imports from html
    var code = options.example.code;
    var html = options.example.html;
    var directives = usedModules(html);
    var imports = moduleImports(html, directives.filter(function(item) { return !/react|angular/gi.test(item.module); }));
    return [].concat([
        "import Vue from 'vue';"
    ])
    .concat(imports)
    .concat(code)
    .filter(Boolean)
    .join('\n');
}

function bootstrapBuilder(options) {
    var code = options.code + '\n';
    return code;
}

function bootstrapAngular(options) {
    var source = options.example.code;
    var code = wrapAngularTemplate(source);
    var jsTracking = jsTrackingCode();

    var directives = usedModules(code);
    var imports = moduleImports(code, directives);
    var appModuleImports = angularAppModuleImports(directives);

    return (imports.concat([
        code,
        "import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';",
        "import { NgModule, enableProdMode } from '@angular/core';",
        "import 'hammerjs';",
        options.track ? jsTracking : "",
        "@NgModule({",
        "declarations: [AppComponent],",
        "imports: [ " + appModuleImports + " ],",
        options.track ? "providers: [ { provide: ErrorHandler, useClass: RavenErrorHandler } ]," : "",
        "bootstrap: [AppComponent]",
        "})",
        "class AppModule {}",
        window.location.hostname === "localhost" ? "" : "enableProdMode();",
        "platformBrowserDynamic().bootstrapModule(AppModule)",
        (options.resize ? "\t.then(_runnerInit)" : ""),
        "\t.catch(err => console.error(err));"
    ]).filter(Boolean).join("\n"));
}

function plunkerPage(opts) {
    var bootstrap = opts.bootstrap;
    var options = $.extend({
        npmUrl: window.npmUrl,
        cdnResources: resourceLinks(CDNResources[window.platform]),
        platform: window.platform,
        exampleRunner: window.runnerScript,
        theme: 'default',
        language: opts.language,
        themeAccent: themeColors.default,
        html: '',
        track: false
    }, opts);

    if (!options.code) {
        return htmlTemplate(options);
    }

    if (window.platform !== 'builder') {
        var codeContent = codeToString(bootstrap.call(this, {
            example: options,
            resize: true,
            track: options.track
        }));

        options.files = [
            { name: "main." + opts.language, content: codeContent }
        ];
    }

    options.files = [];
    return plunkerTemplate(options);
}

// types of code snippets
var blockTypes = {
    'generic': {
        // snippet without type
        // consider changing it by adding type in docs via ```some-type
        label: 'Generic listing, set code type in docs!',
        highlight: 'htmlmixed'
    },
    'cs': {
        label: 'C#',
        highlight: 'text/x-csharp'
    },
    'html': {
        label: 'HTML',
        highlight: 'htmlmixed'
    },
    'java': {
        label: 'Java',
        highlight: 'text/x-java'
    },
    'json': {
        label: 'JSON',
        highlight: 'application/json'
    },
    'jsx': {
        label: 'JSX',
        highlight: 'jsx'
    },
    'php': {
        label: 'PHP',
        highlight: 'php'
    },
    'bash': {
        label: 'Shell',
        highlight: 'bash',
        noRun: true
    },
    'sh': {
        label: 'Shell',
        highlight: 'bash',
        noRun: true
    },
    'js': {
        label: 'JavaScript',
        highlight: 'javascript'
    },
    'scss': {
        label: 'SCSS',
        highlight: 'css',
        noRun: true
    },
    'ng-template': {
        label: 'Angular template',
        highlight: 'htmlmixed'
    },
    'ts': {
        label: 'TypeScript',
        highlight: 'text/typescript'
    },
    'xml': {
        label: 'XML',
        highlight: 'application/xml'
    }
};

// denotes group of several code snippets
function CodeListing(elements) {
    var that = this;
    this.elements = elements;

    /**
        Search for the "main" file and infer language by its extension.
        This covers the case with embed_file content inclusion.
     */
    for (var i = 0; i < elements.length; i++) {
        var lang = /main?.(jsx|js|ts)/.exec(elements.eq(i).attr('data-file'));
        if (lang) {
            this.runtimeLanguage = lang[1];
            break;
        }
    }

    this.types = $.map(this.elements.find("code"), function(element) {
        var preview = false;
        var noRun = false;
        var multiple = false;
        var language = /lang(uage)?-([^\s]+)/.exec(element.className);
        var hideTabs = element.className.match(/hide-tabs/);
        var fileName = $(element).parent().attr("data-file");

        language = language ? language[2] : "generic";

        if (/-preview/.test(language)) {
            language = language.replace(/-preview/, "");
            preview = true;
        } else if (/-no-run/.test(language)) {
            language = language.replace(/-no-run/, "");
            noRun = true;
        }

        if (/-multiple/.test(language)) {
            language = language.replace(/-multiple/, "");
            multiple = true;
        }

        if (multiple) {
            var elems = that["multifile-listing"] || [];

            elems.push({
                name: fileName,
                content: $(element).text()
            });

            that["multifile-listing"] = elems;
        }

        if (typeof(that[language]) === 'undefined') {
            that[language] = $(element).text();
        }

        return $.extend({
            language: language,
            noRun: noRun,
            multiple: multiple,
            hideTabs: hideTabs,
            preview: preview
        }, blockTypes[language]);
    });

    /**
        If no runtimeLanguage is set assume we are dealing with inline content.
        Infer the language from the object instance.
     */
    if (this.runtimeLanguage === undefined) {
        if (Object.prototype.hasOwnProperty.call(this, 'js')) {
            this.runtimeLanguage = 'js';
        } else if (Object.prototype.hasOwnProperty.call(this, 'jsx')) {
            this.runtimeLanguage = 'jsx';
        } else {
            this.runtimeLanguage = 'ts';
        }
    }
}

CodeListing.prototype = {
    updateHtml: function() {
        var block = this;

        this.elements
            .find("code")
            .addClass("cm-s-default")
            .each(function(idx, elem) {
                var code = $(elem);
                var typeInfo = block.types[idx];

                if (typeInfo.preview) {
                    block.preview = true;
                } else if (typeInfo.noRun) {
                    block.noRun = true;
                }

                if (typeInfo.multiple) {
                    block.multiple = true;
                }

                code.parent().attr("data-code-language", typeInfo.label);

                // colorize code
                window.CodeMirror.runMode(code.text(), typeInfo.highlight, code[0]);
            });
    },
    hide: function() {
        this.elements.hide();
    },
    show: function() {
        this.elements.show();
    }
};

var basicPlunkerFiles = [
    'index.html'
];

var plunker = {
    angular: {
        plunkerFiles: [
            'main.ts',
            'app/app.component.ts',
            'app/app.module.ts',
            'polyfills.ts',
            'styles.css'
        ].concat(basicPlunkerFiles)
    },
    react: {
        plunkerFiles: [
            'app/main.jsx',
            'app/main.ts'
        ].concat(basicPlunkerFiles)
    },
    vue: {
        plunkerFiles: [
            'app/main.es'
        ].concat(basicPlunkerFiles)
    },
    builder: {
        plunkerFiles: [
            'app/app.component.html',
            'app/app.component.ts',
            'app/app.css',
            'app/app.module.ts',
            'app/core/core.module.ts',
            'app/core/data/data-services.exports.ts',
            'app/core/data/data.service.ts',
            'app/core/data/odata-service-factory.ts',
            'app/core/data/odata.service.ts',
            'app/core/module.config.ts',
            'app/data/odata-provider/customer.config.ts',
            'app/data/odata-provider/customer.model.ts',
            'app/grid-demo.base.component.ts',
            'app/grid-demo.component.html',
            'app/grid-demo.component.ts',
            'app/shared/components/grid/grid.component.html',
            'app/shared/components/grid/grid.component.ts',
            'app/shared/services/grid-incell-editing.service.ts',
            'app/topSection.html',
            'app/topSection.ts',
            'assets/themes/metro.css',
            'index.html',
            'main.ts',
            'polyfills.ts',
            'styles.css'
        ].concat(basicPlunkerFiles)
    }
};

function getBlueprintFiles(file) {
    var bluePrintPath = window.blueprint === 'stackblitz' ? window.stackblitzBluePrintPath : window.plunkerBluePrintPath;
    var path = [ bluePrintPath, window.platform, '/', file ];
    return $.ajax(path.join(''), { dataType: 'text' });
}

function EditorForm(action) {
    this.form = $('<form style="display: none;" action="' + action + '" method="post" target="_blank" />').appendTo(document.body);
}

EditorForm.prototype.addField = function(name, value) {
    $('<input type=hidden />').val(value).attr("name", name).appendTo(this.form);
};

EditorForm.prototype.submit = function() {
    this.form[0].submit();
    this.form.remove();
    this.form = null;
};

function prefixStyleUrls(content, prefix) {
    // prefix styleUrl paths with the given string
    return content.replace(
        /("|')([a-z0-9\.-]+\.css)\1/g,
        "$1" + prefix + "$2$1"
    );
}

function capitalize(str) {
    return str[0].toUpperCase() + str.substring(1);
}

function getStackBlitzTemplate(listing) {
    if (listing['jsx']) {
        return 'javascript';
    }

    if (listing['js']) {
        return 'typescript';
    }

    return 'angular-cli';
}

function buildExampleEditorForm(exampleTemplate) {
    var form = new EditorForm('https://stackblitz.com/run/');
    var link = (/localhost/).test(window.location.href) ? '' : ', see ' + window.location.href;
    var platform = window.platform;

    form.addField('project[template]', exampleTemplate);
    form.addField('project[tags][0]', capitalize(platform));
    form.addField('project[tags][1]', 'Kendo UI');
    form.addField('project[description]', 'Example usage of Kendo UI for ' + capitalize(platform) + link);
    form.addField('project[dependencies]', JSON.stringify(stackBlitzDependencies[platform]));

    return form;
}

// function getExampleDependencies(directives) {
//     return directives.filter(function(dir) {
//         return dir.module.indexOf('@progress') === 0 ||
//                dir.module.indexOf('@telerik') === 0;
//     }).reduce(function(result, dir) {
//         result[dir.module] = '*';
//         return result;
//     }, {});
// }

// fetch plunker templates for platform
// this must be cached before the button is clicked,
// otherwise the popup blocker blocks the new tab
var plunkerRequests = $.map(plunker[window.platform].plunkerFiles, getBlueprintFiles);

window.openInPlunker = function(listing) {
    var code = listing['ts'] || listing['jsx'] || listing['js'];
    var template = listing['ng-template'];
    var html = listing['html'] || '';
    var language = listing.runtimeLanguage;
    var theme = listing.theme || "default";

    if (!code) {
        code = wrapAngularTemplate(template);
    }

    var directives = usedModules(getFullContent({ listing: listing, platform: window.platform }));
    var imports = moduleImports(code, directives);

    var plunkerContext = {
        common: {
            appComponentContent: code,
            npmUrl: 'https://unpkg.com',
            htmlContent: html,
            theme: theme,
            themeAccent: themeColors[theme]
        },
        angular: {
            appImports: imports.join('\n'),
            appModuleImports: angularAppModuleImports(directives)
        },
        react: {
            appImports: imports.join('\n')
        },
        vue: {
        },
        builder: {
            appImports: imports.join('\n')
        }
    };

    var exampleTemplate = getStackBlitzTemplate(listing);
    var form = buildExampleEditorForm(exampleTemplate);

    var filterFunction = function(file) {
        var ext = file.split('.').pop();
        return (file.indexOf('html') >= 0 || ext === 'css' || ext === language);
    };

    if (listing.multiple && listing['multifile-listing']) {
        $.each(listing['multifile-listing'], function(i, file) {
            var content = file.content;
            // skip main file
            // StackBlitz requires main.ts to be on the root level, get from template
            if (/main\./.test(file.name)) {
                return;
            }

            if (exampleTemplate === 'typescript') {
                var contentRoot = 'app/';
                form.addField('project[files][' + contentRoot + file.name + ']', content);
                contentRoot = '';
                content = content.replace(/\.\/app\.module/g, "./app/app.module");
            } else if (exampleTemplate === 'javascript') {
                // stackblitz expects all files and imports to be js
                file.name = file.name.replace(/\.jsx/, '.js');
                content = content.replace(/\.jsx/g, '.js');

                form.addField('project[files][' + file.name + ']', content);
            }
        });

        // TODO: this block adds only styles.css, very dirty.
        $.when.apply($, plunkerRequests).then(function() {
            var plunkerTemplates = Array.prototype.slice.call(arguments).map(function(promise) { return promise[0]; });
            $.each(plunkerTemplates, function(index, templateContent) {
                var plunkerFiles = plunker[window.platform].plunkerFiles.filter(filterFunction);
                var context = $.extend({}, plunkerContext.common, plunkerContext[window.platform]);
                var add = function(file, template) {
                    if (file === "styles.css" || file === "main.ts" || file === 'polyfills.ts') {
                        form.addField('project[files][' + file + ']', kendo.template(template)(context));
                    }
                };
                add(plunkerFiles[index], templateContent);
            });
        });
    }

    if (exampleTemplate === "angular-cli") {
        form.addField('project[files][.angular-cli.json]', JSON.stringify({
            "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
            "apps": [ {
                "assets": [
                    "assets",
                    "favicon.ico"
                ],
                "index": "index.html",
                "main": "main.ts",
                "polyfills": "polyfills.ts",
                "prefix": "app",
                "styles": [
                    "styles.css"
                ]
            } ]
        }, null, 2));
    }

    //if (window.platform === 'vue') {
        //config['packages']['app'] = {
            //'main': './main.es',
            //'defaultExtension': 'es'
        //};
    //}

    var filterFunction = function(file) {
        var ext = file.split('.').pop();
        var shouldUseEsFile = window.platform === 'vue' && language === 'js' && ext === 'es';
        return (file.indexOf('html') >= 0 || ext === 'css' || ext === language || shouldUseEsFile);
    };

    $.when.apply($, plunkerRequests).then(function() {
        var plunkerTemplates = Array.prototype.slice.call(arguments).map(function(promise) { return promise[0]; });
        /**
         * The react platfrom supports multiple languages: ts, js and jsx.
         * Due to that reason we need to filterout the "main" files which are not for the current language.
         * The order is [js, tsx, html].
         */
        if (window.platform === 'react') {
            switch (language) {
            case 'jsx':
                plunkerTemplates.splice(1, 1);
                break;
            case 'ts':
                plunkerTemplates.splice(0, 1);
                break;
            default:
                plunkerTemplates = plunkerTemplates
                    .filter(function(tmp, idx, arr) { return (idx === 1 || idx === arr.length - 1); });
            }
        }

        if (exampleTemplate === 'typescript') {
            //Only styles.css, index.html are needed
            plunkerTemplates = plunkerTemplates.splice(4, 2);
            form.addField('project[files][index.ts]', plunkerContext.common.appComponentContent);
        }

        if (exampleTemplate === 'javascript') {
            var content = plunkerContext.common.appComponentContent.replace(/\.jsx/g, '.js');
            form.addField('project[files][index.js]', content);
        }

        $.each(plunkerTemplates, function(index, templateContent) {
            var plunkerFiles = plunker[window.platform].plunkerFiles.filter(filterFunction);
            var context = $.extend({}, plunkerContext.common, plunkerContext[window.platform]);
            var add = function(file, template) {
                var content;
                /* don't apply kendo template to files with angular template inside */
                if (!template.match(/\$\{.+\}/)) {
                    content = kendo.template(template.replace(/#/g, "\\#"))(context);
                } else {
                    content = template;
                }
                form.addField('project[files][' + file + ']', content);
            };

            if (!listing.multiple || (listing.multiple && basicPlunkerFiles.indexOf(plunkerFiles[index]) >= 0)) {
                add(plunkerFiles[index], templateContent);
            }
        });

        form.submit();
    });
};


var themeColors = {
    default: "#ff6358",
    bootstrap: "#0275d8",
    material: "#3f51b5"
};

/* Transform code listings (pre tags) into runnable examples */
$(function() {
    var framework = $.extend({
        editor: 'plunkr',
        editButtonTemplate: '<a href="#" class="edit-online plunkr">Open in StackBlitz</a>',
        editOnline: function(listing) {
            window.openInPlunker(listing);
            return false;
        }
    }, {
        builder: {
            runnerContent: function(options) {
                var listing = options.listing;
                var theme = options.theme || 'default';
                return plunkerPage({
                    bootstrap: bootstrapBuilder,
                    code: listing['ts'] || listing['ng-template'],
                    html: listing['html'],
                    language: listing.runtimeLanguage,
                    theme: theme,
                    themeAccent: themeColors[options.theme],
                    track: options.track,
                    root: '/',
                    importRoot: 'builder'
                });
            }
        },
        angular: {
            runnerContent: function(options) {
                var listing = options.listing;
                var theme = options.theme || 'default';

                return plunkerPage({
                    bootstrap: bootstrapAngular,
                    code: listing['ts'] || listing['ng-template'],
                    html: listing['html'],
                    language: listing.runtimeLanguage,
                    theme: theme,
                    themeAccent: themeColors[options.theme],
                    track: options.track,
                    root: 'app/'
                });
            }
        },
        react: {
            runnerContent: function(options) {
                var listing = options.listing;
                var theme = options.theme || 'default';

                return plunkerPage({
                    bootstrap: bootstrapReact,
                    code: listing['jsx'] || listing['js'] || listing['ts'],
                    language: listing.runtimeLanguage,
                    html: listing['html'],
                    theme: theme,
                    themeAccent: themeColors[options.theme],
                    track: options.track
                });
            }
        },
        vue: {
            runnerContent: function(options) {
                var listing = options.listing;
                var theme = options.theme || 'default';

                return plunkerPage({
                    bootstrap: bootstrapVue,
                    code: listing['js'],
                    language: listing.runtimeLanguage,
                    html: listing['html'],
                    theme: theme,
                    themeAccent: themeColors[options.theme],
                    track: options.track,
                    root: 'app/'
                });
            }
        }
    }[window.platform]);

    function toCodeListings(tags) {
        var blocks = [];

        for (var i = 0; i < tags.length;) {
            var tag = tags.eq(i);
            var siblingTags = tag.nextUntil(":not(pre)").addBack();
            if (tag.data("codeListing")) {
                //console.log('skip processing');
            } else {
                tag.data("codeListing", true);
                blocks.push(new CodeListing(siblingTags));
            }
            i += siblingTags.length;
        }
        return blocks;
    }

    function usesClipboardJs() {
        return window.Clipboard && !/\[native code\]/.test(window.Clipboard.toString());
    }

    toCodeListings($("pre")).forEach(function(block, idx) {

        var fileListElement;
        var demoEmbed = $(block.elements).closest(".demo-embed");
        if (demoEmbed.length) {
            // fully-embedded demo, skip chrome rendering
            return;
        }

        block.updateHtml();
        block.theme = block.elements.closest("[data-theme]").attr("data-theme") || 'default';

        if (block.multiple) {
            //list of files contained in the snippet
            fileListElement = $(fileListTemplate({
                files: block.elements.not("[data-hidden]"),
                index: idx
            })).insertBefore(block.elements[0]);

            var elements = processMultiFileSourceBlocks(block.elements, idx);
            elements.appendTo(fileListElement.find('.tab-content'));
        }

        if (block.preview) {
            // preview snippets - start with example, allow view source
            var previewElement = $(previewTemplate({
                editButtonTemplate: framework.editButtonTemplate,
                index: idx
            }));

            previewElement.insertBefore(block.multiple ? fileListElement : block.elements[0]);

            // preview snippets with multiple files should display the file list
            var codeTab = previewElement.find('.tab-code');
            codeTab.append(block.multiple ? fileListElement : block.elements);

            if (block.types[0].hideTabs) {
                $(previewElement[0]).hide(); // hide the tabstrip
            }

            previewElement.find('.edit-online').click(
                framework.editOnline.bind(null, block)
            );
            var content;
            if (block.multiple) {
                content = loadMultiFileRunnerContent(codeTab);
            } else {
                content = framework.runnerContent({
                    listing: block,
                    track: window.trackjs
                });
            }

            var preview = new SnippetRunner(previewElement.find('.tab-preview'));
            preview.update(content);
        } else if (!block.noRun) {
            var title = $("<h5>Code Sample</h5>");
            title.insertBefore(block.multiple ? fileListElement : block.elements[0]);

            var run = $("<button class='button secondary'></button>");

            if (block.multiple) {
                run.text("Open in StackBlitz");
                run.insertAfter(fileListElement);
                run.click(framework.editOnline.bind(null, block));
            } else {
                run.text("Run Code");
                run.insertAfter(block.elements.last());
                run.wrap("<p class='run-code'></p>");

                // TODO: delegate run handler instead
                run.click(function() {
                    $(document.body).css("overflow", "hidden");
                    run.hide();
                    title.hide();

                    var editor = $(editorTemplate({
                        editButtonTemplate: framework.editButtonTemplate,
                        block: block
                    })).insertAfter(block.elements[0]).show();

                    var close = function() {
                        $(document.body).css("overflow", "");
                        run.show();
                        title.show();
                        editor.remove();
                    };

                    editor.find('.button-close').click(close);

                    editor.on("keyup", function(e) {
                        if (e.keyCode === 27) {
                            close();
                        }
                    });

                    var codeMirrors = block.types.map(function(typeInfo, index) {
                        var value = block[typeInfo.language];

                        return window.CodeMirror(function(elt) {
                            editor.find('.pane').eq(index).append(elt);
                        }, {
                            value: value,
                            language: typeInfo.language,
                            mode: typeInfo.highlight,
                            lineWrapping: true,
                            lineNumbers: true
                        });
                    });

                    function listing() {
                        return codeMirrors.reduce(function(acc, instance) {
                            acc[instance.options.language] = instance.getValue();

                            return acc;
                        }, { runtimeLanguage: block.runtimeLanguage });
                    }

                    editor.find('.edit-online').click(function() {
                        return framework.editOnline(listing());
                    });

                    kendo.animationFrame(function() {
                        editor.find(".dialog").removeClass("dialog-enter");
                        codeMirrors[0].focus();
                    });

                    var preview = new SnippetRunner(editor.find('.pane-preview'));

                    var onChange = debounce(function() {
                        var content = framework.runnerContent({
                            listing: listing(),
                            track: false
                        });

                        preview.update(content);
                    }, 500);

                    setTimeout(function() {
                        codeMirrors.forEach(function(instance) {
                            instance.refresh();
                            instance.on('changes', onChange);
                        });
                    }, 400);

                    onChange();
                });
            }
        }

        if (usesClipboardJs()) {
            $(block.elements).prepend('<button class="btn copy-btn">Copy Code</button>');
        }
    });

    if (usesClipboardJs()) {
        var setTooltip = function(btn, message) {
            $(btn).tooltip('hide')
                .attr('data-original-title', message)
                .tooltip('show');
        };

        var hideTooltip = function(btn) {
            setTimeout(function() {
                $(btn).tooltip('hide');
            }, 1000);
        };

        var clipboard = new window.Clipboard('.copy-btn', {
            text: function(trigger) {
                return $(trigger).next('code').text();
            }
        });

        clipboard.on('success', function(e) {
            setTooltip(e.trigger, 'Copied!');
            hideTooltip(e.trigger);
        });

        $('.copy-btn').tooltip({
            container: 'body',
            trigger: 'click',
            placement: 'bottom'
        });
    }

    function removeJsTrackingMarks(text) {
        var sanitizedText;

        if (window.trackjs) {
            sanitizedText = text.replace(/\/\/trackjs.*/, "").replace(/\/\/sjkcart.*/, "");
            sanitizedText = text.replace(/\/\*trackjs\*\//, "");
        } else {
            sanitizedText = text.replace(/\/\*trackjs\*\/.*/g, "");
            sanitizedText = text.replace(/\/\/trackjs[\s\S]*\/\/sjkcart/gm, "");
        }

        return sanitizedText;
    }

    function loadMultiFileRunnerContent(element) {
        var filesContent = "";
        var files = $.map(element.find("pre"), function(item) {
            var pre = $(item);
            var codeElem = pre.find("code");
            var code = codeElem.length > 0 ? codeElem.text() : pre.text();
            filesContent = filesContent.concat(code);

            code = prefixStyleUrls(code, "examples/");

            return {
                name: pre.attr("data-file"),
                content: codeToString(removeJsTrackingMarks(code))
            };
        });
        var root = window.platform === 'builder' ? '/' : 'app/';
        /* If this is multifile runnable example there must be a main file, locate it and infer the runtime language from it */
        var mainFile = files.filter(function(file) { return file.name.indexOf('main.') >= 0; }).pop();
        var runtimeLanguage = mainFile.name.split('.').pop();
        var theme = element.closest("[data-theme]").attr("data-theme") || 'default';
        var content = plunkerTemplate({
            npmUrl: window.npmUrl,
            platform: window.platform,
            cdnResources: resourceLinks(CDNResources[window.platform]),
            exampleRunner: window.runnerScript,
            html: "",
            theme: theme,
            language: runtimeLanguage,
            themeAccent: themeColors[theme],
            files: files,
            track: window.trackjs,
            root: root
        });

        return content;
    }

    function processMultiFileSourceBlocks(blockElements, blockId) {
        var elements = blockElements.wrap("<div class='tab-pane'></div>").parent();
        var elemIndex = 0;
        elements.each(function(i, elem) {
            var codeBlock = $(elem).find("pre");

            if (codeBlock.length > 0 && !codeBlock.is("[data-hidden]")) {
                var elemId = "filename" + elemIndex + "-" + blockId;
                if (elemIndex === 0) { $(elem).addClass("active"); }
                elemIndex += 1;
                $(elem).attr("id", elemId);
            }
        });

        return elements;
    }

    $(function() {
        $(".demo-embed").each(function(index, elem) {
            var embeddedDemo = $(elem);
            var content = loadMultiFileRunnerContent(embeddedDemo);

            var runnerElement = embeddedDemo.find('.runner');
            var runner = new SnippetRunner(runnerElement);
            runner.update(content);
            runnerElement.data("runner", runner);
        });
    });
});

