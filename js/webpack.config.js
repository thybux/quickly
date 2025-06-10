// js/webpack.config.js
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'pkg/*.wasm',
          to: '[name][ext]',
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs2',
    },
    clean: true,
  },
  target: 'node',
  externals: {
    'util': 'commonjs util',
    'path': 'commonjs path',
    'fs': 'commonjs fs'
  },
  mode: 'production',
  stats: {
    errorDetails: true,
  }
};