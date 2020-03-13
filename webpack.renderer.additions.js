const webpack = require('webpack');
const pkg = require('./package.json');
const moment = require('moment');

const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString();

module.exports = function(context) {
    context.plugins.push(
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(pkg.version),
            __DATE__: JSON.stringify(moment().format('LLLL')),
            __BUILD__: JSON.stringify(commitHash),
        })
    );
    context.externals = [
        ...Object.keys(pkg.dependencies || {})
    ];
    return context;
};