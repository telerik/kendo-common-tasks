const contains = require('gulp-contains');
const gutil = require('gulp-util');

module.exports = (gulp, packageName) => {
    const reportError = message => (string, file, cb) => {
        const filename = /[\/\\](docs.*)$/.exec(file.path)[1];
        const error = `
        ${message.replace(/FILE/, filename)}
        I can't tell you exactly where due to technical limitations, sorry.
        Validation provided by ${packageName}.`;
        cb(new gutil.PluginError('gulp-contains', error));
    };

    gulp.task('lint-slugs', () =>
        gulp.src('docs/**/*.{md,hbs}')
            .pipe(contains({
                search: /{%\s*(?!(asset_path|embed_file|endmeta|meta|slug|platform_content|endplatform_content)\b)\w+/,
                onFound: reportError("Unknown Liquid tags found in 'FILE'.")
            }))
            .pipe(contains({
                search: /{%\s*slug\s+(?!([a-zA-Z0-9_\-])+\s*%})/,
                onFound: reportError("Slugs with invalid characters found in 'FILE'.")
            }))
    );
};
