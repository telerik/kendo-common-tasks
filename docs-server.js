const path = require('path');
const fs = require('fs');

const express = require('express');
const mds = require('./markdown-serve');
const sassMiddleware = require('node-sass-middleware');
const BrowserSync = require('browser-sync');
const serveIndex = require('serve-index');
const rewrite = require('express-urlrewrite');
const argv = require('yargs').argv;

module.exports = (libraryName, onServerStart, done) => {
    const app = express();
    const platformMatch = new RegExp(/kendo.*(react|angular|vue|builder)/g).exec(libraryName);
    const platform = argv.platform || (platformMatch && platformMatch[1]) || 'angular';
    const staticContentOptions = {
        setHeaders: (response) => {
            response.set('Access-Control-Allow-Origin', 'http://run.plnkr.co');
        }
    };

    app.use(rewrite(/(.+)\.md$/, '/$1'));

    app.set('views', __dirname);
    app.set('view engine', 'hbs');

    app.use(sassMiddleware({
        src: path.join(__dirname, 'docs-public'),
        dest: path.join(__dirname, '.compiled'),
        ouputStyle: 'compressed',
        prefix: '/internals'
    }));
    app.use('/internals', express.static(path.join(__dirname, 'docs-public')));
    app.use('/internals', express.static(path.join(__dirname, '.compiled')));
    app.use('/cdn', express.static('dist/cdn/'));
    app.use('/npm', express.static('node_modules', staticContentOptions));
    app.use('/npm', express.static('../../node_modules', staticContentOptions));
    app.use(`/npm/@progress/${libraryName}`, express.static('.', staticContentOptions));
    app.use('/', serveIndex('docs', { 'icons': true }));
    app.use('/', express.static('docs/'));

    const constant = (x) => () => x;
    const meta = (_, options) => {
        const opts = options.split(' ').reduce((hash, tuple) => {
            const [ key, value ] = tuple.split(':');
            if (key) {
                hash[key] = value;
            }
            return hash;
        }, {});

        const attr = Object.keys(opts).map(
            (key) => `data-${key}='${opts[key]}'`
        );

        if (opts.hasOwnProperty('height')) {
            attr.push(`style='height: ${Number(opts['height']) + 50}px'`);
        }

        return `<div ${attr.join(' ')}>`;
    };
    const encode = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
    const escapeHtml = (str) => str.replace(/[&<>]/g, (char) => encode[char]);
    const exists = (file) => {
        try {
            fs.accessSync(file, fs.F_OK);
            return true;
        } catch (e) {
            return false;
        }
    };
    const embedFile = (_, options) => {
        const params = options.split(' ');
        const filepath = path.join("docs", "examples", params[0]);

        if (!exists(filepath)) {
            console.warn(`Demo file ${filepath} not found.`); // eslint-disable-line no-console
            return "";
        }

        const basename = path.basename(filepath);
        const language = path.extname(basename).replace('.','');
        const hidden = params.some(p => p === "hidden");
        const preview = params.some(p => p === "preview");
        const content = escapeHtml(fs.readFileSync(filepath, 'utf-8'));
        return `
<pre data-file='${basename}' ${hidden ? "data-hidden='true'" : "" }>
<code class='language-${language}-multiple${preview ? "-preview" : "" }'>${content}</code>
</pre>`;
    };
    const platformContent = (_, platformCapture, contentCapture) => // eslint-disable-line no-arrow-condition
        (platformCapture === platform ? contentCapture : '');

    const processPlugins = (content, plugins) => {
        let result = content;
        plugins.forEach((plugin) => {
            const pluginRe = new RegExp(`{%\\s*${plugin.name}\\s*([^%]+)?\\s*%}`, 'g');
            result = result.replace(plugin.regExp || pluginRe, plugin.process);
        });
        return result;
    };

    app.use(mds.middleware({
        rootDirectory: 'docs',
        view: 'docs-layout',
        preParse: function(markdownFile) {
            let content = markdownFile.parseContent();

            content = processPlugins(content, [
                {
                    name: "platform_content",
                    regExp: new RegExp('{%\\s*platform_content\\s*([^%]+?)\\s*%}((.|\\n)*?){%\\s*endplatform_content\\s*%}', 'g'),
                    process: platformContent
                },
                { name: "embed_file", process: embedFile },
                { name: "meta", process: meta },
                { name: "endmeta", process: constant("</div>") }
            ]);

            return {
                scriptSrc: `js/${libraryName}.js`,
                styleSrc: `css/${libraryName}.css`,
                content: content,
                platform: platform,
                blueprint: 'stackblitz'
            };
        }
    }));

    app.listen(3000, () => {
        const browserSync = BrowserSync.create();

        browserSync.init({
            open: false,
            port: 8080,
            proxy: "localhost:3000"
        });

        onServerStart(browserSync);
    });

    process.on('exit', done);
};
