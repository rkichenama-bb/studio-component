const file = require('fs').promises;
const path = require('path');
const { DefinePlugin, container } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyPlugin = require("copy-webpack-plugin");

const { ANALYZE, NODE_ENV } = process.env;

const production = NODE_ENV === 'production';

const makeConfig = ({ uuid, editorIcon, srcDirName, index }) => ({
    name: srcDirName,
    context: path.resolve(__dirname, 'components', srcDirName),
    entry: {
        [`component${uuid.replace(/\-/g, '_')}`]: '../../setup-public-path',
        component: './index.js',
    },
    mode: NODE_ENV ?? 'development',
    devtool: production ? false : 'source-map',
    output: {
        path: path.join(__dirname, 'dist', srcDirName),
        filename: '[name].[contenthash].js',
        chunkFilename: '[id].[contenthash].js',
        clean: true,
        publicPath: 'auto',
        uniqueName: `./component_${uuid.replace(/\-/g, '_')}`,
    },
    externals: {
        'bbstudio/hooks': ['bbstudio', 'hooks'],
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
            name: `component${uuid.replace(/\-/g, '_')}`,
            filename: 'component.js',
            exposes: {
                './component': './index.js',
            },
            shared: {
                react: {
                    requiredVersion: '>=17.0.0 <19.0.0',
                    eager: false,
                    singleton: true,
                    strictVersion: true,
                },
            },
        }),
        new CopyPlugin({
            patterns: [
                './config.json',
            ].concat(editorIcon ?? []),
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
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentHashSalt: uuid
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[path][name].[ext]',
                            limit: 4096,
                        },
                    },
                ],
            }
        ],
    },
    externals: {
        'bbstudio/hooks': ['bbstudio', 'hooks'],
    },
    devServer: {
        compress: true,
        port: process.env.HOST_PORT || 8634,
        allowedHosts: 'auto',
        devMiddleware: {
            publicPath: `/assets/components/${uuid}/latest/`,
        },
    },
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

