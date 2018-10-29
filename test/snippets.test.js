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
            'multifile-listing': [
                { name: 'main.js' }
            ]
        })).toBe('javascript');
    });

    // embed_file in Angular examples
    test('marks multi-file ts examples as angular-cli', () => {
        expect(templateName({
            'multifile-listing': [
                { name: 'main.ts' }
            ]
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
        expect(files['index.html']).toContain('cdn.jsdelivr.net/npm/@progress/kendo-theme-default');

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
    });
});

describe('stackblitz dependencies', () => {
    describe('getExampleImports', () => {
        const defaultChannel = 'dev';
        const productionChannelVersion = 'latest';
        const devChannelVersion = 'dev';
        const anyChannelVersion = '*';

        test('extract default import from single file', () => {
            const packageName = 'foo';
            const importStatement = `import foo from "${packageName}"`;
            const files = {
                'app/main.js': importStatement
            };

            const imports = snippets.getExampleImports(files, defaultChannel);

            expect(imports[packageName]).not.toBe(undefined);
        });
        test('extract default imports from multiple files', () => {
            const fooPackageName = 'foo';
            const barPackageName = 'bar';

            const importFooStatement = `import foo from "${fooPackageName}"`;
            const importBarStatement = `import bar from "${barPackageName}"`;

            const files = {
                'foo.js': importFooStatement,
                'bar.js': importBarStatement
            };

            const imports = snippets.getExampleImports(files, defaultChannel);

            expect(imports[fooPackageName]).not.toBe(undefined);
            expect(imports[barPackageName]).not.toBe(undefined);
        });
        test('should ignore progress/telerik packages', () => {
            const channel = 'latest';
            const progressPackageName = '@progress/foo';
            const telerikPackageName = '@telerik/bar';

            const importFooStatement = `import foo from "${progressPackageName}"`;
            const importBarStatement = `import bar from "${telerikPackageName}"`;

            const files = {
                'foo.js': importFooStatement,
                'bar.js': importBarStatement
            };

            const imports = snippets.getExampleImports(files, channel);

            expect(imports[progressPackageName]).toEqual(undefined);
            expect(imports[telerikPackageName]).toEqual(undefined);
        });
        test('should **not** apply dev channel for non-progress/telerik packages', () => {
            const channel = 'dev';
            const fooPackageName = 'foo';
            const barPackageName = 'bar';

            const importFooStatement = `import foo from "${fooPackageName}"`;
            const importBarStatement = `import bar from "${barPackageName}"`;

            const files = {
                'foo.js': importFooStatement,
                'bar.js': importBarStatement
            };

            const imports = snippets.getExampleImports(files, channel);

            expect(imports[fooPackageName]).toEqual(anyChannelVersion);
            expect(imports[barPackageName]).toEqual(anyChannelVersion);
        });
        test('should **not** recognize local module imports as external packages', () => {
            const channel = 'dev';
            const localFileImport = './foo';

            const importFooStatement = `import foo from "${localFileImport}"`;

            const files = {
                'foo.js': importFooStatement
            };

            const imports = snippets.getExampleImports(files, channel);

            expect(imports).toEqual({});
        });
    });
    describe('buildExampleDependencies', () => {
        [
            'react',
            'angular',
            'builder',
            'react-wrappers'
        ].forEach(platform => {
            [
                'production',
                'development'
            ].forEach(env => {
                test(`should apply platformDependencies for ${platform} in ${env} environment`, () => {
                    window.env = env;
                    const channel = env === 'production' ? 'latest' : 'dev';
                    const stackBlitzDependencies = snippets.stackBlitzDependencies[platform](channel);
                    const dependencies = snippets.buildExampleDependencies(platform);

                    expect(dependencies).toEqual(stackBlitzDependencies);
                });

                test(`should apply example imports as dependencies on top of default ${platform} dependencies`, () => {
                    window.env = env;
                    const channel = env === 'production' ? 'latest' : 'dev';
                    const imports = { 'foo': channel, 'bar': channel };
                    const stackBlitzDependencies = snippets.stackBlitzDependencies[platform](channel);
                    const dependencies = snippets.buildExampleDependencies(platform, imports);

                    expect(dependencies).toEqual(global.$.extend({}, stackBlitzDependencies, imports));
                });
            });
        });
        test('should dependencies for react-wrappers when window.wrappers is set to true', () => {
            window.wrappers = true;
            const stackBlitzDependencies = snippets.stackBlitzDependencies['react-wrappers']('dev');
            const dependencies = snippets.buildExampleDependencies('react');

            expect(dependencies).toEqual(stackBlitzDependencies);
        });
    });
    describe('getPackageName', () => {
        it('should get normal package', () => {
            const importPath = 'foo';
            const result = snippets.getPackageName(importPath);

            expect(result).toEqual('foo');
        });
        it('should get scoped package', () => {
            const importPath = '@foo/bar';
            const result = snippets.getPackageName(importPath);

            expect(result).toEqual('@foo/bar');
        });
        it('should get nested package', () => {
            const importPath = 'foo/bar';
            const result = snippets.getPackageName(importPath);

            expect(result).toEqual('foo');
        });
        it('should get scoped and nested package', () => {
            const importPath = '@foo/bar/baz';
            const result = snippets.getPackageName(importPath);

            expect(result).toEqual('@foo/bar');
        });
        it('should get really long nested imports', () => {
            const importPath = 'foo/bar/baz/gez/guz/kus';
            const result = snippets.getPackageName(importPath);

            expect(result).toEqual('foo');
        });
        it('should get really long scoped imports', () => {
            const importPath = '@foo/bar/baz/gez/guz/kus';
            const result = snippets.getPackageName(importPath);

            expect(result).toEqual('@foo/bar');
        })
        it('should **not** fail with empty string', () => {
            const importPath = '';

            expect(() => {snippets.getPackageName(importPath);}).not.toThrow();
        });
    });

    describe('resolvePeerDependencies', () => {
        it('should return peers of package', () => {
            const result = snippets.resolvePeerDependencies('foo', {
                'foo': ['bar', 'baz']
            });

            expect(result).toEqual({
                'bar': '*',
                'baz': '*'
            });
        });

        it('should return deep peerDependencies', () => {
            const result = snippets.resolvePeerDependencies('foo', {
                'foo': ['bar', 'baz'],
                'bar': ['qux']
            });

            expect(result).toEqual({
                'bar': '*',
                'baz': '*',
                'qux': '*'
            });
        });
    });
});
