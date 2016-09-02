function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

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

var errorTemplate = kendo.template("<pre style=\"position:absolute;bottom:0;color:red\">#: error #</pre>")

var reactTemplate = kendo.template(
"<!DOCTYPE html>" +
"<html>" +
  "<head>" +
    "#= cdn #" +
    "<script>" +
    "window.onload = _runnerInit;" +
    "window.onerror = function(e) {" +
        "document.write('<pre style=\"position:absolute;bottom:0;color:red\">' + e + '</pre>');" +
    "};</script>" +
  "</head>" +
  "<body style=\"margin: 0; font-family: 'RobotoRegular', Helvetica, Arial, sans-serif; font-size: 14px;\">" +
    "#= content #" +
    "<script>console.log(window);" +
      "#= script #" +
    "</script>" +
  "</body>" +
"</html>");

var CDN = ['https://fb.me/react-0.14.7.min.js', 'https://fb.me/react-dom-0.14.7.min.js'];

function SnippetRunner(container) {
    this.container = container;
    this.iframe = $();
}

SnippetRunner.prototype = {
    resizeFrame: function() {
      this.iframe.height(this.iframe.contents().outerHeight());
    },

    update: function(content) {
      this.iframe.remove();

      this.iframe =
          $('<iframe class="snippet-runner">')
              .attr("src", 'javascript:void(0)')
              .show()
              .appendTo(this.container);

      var contents = this.iframe.contents();
      contents[0].open();
      contents[0].write(content);
      contents[0].close();

      var iframe = this.iframe[0];
      var iframeWnd = iframe.contentWindow || iframe;
      iframeWnd._runnerInit = this.resizeFrame.bind(this);
    }
};

function resourceLinks(resources) {
    return $.map(resources, function(resource) {
        if (resource.match(/\.css$/)) {
            return "<link rel='stylesheet' href='" + resource + "'>";
        } else {
            return "<script src='" + resource + "'></script>";
        }
    }).join("");
}

// TODO: consider using systemJS for previewing react
function reactPage(html, jsx) {
    var transpiled;
    try {
        transpiled = Babel.transform(jsx, {
            presets: [ 'react', 'es2015', 'stage-1' ]
        }).code;
    } catch(e) {
        var message = e.message.replace(/\n/g, "\\n");
        console.warn(e.message);
        transpiled = "document.write('" + errorTemplate({ error: message }) + "')";
    }

    return reactTemplate({
        cdn: resourceLinks(
            CDN.concat([
                window.jsCDN,
                window.cssCDN
            ])
        ),
        content: html,
        script: transpiled
    });
}

var moduleDirectives = window.moduleDirectives || [];

var angularTemplate = kendo.template(
'<!doctype html>\
<html>\
<head>\
    <link rel="stylesheet" href="' + npmUrl + '/@telerik/kendo-theme-default/dist/all.css" />\
    <style>\
        body { margin: 0; font-family: "RobotoRegular",Helvetica,Arial,sans-serif; font-size: 14px; }\
        my-app { display: block; width: 100%; height: 100%; min-height: 260px; }\
    </style>\
    <script src="https://unpkg.com/zone.js@0.6.13/dist/zone.js"></script>\
    <script src="https://unpkg.com/reflect-metadata@0.1.3/Reflect.js"></script>\
    <script src="https://unpkg.com/systemjs@0.19.31/dist/system.js"></script>\
    <script src="https://unpkg.com/typescript@1.8.10/lib/typescript.js"></script>\
    <script src="' + runnerScript + '"></script>\
    <script>\
        var runner = new ExampleRunner();\
        runner.configure(System, "' + npmUrl + '", ' + JSON.stringify(moduleDirectives) + ');\
        runner.register("main.ts", "#= typescript #");\
        runner.start(System);\
    </script>\
</head>\
<body>\
    #= html #\
    <my-app>\
        loading…\
    </my-app>\
</body>\
</html>\
');

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

var directivesByModule = [
    { module: '@angular/core', match: '@(Component)', import: "Component" },
    { module: '@angular/forms', match: 'ngModel', import: "FormsModule" },
    { module: '@angular/platform-browser', match: '.', import: "BrowserModule" }
].concat(moduleDirectives);

// tested in test.html
function analyzeDirectives(code) {
    var directives = directivesByModule.map(function(directive) {
        var match = (new RegExp(directive.match)).exec(code);

        if (match) {
            return {
                directive: directive.import,
                module: directive.module
            };
        }
    }).filter(Boolean);

    return directives;
}

function missingImports(code, directives) {
    var imports = [];

    directives.forEach(function(directive) {
        // test if directive is imported
        var imported = new RegExp("^\\s*import .* from\\s+[\"']" + directive.module + "[\"'];");

        if (!imported.test(code)) {
            imports.push(
                "import { " + directive.directive + " } from '" + directive.module + "';"
            );
        }
    });

    return imports;
}

function bootstrapAngular(code, resize) {
    code = wrapAngularTemplate(code);
    var directives = analyzeDirectives(code);
    var imports = missingImports(code, directives);
    var moduleImports = directives.map(function(item) {
        if (/Module$/.test(item.directive))
            return item.directive;
    }).filter(Boolean).join(',');
    return (imports.concat([
        code,
        "import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';",
        "import { NgModule } from '@angular/core';",
        "@NgModule({",
            "declarations: [AppComponent],",
            "imports: [ " + moduleImports + " ],",
            "bootstrap: [AppComponent]",
        "})",
        "class AppModule {}",
        "platformBrowserDynamic().bootstrapModule(AppModule)",
        (resize ? "\t.then(_runnerInit)" : ""),
        "\t.catch(err => console.error(err));"
    ]).filter(Boolean).join("\n"));
}

function angularPage(ts, html) {
    return angularTemplate({
        html: html || "",
        typescript: bootstrapAngular(ts, true).replace(/"/g, '\\"').replace(/\n/g, '\\\n')
    });
}

// types of code snippets
var blockTypes = {
    'generic': {
        // snippet without type
        // consider changing it by adding type in docs via ```some-type
        label: 'Generic listing, set code type in docs!',
        highlight: 'htmlmixed'
    },
    'html': {
        label: 'HTML',
        highlight: 'htmlmixed'
    },
    'jsx': {
        label: 'JSX',
        highlight: 'jsx'
    },
    'sh': {
        label: 'Shell',
        highlight: 'bash',
        noRun: true
    },
    'js': {
        label: 'JavaScript',
        highlight: 'javascript',
        noRun: true
    },
    'ng-template': {
        label: 'Angular template',
        highlight: 'htmlmixed'
    },
    'ts': {
        label: 'TypeScript',
        highlight: 'text/typescript'
    }
};

// denotes group of several code snippets
function CodeListing(elements) {
  var that = this;

  this.elements = elements;

  this.types = $.map(this.elements.find("code"), function(element) {
      var preview = false;
      var noRun = false;
      var language = /lang(uage)?-([^\s]+)/.exec(element.className);
      var hideTabs = element.className.match(/hide-tabs/);
      language = language ? language[2] : "generic";

      if (/-preview/.test(language)) {
          language = language.replace(/-preview/, "");
          preview = true;
      } else if (/-no-run/.test(language)) {
          language = language.replace(/-no-run/, "");
          noRun = true;
      }

      that[language] = $(element).text();

      return $.extend({
          language: language,
          noRun: noRun,
          hideTabs: hideTabs,
          preview: preview
      }, blockTypes[language]);
  });
}

CodeListing.prototype = {
    updateHtml: function() {
      var block = this;

      this.elements.find("code").addClass("cm-s-default")
        .each(function(idx) {
            var code = $(this);
            var typeInfo = block.types[idx];

            if (typeInfo.preview) {
                block.preview = true;
            } else if (typeInfo.noRun) {
                block.noRun = true;
            }

            code.parent().attr("data-code-language", typeInfo.label);

            // colorize code
            CodeMirror.runMode(code.text(), typeInfo.highlight, code[0]);
        });
    },
    hide: function() {
      this.elements.hide();
    },
    show: function() {
      this.elements.show();
    }
};

// TODO: extract form posting logic
var jsFiddleTemplate = '<form style="display: none;" action="http://jsfiddle.net/api/post/library/pure/" method="post" target="_blank">' +
'<input type="hidden" name="panel_html" value="0" />' +
'<input type="hidden" name="panel_js" value="3" />' + // 3 means babel
'<input type="hidden" name="wrap" value="b" />' +
'<input type="hidden" name="title" value="Kendo UI for React Example" />' +
'<input type="hidden" name="resources" value="" />' +
'<input type="hidden" name="html" value="" />' +
'<input type="hidden" name="js" value="" />' +
'<input type="hidden" name="css" value="" />' +
'</form>';

function openInFiddle(jsx, html) {
    var scripts = $.map(CDN.concat([window.jsCDN]), function(script) {
        return "<script src=" + script + "></script>\n";
    }).join("");

    var form = $(jsFiddleTemplate).appendTo(document.body);
    form.find('[name=html]').val("<!-- we need the resources here due to https://github.com/jsfiddle/jsfiddle-issues/issues/736 -->\n" + scripts + html);
    form.find('[name=js]').val(jsx);
    form.find('[name=css]').val("@import url('" + window.cssCDN + "');");
    form[0].submit();
    form.remove();
}

var plunkerFiles = [
    'index.html',
    'systemjs.config.js',
    'app/main.ts',
    'app/app.component.ts',
    'app/app.module.ts',
    'tsconfig.json'
];

function EditorForm(action) {
    this.form = $('<form style="display: none;" action="' + action + '" method="post" target="_blank" />').appendTo(document.body);
}

EditorForm.prototype.addField = function(name, value) {
    $('<input type=hidden />').val(value).attr("name", name).appendTo(this.form);
}

EditorForm.prototype.submit = function() {
    this.form[0].submit();
    this.form.remove();
    this.form = null;
}

function getPlunkerFile(file) {
    return $.ajax(plunkerBluePrintPath + file, { dataType: 'text' });
}

function toModuleImport(dir) {
    return "import { " + dir.import + " } from '" + dir.module + "';";
}

function toSystemJsPackage(dir) {
    var key = '"' + dir.module + '"';
    var contents = JSON.stringify({ main: './dist/npm/js/main.js', defaultExtension: 'js' });

    return key + ": " + contents + ",";
}

function openInPlunkr(ts) {
    plunkrContext = {
        appComponentContent: ts,
        npmUrl: $("<a />").attr("href", npmUrl)[0].href + "/",

        appModuleImports:   $.map(moduleDirectives, toModuleImport).join("\n"),
        appModules:         $.map(moduleDirectives, function(dir) { return dir.import }).join(", "),
        systemjsPackages:   $.map(moduleDirectives.filter(function(dir) { return dir.module.indexOf('@angular') != 0 }), toSystemJsPackage).join("\n")
    };

    var form = new EditorForm('http://plnkr.co/edit/?p=preview');
    form.addField('tags[0]', 'angular2')
    form.addField('tags[1]', 'kendo')

    $.when.apply($, $.map(plunkerFiles, getPlunkerFile)).then(function() {
        $.each(arguments, function(index, arr) {
            form.addField('files[' + plunkerFiles[index] + ']', kendo.template(arr[0])(plunkrContext));
        })

        form.submit();
    })
}

$(function() {

  var framework = {
      angular: {
          editor: 'plunkr',
          editButtonTemplate: '<a href="#" class="edit-online plunkr">Open as Plunker</a>',
          editOnline: function(listing) {
              openInPlunkr(listing['ts']);
              return false;
          },
          runnerContent: function(listing) {
              return angularPage(
                  listing['ts'] || listing['ng-template'],
                  listing['html']
              );
          }
      },
      react: {
          editor: 'jsfiddle',
          editButtonTemplate: '<a href="#" class="edit-online jsfiddle">Edit in JSFiddle</a>',
          editOnline: function(listing) {
              openInFiddle(listing['jsx'], listing['html']);
              return false;
          },
          runnerContent: function(listing) {
              return reactPage(listing['html'], listing['jsx']);
          }
      }
  }[/\breact\b/i.test(window.jsCDN) ? 'react' : 'angular'];

  function toCodeListings(tags) {
      var blocks = [];

      for (var i = 0; i < tags.length;) {
          var siblingTags = tags.eq(i).nextUntil(":not(pre)").addBack();
          blocks.push(new CodeListing(siblingTags));

          i += siblingTags.length;
      }

      return blocks;
  }

  toCodeListings($("pre")).forEach(function(block, idx) {
      block.updateHtml();

      if (block.noRun) {
      } else if (block.preview) {
          // preview snippets - start with example, allow view source
          var previewElement =
              $(previewTemplate({
                  editButtonTemplate: framework.editButtonTemplate,
                  index: idx
              })).insertBefore(block.elements[0]);

          previewElement.find('.tab-code').append(block.elements);

          if (block.types[0].hideTabs) {
              $(previewElement[0]).hide(); // hide the tabstrip
          }

          previewElement.find('.edit-online').click(
              framework.editOnline.bind(null, block)
          );

          var content = framework.runnerContent(block);

          var preview = new SnippetRunner(previewElement.find('.tab-preview'))
          preview.update(content);
      } else {
          var title = $("<h4 class='example-title'>Code Sample</h4>").insertBefore(block.elements[0]);
          var run = $("<button class='button secondary'>Run Code</button>").insertAfter(block.elements.last());
          run.wrap("<p class='run-code'></p>");

          // TODO: delegate run handler instead
          run.click(function() {
            $(document.body).css("overflow", "hidden")
            run.hide();
            title.hide();

            var editor = $(editorTemplate({
                editButtonTemplate: framework.editButtonTemplate,
                block: block
            })).insertAfter(block.elements[0]).show();

            var close = function() {
              $(document.body).css("overflow", "")
              run.show();
              title.show();
              editor.remove();
            }

            editor.find('.button-close').click(close);

            editor.on("keyup", function(e) {
                if (e.keyCode == 27) {
                  close();
                }
            });

            var codeMirrors = block.types.map(function(typeInfo, index) {
                var value = block[typeInfo.language];

                return CodeMirror(function(elt) {
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
                }, {});
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
                var content = framework.runnerContent(listing());

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

      if (window.Clipboard) {
          $(block.elements).before('<button class="btn copy-btn">Copy</button>');
      }
  });

  if (window.Clipboard) {
      var clipboard = new Clipboard('.copy-btn', {
        text: function(trigger) {
            return $(trigger).next('pre').text();
        }
      })

      clipboard.on('success', function(e) {
        setTooltip(e.trigger, 'Copied!');
        hideTooltip(e.trigger);
      });

      $('.copy-btn').tooltip({
        trigger: 'click',
        placement: 'bottom'
      });

      function setTooltip(btn, message) {
        $(btn).tooltip('hide')
          .attr('data-original-title', message)
          .tooltip('show');
      }

      function hideTooltip(btn) {
        setTimeout(function() {
          $(btn).tooltip('hide');
        }, 1000);
      }
  }
});
