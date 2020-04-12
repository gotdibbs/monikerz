module.exports = env => require('./webpack.config.js')({
    env,
    devtool: 'source-map',
    jsFileName: 'app.[hash].js',
    cssFileName: 'app.[hash].css'
});