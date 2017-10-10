/*global
	require, module, __dirname
 */
/**
 * @nape webpack
 * @type {Object}
 * @property NoEmitOnErrorsPlugin
 */

var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: {
		eventPage: './src/app/eventPage',
		contentscript: './src/app/contentscript',
		popup: './src/app/popup'
	},
	output: {
		filename: '[name].js'
	},
	module: {
		rules: [{
			test: /jsx?$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		}]
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin()
	],
	resolve: {
		alias: {
			constants: path.resolve(__dirname, './src/app/application/constants')
		}
	}
};