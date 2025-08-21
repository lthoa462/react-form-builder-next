// webpack.production.config.js
var path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/lib-entry.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
    library: 'ReactFormBuilder',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
    clean: true,
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.scss', '.css', '.json'],
    alias: {
      jquery: path.join(__dirname, './jquery-stub.js'),
    },
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$|.jsx?$/,
        use: [
          { loader: 'babel-loader' }
        ]
      },
      {
        test: /\.(css|scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: { sassOptions: { includePaths: ['./node_modules'] } },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: { filename: 'fonts/[name][ext][query]' },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: { filename: 'assets/[name][ext][query]' },
      },
    ],
  },

  optimization: {
    splitChunks: false,
    runtimeChunk: false,
  },

  devtool: 'source-map',
  performance: { hints: false },
}
