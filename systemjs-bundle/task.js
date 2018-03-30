const path = require('path');
const _ = require('lodash');
const WebpackSystemRegister = require('webpack-system-register');
const wrap = require('gulp-wrap');
const gulpUglify = require('gulp-uglify');
const $ = require('gulp-load-plugins')();

const packageInfo = require(path.join(process.cwd(), 'package.json'));
const packageKeys = (key) => Object.keys(packageInfo[key] || {});
const matchStartsWith = (key) => new RegExp(`^${key}`);
const deps = packageKeys('dependencies').concat(packageKeys('peerDependencies'));
const packageDependencies = deps.map(matchStartsWith);
const packageName = packageInfo.name;
const SRC_EXT_GLOB = ".{jsx,ts,tsx,js}";

module.exports = (gulp, { webpackConfig, distName, modules = [], webpackStream, webpack }) => {

    gulp.task('build-systemjs-bundle', () => {
        const config = _.assign({}, webpackConfig);

        config.plugins = config.plugins || [];
        config.plugins.push(new WebpackSystemRegister({
            systemjsDeps: packageDependencies,
            registerName: packageName
        }));

        gulp.src('src/main' + SRC_EXT_GLOB)
            .pipe(webpackStream(config, webpack))
            .pipe(wrap({ src: path.join(__dirname, 'systemjs-bundle.template.js' ) }, { packageName: packageName, modules: modules }, { variable: "data" }))
            .pipe($.rename((path) => {
                path.basename = distName;
            }))
            .pipe(gulpUglify())
            .pipe(gulp.dest('dist/systemjs/'));
    });
};
