const path = require('path');

module.exports = {
  entry: {
    map: './js/map.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "./map"),
    filename: "js/[name].js"

  },
};
