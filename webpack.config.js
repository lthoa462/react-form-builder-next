var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './app.js',
  devtool: 'source-map',
  output: {
    path: path.resolve('./public'),
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css', '.json'],
    alias: {
      jquery: path.join(__dirname, './jquery-stub.js'),
    },
  },
  plugins: [
    // Thêm plugin ở đây nếu cần
  ],
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$|.jsx?$/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['./node_modules'],
              },
            },
          },
        ],
      },
    ],
  },
  devServer: {
    port: 8080,
    host: 'localhost',
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    watchFiles: ['./public'], // Thay thế watchOptions
    static: {
      directory: path.resolve('./public'), // Thay thế contentBase
    },
    open: true,
    proxy: [
      {
        context: ['/api'], // Các đường dẫn cần proxy
        target: 'http://127.0.0.1:5005',
        secure: false,
        changeOrigin: true,
      },
    ],
  },
};
