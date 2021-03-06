const HtmlWebPackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

const CopyWebpackPlugin = require('copy-webpack-plugin')
const copyWebpackPlugin = new CopyWebpackPlugin([
    { from: 'public/**', to: './' }
  ])

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]_[local]_[hash:base64]",
              sourceMap: true,
              minimize: true
            }
          }
        ]
      },
      {
         test: /\.(png|svg|jpg|jpeg|gif)$/,
         use: [
           'file-loader'
         ]
       }
    ]
  },
  plugins: [
    htmlWebpackPlugin,
    copyWebpackPlugin
  ]
};
