const snippets = require('../docs-public/snippets.js');

describe('preparing snippets for editing', () => {
    test('returns a promise', () => {
        expect(typeof snippets.prepareSnippet().then).toBe('function');
    });

    test('resolves to an object', () => {
        expect(snippets.prepareSnippet()).resolves.toBe({});
    });

    test('adds .angular-cli.json for angular snippets', async () => {
        const files = await snippets.prepareSnippet({ platform: 'angular' }, { });

        await expect(files['.angular-cli.json']).not.toBeFalsy();
    });
});
