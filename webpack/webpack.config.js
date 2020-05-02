const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HoneybadgerSourceMapPlugin = require('@honeybadger-io/webpack');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const log = require('npmlog');
const app = require('../package.json');

const root = path.resolve(__dirname, '..');
const outputDir = path.resolve(root, 'dist');
const dllManifestPath = path.resolve(root, 'manifest.json');
const currentEnv = dotenv.config({ path: path.resolve(root, '.env') }).parsed;
const ASSETS_LIMIT = 100000;

let plugins = [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
];

if (!fs.existsSync(dllManifestPath)) {
    throw new Error('Webpack DLL Manifest missing, please run the DLL build first');
}

module.exports = (options) => {

    log.info('webpack', `running ${options.env.NODE_ENV.toUpperCase()} build`);
    const isProduction = options.env.NODE_ENV === 'production';

    if (isProduction) {
        plugins = plugins.concat([
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.BannerPlugin([
                `    ${app.name} by ${app.author}`,
                `    Version: ${app.version}`,
                `    Date: ${new Date().toISOString()}`
            ].join('\n')),
            new HoneybadgerSourceMapPlugin({
                apiKey: currentEnv.HONEYBADGER_API_KEY,
                assetsUrl: currentEnv.HONEYBADGER_ASSETS_URL,
                revision: 'master',
                silent: false
            })
        ]);
    }
    else if (!isProduction) {
        plugins.push(
            new webpack.HotModuleReplacementPlugin()
        );

        if (currentEnv.DEBUG_BUNDLE_SIZE) {
            plugins.push(
                new BundleAnalyzerPlugin()
            );
        }
    }

    const webpackConfig = {
        mode: options.env.NODE_ENV,
        context: path.resolve(root + '/src'),
        entry: ['./index'],
        devtool: options.devtool,
        optimization: {
            minimize: isProduction
        },
        output: {
            path: outputDir,
            filename: '[name].[hash].js',
            publicPath: '/'
        },
        resolve: {
            unsafeCache: true,
            alias: {
                common: path.resolve(root, 'src/common/'),
                data: path.resolve(root, 'src/data'),
                modules: path.resolve(root, 'src/modules/'),
                utilities: path.resolve(root, 'src/utilities/')
            }
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|es6)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        cacheDirectory: './webpack_cache/'
                    },
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        !isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader?sourceMap',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                sassOptions: {
                                    outputStyle: 'expanded'
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(ttf|eot|woff|woff2)$/,
                    loader: `url-loader?limit=${ASSETS_LIMIT}&name=fonts/[hash].[ext]`
                },
                {
                    test: /\.svg/,
                    loader: 'svg-url-loader'
                },
                {
                    test: /\.(png|jpg)$/,
                    loader: `url-loader?limit=${ASSETS_LIMIT}&name=assets/[hash].[ext]`
                },
                {
                    test: /\.jsx?$/,
                    loader: 'source-map-loader'
                }
            ]
        },

        plugins: [
            new CleanWebpackPlugin(),
            new webpack.DllReferencePlugin({
                manifest: require(dllManifestPath),
            }),
            new webpack.EnvironmentPlugin(Object.keys(currentEnv)),
            ...plugins,
            new MiniCssExtractPlugin({ filename: '[name].[hash].css' }),
            new HtmlWebpackPlugin({
                description: app.description,
                filename: 'index.html',
                template: root + '/src/index-template.ejs',
            }),
            new CopyPlugin([
                { from: root + '/assets', to: root + '/dist/assets' }
            ])
        ]
    };

    if (!isProduction) {
        webpackConfig.devServer = {
            contentBase: root,
            hot: true,
            port: options.port,
            inline: true,
            progress: true,
            historyApiFallback: true,
        };

        if (options.host) {
            webpackConfig.devServer.host = options.host;
        }
    }

    return webpackConfig;
};