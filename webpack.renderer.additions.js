const webpack = require("webpack");
const pkg = require("./package.json");
const moment = require("moment");
const Dotenv = require("dotenv-webpack");

const commitHash = require("child_process").execSync("git rev-parse --short HEAD").toString();

module.exports = function (context) {
  // Add web worker support. This needs to be processed before the other rules so use unshift.
  context.module.rules.unshift({
    test: /\.worker\.(js|ts)$/i,
    use: [
      {
        loader: "comlink-loader",
        options: {
          singleton: true,
        },
      },
    ],
  });
  context.module.rules.push(
    // Fix iconv-lite issue, webpack require issue
    // https://github.com/ashtuchkin/iconv-lite/issues/204#issuecomment-432048618
    {
      test: /node_modules[\/\\](iconv-lite)[\/\\].+/,
      resolve: {
        aliasFields: ["main"],
      },
    }
  );

  // Fix web workers not working with HMR
  context.output.globalObject = "this";

  // Expose dotenv variables
  context.plugins.push(new Dotenv());

  // Add globals
  context.plugins.push(
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(pkg.version),
      __DATE__: JSON.stringify(moment().format("LLL")),
      __BUILD__: JSON.stringify(commitHash),
    })
  );

  // Fix issues with importing unsupported fsevents module in Windows and Linux
  // For more info, see: https://github.com/vinceau/project-clippi/issues/48
  if (process.platform !== "darwin") {
    context.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^fsevents$/,
      })
    );
  }

  // Fix dependencies
  context.externals = [...Object.keys(pkg.dependencies || {})];
  return context;
};
