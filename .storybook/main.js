const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const root = path.resolve(__dirname, '..');

module.exports = {
    stories: ['../src/**/*.sb.[tj]s'],
    addons: ['@storybook/addon-knobs/register'],
    webpackFinal: async (config, { configType }) => {
        // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
        // You can change the configuration based on that.
        // 'PRODUCTION' is used when building the static version of storybook.

        // Make whatever fine-grained changes you need
        config.module.rules.push({
            test: /\.(sa|sc|c)ss$/,
            use: [
                'style-loader',
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
        });

        config.resolve = {
            ...(config.resolve || {}),
            alias: {
                common: path.resolve(root, 'src/common/'),
                data: path.resolve(root, 'src/data'),
                modules: path.resolve(root, 'src/modules/'),
                utilities: path.resolve(root, 'src/utilities/')
            }
        };
    
        // Return the altered config
        return config;
    }
};