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
            'multifile-listing': [{ name: 'main.js' }]
        })).toBe('javascript');
    });

    // embed_file in Angular examples
    test('marks multi-file ts examples as angular-cli', () => {
        expect(templateName({
            'multifile-listing': [{ name: 'main.ts' }]
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
        const files = await snippets.prepareSnippet({ platform: 'angular' }, {});

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

    test('removes angular module from angular-cli template', async () => {
        const files = await snippets.prepareSnippet(
            { platform: 'angular' }, {}, { 'app/main.ts': 'foo' }
        );

        expect(files['app/main.ts']).toBeFalsy();
    });

    test('runs vue snippets in javascript templates', async () => {
        const files = await snippets.prepareSnippet(
            {},
            {
                js: "foo",
                html: "bar"
            },
            {
                'app/main.es': 'foo',
                'index.html': 'baz'
            }
        );

        expect(files['index.html']).toBe('baz');
        expect(files['index.js']).toBe('import "./app/main";');
        expect(files['app/main.js']).toBe('foo');
    });

    test('imports @progress/kendo-ui package correctly', async () => {
        const exportStatement = snippets.toModuleImport({
            import: "kendo",
            main: "js/kendo.all.js",
            module: "@progress/kendo-ui"
        });

        expect(exportStatement).toBe("import '@progress/kendo-ui';");
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

        test('does not replace file in in-line preview snippet', async () => {
            const files = await snippets.prepareSnippet(
                { platform: 'react' },
                { jsx: 'foo' },
                { 'app/main.js': 'foo' }
            );

            expect(files['app/main.js']).toBe('foo');
        });
    });

    describe('react cldr-data', () => {
        describe('extractCldrImports', () => {
            test('replace path', () => {
                const path = 'cldr-data/supplemental/likelySubtags.json';

                const result = snippets.extractCldrImports('import cldr from "' + path + '"');

                expect(result).toContain('../' + path);
            });
            test('works with empty content', () => {
                expect(() => { snippets.extractCldrImports(''); }).not.toThrow();
            });
            test('works with empty array', () => {
                expect(() => { snippets.extractCldrImports([]); }).not.toThrow();
            });
        });
        describe('addCldrFilesToForm', () => {
            test('add files to form', () => {
                const imports = [
                    { path: 'cldr-data/supplemental/likelySubtags.json', content: 'foo' }
                ];
                const addFieldSpy = jasmine.createSpy('addFieldSpy');
                const form = {
                    addField: addFieldSpy
                };

                snippets.addCldrFilesToForm(form, imports);

                expect(addFieldSpy).toHaveBeenCalledWith(
                    `project[files][${imports[0].path}]`,
                    JSON.stringify(imports[0].content)
                );
            });
        });
        describe('preLoadCldrFiles', () => {
            test('pre-load a single file', async () => {
                const param = 'foo';
                const path = 'cldr-data/supplemental/likelySubtags.json';
                const files = [
                    { content: 'import cldr from "' + path + '"' }
                ];
                spyOn(global.$, 'get').and.callFake(((args) => { args.success(param); }));

                const result = await snippets.preloadCldrFiles(files);

                expect(result[0].content).toEqual(param);
                expect(result[0].path).toEqual(path);
            });
            test('pre-load multiple files', async () => {
                const param = 'foo';
                const firstPath = 'cldr-data/supplemental/likelySubtags.json';
                const secondPath = 'cldr-data/main/bg/currencies.json';

                const files = [
                    { content: 'import cldr from "' + firstPath + '"' },
                    { content: 'import cldr from "' + secondPath + '"' }
                ];

                spyOn(global.$, 'get').and.callFake(((args) => { args.success(param); }));

                const result = await snippets.preloadCldrFiles(files);

                expect(result[0].content).toEqual(param);
                expect(result[1].content).toEqual(param);

                expect(result[0].path).toEqual(firstPath);
                expect(result[1].path).toEqual(secondPath);
            });
            test('ignores duplicates', async () => {
                const param = 'foo';
                const path = 'cldr-data/supplemental/likelySubtags.json';

                const files = [
                    { content: 'import cldr from "' + path + '"' },
                    { content: 'import cldr from "' + path + '"' }
                ];

                spyOn(global.$, 'get').and.callFake(((args) => { args.success(param); }));

                const result = await snippets.preloadCldrFiles(files);

                expect(result.length).toEqual(1);
            });
            test('works with empty array', async () => {
                expect(() => { snippets.preloadCldrFiles([]); }).not.toThrow();
            });
        });
    });
});
