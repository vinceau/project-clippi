const merge = require('webpack-merge');

const baseConfig = require('./webpack.background.config');

module.exports = merge.smart(baseConfig, {
    mode: 'production'
});
