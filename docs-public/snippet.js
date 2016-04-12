/* eslint-env es6 */
var reactTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <script src="https://fb.me/react-with-addons-0.14.7.min.js"></script>
    <script src="https://fb.me/react-dom-0.14.7.min.js"></script>
    <script src="${scriptSrc}"></script>
    <link rel="stylesheet" href="${styleSrc}">
  </head>
  <body>
    {{content}}
    <script>
      {{script}}
    </script>
  </body>
</html>
  `;

function ReactPreview(container) {
    this.iframe = $('<iframe class="snippet-runner">').attr("src", '/internals/runner.html');
    this.iframe.show();
    this.iframe.height(300).width('100%');
    container.append(this.iframe);
}

ReactPreview.prototype.update = function(jsx, html) {
    var content = reactTemplate
      .replace('{{content}}', html)
      .replace('{{script}}', Babel.transform(jsx, { presets: [ 'react', 'es2015', 'stage-1' ] }).code);

    var contents = this.iframe.contents();
    contents[0].open();
    contents[0].write(content);
    contents[0].close();
}

$(function() {
  var editorTemplate = `
    <div class=editor>
      <button class="close">X</button>
      <br />
      <div class=pane>
        <h5>HTML</h5>
        <div class="html"></div>
      </div>

      <div class=pane>
        <h5>JSX</h5>
        <div class="jsx"></div>
      </div>

      <div class=preview-pane>
        <h5>Preview</h5>
        <div class="preview"></div>
      </div>
    </div>
  `
  $("code.lang-html").each(function(idx, el) {
    el = $(el)
    var jsx = el.parent().next('pre').find('code.lang-jsx')

    var run = $("<button>Run</button>").insertBefore(el.parent())

    run.click(function() {
      run.hide();
      el.parent().hide();
      jsx.parent().hide();

      var editor = $(editorTemplate).insertAfter(jsx.parent())

      editor.find('.close').click(function() {
        el.parent().show();
        jsx.parent().show();
        run.show();
        editor.remove();
      })

      var jsxCodeMirror = CodeMirror(function(elt) {
        editor.find('.jsx').append(elt)
      }, {
        value: jsx.text(),
        mode: 'jsx',
        lineWrapping: true
      })

      var htmlCodeMirror = CodeMirror(function(elt) {
        editor.find('.html').append(elt)
      }, {
        value: el.text(),
        mode: 'htmlmixed',
        lineWrapping: true
      });

      htmlCodeMirror.on('changes', onChange)
      jsxCodeMirror.on('changes', onChange)

      var preview = new ReactPreview(editor.find('.preview'));

      function onChange() {
        preview.update(jsxCodeMirror.getValue(), htmlCodeMirror.getValue())
      }

      onChange();
    })
  });

  var previewTemplate = `
    <div class=preview>
      <button class="preview">Preview</button> | <button class="code">Code</button>
      <div class=preview-pane>
      </div>
      <div class=code-pane style='display: none'>
      </div>
    </div>
  `

  $("code.lang-html-preview").each(function(idx, el) {
    el = $(el)
    var jsx = el.parent().next('pre').find('code.lang-jsx')
    var preview = $(previewTemplate).insertBefore(el.parent())
    preview.find('.code-pane').append(el.parent()).append(jsx.parent())

    var iFrame = new ReactPreview(preview.find('.preview-pane'))
    iFrame.update(jsx.text(), el.text())

    preview.find('.preview').click(function() {
      preview.find('.preview-pane').show()
      preview.find('.code-pane').hide()
    })

    preview.find('.code').click(function() {
      preview.find('.code-pane').show()
      preview.find('.preview-pane').hide()
    })
  });
});
