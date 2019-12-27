const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');

/*
module.exports = {
    entry: {
        background: './src/background/index.ts'
    },
    externals: [
        ...Object.keys(pkg.dependencies || {}),
    ],
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['background'],
            title: "Electron Background Worker",
            filename: "background.html"
        })
    ]
}


context.plugins.forEach((plugin) => {
    // Ensure other renderers' scripts and styles aren't added to the main renderer
    if (plugin.constructor.name === "HtmlWebpackPlugin") {
        plugin.options.chunks = ['renderer'];
    }
});
*/

module.exports = function(context) {
    // Add entrypoint for second renderer
    context.entry.background = ['./src/background/index.ts'];

    context.plugins.forEach((plugin) => {
        // Ensure other renderers' scripts and styles aren't added to the main renderer
        if (plugin.constructor.name === "HtmlWebpackPlugin") {
            plugin.options.chunks = ['renderer'];
        }
    });
    context.plugins.push(
        new HtmlWebpackPlugin({
            chunks: ['background'],
            title: "Electron Background Worker",
            filename: "background.html"
        })
    );
    context.externals = [
        ...Object.keys(pkg.dependencies || {})
    ];

    return context;
};