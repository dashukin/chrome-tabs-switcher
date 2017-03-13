/**
 * @nape webpack
 * @type {Object}
 * @property NoEmitOnErrorsPlugin
 */

var webpack = require('webpack');

module.exports = {
	entry: {
		eventPage: './src/app/js/eventPage',
		contentscript: './src/app/js/contentscript',
		popup: './src/app/js/popup'
	},
	output: {
		filename: '[name].js'
	},
	module: {
		loaders: [{
			test: /\.js/,
			exclude: '/node_modules/',
			loader: 'babel-loader'
		}]
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin()
	]
};