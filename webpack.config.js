const file = require('fs').promises;
const path = require('path');
const { DefinePlugin, container } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const { ANALYZE, NODE_ENV } = process.env;

const production = NODE_ENV === 'production';

const makeConfig = ({ uuid, srcDirName, index }) => ({
    context: path.resolve(__dirname),
    entry: {
		config: './' + path.join('components', srcDirName, 'config.json'),
		component: './' + path.join('components', srcDirName, 'src.jsx'),
	},
    mode: NODE_ENV ?? 'development',
    devtool: production ? undefined : 'source-map',
    output: {
        path: path.join(__dirname, 'dist', srcDirName, 'latest'),
        filename: '[name].[contenthash].js',
        chunkFilename: '[id].[contenthash].js',
    },
    resolve: {
        modules: ['src', 'shared', 'node_modules'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.json'],
    },
    plugins: [
        ...(ANALYZE ? [new BundleAnalyzerPlugin()] : []),
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV ?? 'development'),
        }),
		new container.ModuleFederationPlugin({
		    name: 'component',
			shared: {
				react: { eager: true },
			},
		}),
		new WebpackManifestPlugin({
			useEntryKeys: true,
			publicPath: '',
			filter: (file) => !/\.map$/.test(file.name),
		}),
    ],
    module: {
        rules: [
            {
                test: /\.m?(j|t)sx?$/,
                exclude: [
                    /node_modules/,
                ],
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: [
					'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 4096,
                            outputPath: 'images',
                        },
                    },
                ],
            },
        ],
    },
	...(index === 0 ? {
		devServer: {
			compress: true,
			port: process.env.HOST_PORT || 8634,
			static: {
			    directory: path.join(__dirname, 'dist'),
				watch: true,
				serveIndex: true,
			},
			devMiddleware: {
				writeToDisk: true,
			},
		},
	} : {}),
});

module.exports = async () => Promise.all((await file.readdir(path.join(__dirname, 'components'), { withFileTypes: true }))
	.filter(dir => dir.isDirectory())
	.map(async (dir, index) => {
		const content = await file.readFile(path.join(__dirname, 'components', dir.name, 'config.json'));
		return makeConfig({
			...JSON.parse(content),
			srcDirName: dir.name,
			index,
		});
	}));

