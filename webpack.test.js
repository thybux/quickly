const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/test.ts',
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
        { from: 'pkg/*.wasm', to: '[name][ext]' },
      ],
    }),
  ],
  output: {
    filename: 'test.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'node',
  mode: 'development',
};
