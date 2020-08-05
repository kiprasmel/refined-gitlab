// webpack.config.js

/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const SizePlugin = require("size-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	devtool: "source-map",
	stats: "errors-only",
	entry: {
		background: "./source/background.ts",
		options: "./source/options.ts",
		index: "./source/index.ts",
	},
	output: {
		path: path.join(__dirname, "distribution"),
		filename: "[name].js",
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx", ".scss"],
	},
	module: {
		rules: [
			{
				test: /\.(js|ts|tsx)$/,
				loader: "ts-loader",
				options: {
					transpileOnly: true /** TODO FUTURE `false` */,

					// compilerOptions: {
					// 	// Enables ModuleConcatenation. It must be in here to avoid conflict with ts-node when it runs this file
					// 	// module: "es2015",
					// },
				},
				exclude: /node_modules/,
			},
			/** https://webpack.js.org/loaders/postcss-loader/ */
			{
				// test: /\.s?css$/,

				// For pure CSS - /\.css$/i,
				// For Sass/SCSS - /\.((c|sa|sc)ss)$/i,
				// For Less - /\.((c|le)ss)$/i,
				test: /\.((c|sa|sc)ss)$/i,
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader", options: { sourceMap: true, importLoaders: 1, modules: { auto: true } } },
					{ loader: "postcss-loader", options: { sourceMap: true } },
					{ loader: "sass-loader", options: { sourceMap: true } },
				],
			},
		],
	},
	plugins: [
		new SizePlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: "**/*",
					context: "source",
					globOptions: {
						ignore: ["*.js"],
					},
				},
				{
					from: "node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
				},
			],
		}),
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: false,
					compress: false,
					output: {
						beautify: true,
						indent_level: 2, // eslint-disable-line @typescript-eslint/camelcase
					},
				},
			}),
		],
	},
};
