const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: {
    map: "./js/map/map.js",
    photographer: "./js/photographer.js",
    updatePassword: "./js/updatePassword.js",
    upload: "./js/upload.js",
    reportProblem: "./js/reportProblem.js",
    settings: "./js/settings/settings.js",
    basic: "./js/basic.js",
    station: "./js/station.js",
    inbox: "./js/inbox.js",
    emailVerification: "./js/emailVerification.js",
  },
  experiments: {
    asset: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|mp3)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]',
          publicPath: "../",

        }
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "./map"),
    filename: "js/[name].js",
    library: "[name]",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[name].css",
    }),
    // new webpack.EnvironmentPlugin({
    //   API_URL: process.env.npm_package_config_api_url, TODO
    // }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};
