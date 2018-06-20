const snippets = require('../docs-public/snippets.js');

describe('inferring stackblitz templates', () => {
    const templateName = snippets.getStackBlitzTemplate;

    // ```ts in Angular examples
    test('marks ts examples as angular-cli', () => {
        expect(templateName({ ts: 'foo' })).toBe('angular-cli');
    });

    // ```jsx in all React examples
    test('marks jsx examples as create-react-app', () => {
        expect(templateName({ jsx: 'foo' })).toBe('create-react-app');
    });

    // ```js in all Vue examples
    test('marks js examples as javascript', () => {
        expect(templateName({ js: 'foo' })).toBe('javascript');
    });

    // ```html in the Styling/Icons help topic
    test('marks html examples as javascript', () => {
        expect(templateName({ html: 'foo' })).toBe('javascript');
    });

    // embed_file in DataQuery/Drawing examples
    test('marks js examples as javascript', () => {
        expect(templateName({
            'multifile-listing': [ { name: 'main.js' } ]
        })).toBe('javascript');
    });

    // embed_file in Angular examples
    test('marks multi-file ts examples as angular-cli', () => {
        expect(templateName({
            'multifile-listing': [ { name: 'main.ts' } ]
        })).toBe('angular-cli');
    });
});

describe('preparing snippets for editing', () => {
    test('returns a promise', () => {
        expect(typeof snippets.prepareSnippet({}, {}).then).toBe('function');
    });

    test('resolves to an object', () => {
        expect(snippets.prepareSnippet({}, {})).resolves.toBe({});
    });

    test('adds .angular-cli.json for angular snippets', async () => {
        const files = await snippets.prepareSnippet({ platform: 'angular' }, { });

        expect(files['.angular-cli.json']).not.toBeFalsy();
    });

    test('adds index.js for react snippets', async () => {
        const files = await snippets.prepareSnippet(
            { platform: 'react' },
            { jsx: 'foo' }
        );

        expect(files['index.js']).toBe('import "./app/main";');
    });

    test('posts HTML-only snippets', async () => {
        const files = await snippets.prepareSnippet(
            { npmUrl: 'https://unpkg.com' },
            { html: 'foobar' }
        );

        expect(files['index.html']).toBeTruthy();
        expect(files['index.html']).toContain('foobar');
        expect(files['index.html']).toContain('unpkg.com/@progress/kendo-theme-default');

        expect(files['index.js']).toBe(''); // because stackblitz
    });

    test('adds index.js for vanilla js snippets', async () => {
        const files = await snippets.prepareSnippet(
            {},
            {
                'multifile-listing': [
                    { name: 'main.js', content: 'foo' }
                ],
                js: 'foo'
            }
        );

        expect(files['index.js']).toBe('foo');
    });

    test('passes argument files in result', async () => {
        const files = await snippets.prepareSnippet(
            {}, {}, { 'foo.js': 'foo' }
        );

        expect(files['foo.js']).toBe('foo');
    });

    // required as long as stackblitz has no jsx file support
    // see https://github.com/stackblitz/core/issues/370#issuecomment-379365823
    describe('renames jsx to js', () => {
        test('with embed_file of single main.jsx', async () => {
            const files = await snippets.prepareSnippet(
                { platform: 'react' },
                {
                    'multifile-listing': [
                        { name: 'main.jsx', content: 'foo' }
                    ],
                    jsx: 'foo'
                }
            );

            expect(files['app/main.js']).toBe('foo');
            expect(files['app/main.jsx']).toBeFalsy();
        });

        test('in all embedded jsx files', async () => {
            const files = await snippets.prepareSnippet(
                { platform: 'react' },
                {
                    'multifile-listing': [
                        { name: 'main.jsx', content: 'foo' },
                        { name: 'other.jsx', content: 'bar' }
                    ],
                    jsx: 'foo'
                }
            );

            expect(files['app/main.js']).toBe('foo');
            expect(files['app/main.jsx']).toBeFalsy();

            expect(files['app/other.js']).toBe('bar');
            expect(files['app/other.jsx']).toBeFalsy();
        });

        test('replaces .jsx imports in file content', async () => {
            const files = await snippets.prepareSnippet(
                { platform: 'react' },
                {
                    'multifile-listing': [
                        { name: 'main.jsx', content: 'import { foo } from "./other.jsx";' },
                        { name: 'other.jsx', content: 'export const foo = "bar";' }
                    ],
                    jsx: 'foo'
                }
            );

            expect(files['app/main.js']).toBe('import { foo } from "./other";');
        });

        test('replaces jsx file in single-file snippet', async () => {
            const files = await snippets.prepareSnippet(
                { platform: 'react' },
                { jsx: 'foo' },
                { 'app/main.jsx': 'foo' }
            );

            expect(files['app/main.jsx']).toBeFalsy();
            expect(files['app/main.js']).toBe('foo');
        });
    });
});
