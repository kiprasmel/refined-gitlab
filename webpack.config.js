// webpack.config.js

/* eslint-disable @typescript-eslint/no-var-requires */

const webpack = require("webpack");
const path = require("path");
const SizePlugin = require("size-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	devtool: "source-map",
	stats: "errors-only",
	entry: {
		background: "./source/scripts-background/background.ts",
		content: "./source/scripts-content/content.ts",
		config: "./source/config.ts",
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
					transpileOnly: false,

					// compilerOptions: {
					// 	// Enables ModuleConcatenation. It must be in here to avoid conflict with ts-node when it runs this file
					// 	// module: "es2015",
					// },
				},
				exclude: {
					or: [
						/node_modules/, //
						// /gitbeaker/, /** cannot ignore lmao */
					],
				},
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
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [
					"file-loader",
					{
						loader: "image-webpack-loader",
					},
				],
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			__isBuiltForBetaTesters: !!process.env.BETA,
			// Passing `true` as the second argument makes these values dynamic — so every file change will update their value.
			__filebasename: webpack.DefinePlugin.runtimeValue(({ module }) =>
				// @ts-expect-error
				JSON.stringify(path.basename(module.resource).replace(/\.tsx?$/, ""))
			),
		}),
		new SizePlugin({}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: "**/*",
					context: "source",
					globOptions: {
						ignore: [
							"**/*.js", //
							"**/*.ts",
							"**/*.tsx",
							"**/*.css",
							"**/*.scss",
						],
					},
				},
				{
					from: "node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
				},
				{
					from: "assets",
				},
			],
		}),
	],
	optimization: {
		/** https://github.com/sindresorhus/refined-github/blob/master/webpack.config.ts */
		// Automatically enabled on production;
		// Keeps it somewhat readable for AMO reviewers
		minimizer: [
			new TerserPlugin({
				parallel: true,
				exclude: "browser-polyfill.min.js", // https://github.com/sindresorhus/refined-github/pull/3451
				terserOptions: {
					mangle: false,
					compress: {
						defaults: false,
						dead_code: true,
						unused: true,
						arguments: true,
						join_vars: false,
						booleans: false,
						expression: false,
						sequences: false,
					},
					output: {
						beautify: true,
						indent_level: 2,
					},
				},
			}),
		],
	},
};
