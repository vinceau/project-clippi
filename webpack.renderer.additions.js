const webpack = require('webpack');
const pkg = require('./package.json');
const moment = require('moment');

const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString();

module.exports = function(context) {
    // Add web worker support
    context.module.rules.push({
        test: /\.worker\.ts$/,
        use: { loader: 'worker-loader' }
    });

    // Fix web workers not working with HMR
    context.output.globalObject = "this";

    // Add globals
    context.plugins.push(
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(pkg.version),
            __DATE__: JSON.stringify(moment().format('LLL')),
            __BUILD__: JSON.stringify(commitHash),
        })
    );

    // Fix dependencies
    context.externals = [
        ...Object.keys(pkg.dependencies || {})
    ];
    return context;
};