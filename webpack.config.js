const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  context: __dirname,
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "presentation-form.js",
    publicPath: "/dist/",
    library: "presentation-form",
    globalObject: "this",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  externals: {
    "next-core-utilities": {
      commonjs: "next-core-utilities",
      commonjs2: "next-core-utilities",
      amd: "next-core-utilities",
      root: "next-core-utilities"
    },
    "presentation-models": {
      commonjs: "presentation-models",
      commonjs2: "presentation-models",
      amd: "presentation-models",
      root: "presentation-models"
    },
    "presentation-decorator": {
      commonjs: "presentation-decorator",
      commonjs2: "presentation-decorator",
      amd: "presentation-decorator",
      root: "presentation-decorator"
    },
    "presentation-request": {
      commonjs: "presentation-request",
      commonjs2: "presentation-request",
      amd: "presentation-request",
      root: "presentation-request"
    },
    "presentation-widget": {
      commonjs: "presentation-widget",
      commonjs2: "presentation-widget",
      amd: "presentation-widget",
      root: "presentation-widget"
    },
    "presentation-dom": {
      commonjs: "presentation-dom",
      commonjs2: "presentation-dom",
      amd: "presentation-dom",
      root: "presentation-dom"
    }
  },
  stats: "errors-only",
  devtool: "source-map",
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require("./package.json").version)
    })
  ]
};
