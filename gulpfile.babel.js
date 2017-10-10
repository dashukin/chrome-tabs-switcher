/**
 * @name gulp
 * @property pipe
 * @property on
 */

/*global
	require
 */

/**
 * @name webpack
 * @property DefinePlugin
 * @property UglifyJsPlugin
 */

/**
 * @name fsExtra
 * @type {Object}
 * @property readFileSync
 * @property writeFileSync
 */

import gulp from 'gulp';
import del from 'del';
import sass from 'gulp-sass';
import webpack3 from 'webpack';
import gulpWebpack from 'gulp-webpack';
import webpackConfig from './webpack.config';
import gulpHjson from 'gulp-hjson';
import hjson from 'hjson';
import zip from 'gulp-zip';
import runSequence from 'run-sequence';
import yargs from 'yargs';
import fsExtra from 'fs-extra';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

const {argv} = yargs;

const encoding = 'utf8';

// src paths
const packageSrcPath = './package.json';
const appSrcPath = './src/app';
const jsSrcPath = `${appSrcPath}/**/*.js`;
const scssSrcPath = `${appSrcPath}/scss/**/*.scss`;
const manifestSrcPath = `${appSrcPath}/manifest.hjson`;
const staticFilesSrcFiles = [`${appSrcPath}/**/*`, `!${jsSrcPath}`, `!${scssSrcPath}`, `!${manifestSrcPath}`];

// build paths
const buildPath = './build';
const appBuildPath = `${buildPath}/app`;
const jsBuildPath = `${appBuildPath}/js`;
const cssBuildPath = `${appBuildPath}/css`;
const zipSrcPath = `${appBuildPath}/**/*`;

const hjsonConfig = {
	keepWsc: true,
	bracesSameLine: true,
	quotes: 'all',
	space: '\t'
};


gulp.task('clean', () => {
	return del(`${buildPath}/*`);
});

gulp.task('build-manifest', () => {
	return gulp.src(manifestSrcPath)
		.pipe(gulpHjson({to: 'json', jsonSpace: ' '}))
		.pipe(gulp.dest(appBuildPath));
});

gulp.task('watch-manifest', () => {
	return gulp.watch(manifestSrcPath, ['build-manifest']);
});

gulp.task('build-scss', () => {
	return gulp.src(scssSrcPath)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(cssBuildPath));
});

gulp.task('watch-scss', () => {
	return gulp.watch(scssSrcPath, ['build-scss']);
});

gulp.task('build-js:dev', () => {
	return gulp.src(jsSrcPath)
		.pipe(gulpWebpack(webpackConfig, webpack3))
		.pipe(gulp.dest(jsBuildPath));
});

gulp.task('watch-js:dev', () => {
	const devWatchConfig = Object.create(webpackConfig);

	devWatchConfig.watch = true;
	devWatchConfig.plugins = devWatchConfig.plugins.concat([
		new ProgressBarPlugin({
			clear: false
		})
	])

	return gulp.src(jsSrcPath)
		.pipe(gulpWebpack(devWatchConfig, webpack3))
		.pipe(gulp.dest(jsBuildPath));
});

gulp.task('build-js:prod', () => {
	const prodConfig = Object.create(webpackConfig);

	prodConfig.plugins = prodConfig.plugins.concat(
		new webpack3.DefinePlugin({
			"process.env": {
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack3.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),
		new webpack3.optimize.AggressiveMergingPlugin(),
		new webpack3.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				if_return: true,
				join_vars: true
			},
			output: {
				comments: false,
			},
		}),
		new ProgressBarPlugin({
			clear: false
		})
	)

	return gulp.src(jsSrcPath)
		.pipe(gulpWebpack(prodConfig, webpack3))
		.pipe(gulp.dest(jsBuildPath));
});

gulp.task('watch-js', () => {
	return gulp.watch(jsSrcPath, ['watch-js:dev']);
});

gulp.task('zip', () => {
	return gulp.src(zipSrcPath)
		.pipe(zip('app-' + +(new Date) + '.zip'))
		.pipe(gulp.dest(buildPath));
});

gulp.task('build-static', () => {
	return gulp.src(staticFilesSrcFiles)
		.pipe(gulp.dest(appBuildPath));
});

gulp.task('watch-static', () => {
	return gulp.watch(staticFilesSrcFiles, ['build-static'])
});

gulp.task('version', () => {
	const packageData = require(packageSrcPath);
	const {version} = packageData;
	let [major = 0, minor = 0, patch = 0] = version.split('.').map(version => {
		return +version;
	});

	let {patch: createPatch, minor: createMinor, major: createMajor} = argv;

	if (createPatch) {
		patch += 1;
	} else if (createMinor) {
		minor += 1;
		patch = 0;
	} else if (createMajor) {
		major += 1;
		minor = 0;
		patch = 0;
	} else {
		console.log('Missing action type for version update');
		return;
	}

	const newVersion = [major, minor, patch].join('.');

	packageData.version = newVersion;

	fsExtra.writeFileSync(packageSrcPath, JSON.stringify(packageData, null, 4), encoding);

	const manifestText = fsExtra.readFileSync(manifestSrcPath, encoding);
	const manifestData = hjson.rt.parse(manifestText, hjsonConfig);

	manifestData.version = newVersion;

	fsExtra.writeFileSync(manifestSrcPath, hjson.rt.stringify(manifestData, hjsonConfig), encoding);

	console.log(`Version has been updated from ${version} to ${newVersion}`);
})

gulp.task('update-version', () => {
	runSequence(
		'version',
		'build-manifest'
	);
});

gulp.task('start-dev', () => {
	runSequence(
		'clean',
		['build-manifest', 'build-scss', 'build-js:dev'],
		'build-static',
		['watch-manifest', 'watch-scss', 'watch-js'],
		'watch-static'
	);
});

gulp.task('build', () => {
	runSequence(
		'clean',
		['build-manifest', 'build-scss', 'build-js:prod'],
		'build-static',
		'zip'
	);
});
