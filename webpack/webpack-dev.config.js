module.exports = env => require('./webpack.config.js')({
    env,
    devtool: 'cheap-module-eval-source-map',
    host: '0.0.0.0',
    port: 3000,
});