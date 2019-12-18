const pkg = require('./package.json');

module.exports = {
    externals: [
        ...Object.keys(pkg.dependencies || {}),
    ]
}

