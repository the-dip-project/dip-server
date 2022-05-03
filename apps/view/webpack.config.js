/* eslint-disable */

const CopyPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { join, resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const tsConfig = require('./tsconfig.app.json');
const dependencies = require('../../package.json').dependencies;

const __root = resolve(__dirname, '..', '..');
const isDev = process.argv.includes('--dev');
const outDir = resolve(__dirname, tsConfig.compilerOptions.outDir);
const commonLibDir = resolve(__root, 'libs', 'common', 'src');

function getDep(name) {
  return dependencies[name].replace('^', '').trim();
}

const prodDependencies = [];

const html = new HtmlWebpackPlugin({
  filename: 'index.html',
  template: join(__dirname, 'index.ejs'),
  inject: true,
  minify: !isDev,
  templateParameters: {
    dependencies: isDev ? [] : prodDependencies,
  },
});

const config = {
  entry: join(__dirname, 'src', 'index.tsx'),
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    modules: [
      join(__dirname, 'src'),
      commonLibDir,
      join(__root, 'node_modules'),
    ],
    alias: {
      '@/view': resolve(__dirname, 'src'),
      '@/common': commonLibDir,
    },
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  context: __dirname,
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'source-map' : false,
  output: {
    path: outDir,
    publicPath: '/',
    filename: 'main.js',
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic',
                },
              ],
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-transform-typescript',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-nullish-coalescing-operator',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-transform-async-to-generator',
              [
                '@babel/plugin-transform-react-jsx',
                {
                  runtime: 'automatic',
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(png|jpg|gif|webp|woff|woff2)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(svg)$/,
        use: ['svg-inline-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  externalsType: 'script',
  externals: isDev
    ? {}
    : Object.fromEntries(
      prodDependencies.map((dep) => [dep[0], 'root ' + dep[1]]),
    ),
  optimization: {
    minimize: !isDev,
    minimizer: [
      new TerserWebpackPlugin({
        test: /\.js(\?.*)?$/,
        parallel: 1,
        terserOptions: {
          compress: true,
          sourceMap: false,
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
  plugins: [
    html,
    new CopyPlugin({
      patterns: [
        {
          from: join(__dirname, 'public'),
          to: join(outDir, 'public'),
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
};

const devServer = {
  compress: false,
  hot: true,
  static: false,
  open: false,
  devMiddleware: {
    writeToDisk: true,
  },
};

if (isDev) {
  const portfinder = require('portfinder');
  const DevServer = require('webpack-dev-server');
  const compiler = require('webpack')(config);

  portfinder.getPort((err, port) => {
    if (err) throw err;

    const server = new DevServer({ ...devServer, port }, compiler);

    server.start();
  });
}

module.exports = config;
