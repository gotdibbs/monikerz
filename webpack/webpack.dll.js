const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const app = require('../package.json');

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const OPTIMIZE = process.env.OPTIMIZE ? JSON.parse(process.env.OPTIMIZE) : NODE_ENV === 'production';

const root = path.resolve(__dirname, '..');
const ouputDir = path.resolve(root, 'webpack_dll');

module.exports = {
    mode: NODE_ENV,
    devtool: OPTIMIZE ? false : 'source-map',
    optimization: {
        minimize: OPTIMIZE,
    },
    output: {
        path: ouputDir,
        filename: '[name].js',
        library: '[name]'
    },
    entry: {
        lib: Object.keys(app.dependencies)
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'source-map-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DllPlugin({
            path: path.join(root, 'manifest.json'),
            name: '[name]'
        })
    ]
};