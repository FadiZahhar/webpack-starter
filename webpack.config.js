const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

  const glob = require('glob');
  
  // Function to generate an array of HtmlWebpackPlugin instances
  function generateHtmlPlugins(templateDir) {
    const templateFiles = glob.sync(path.resolve(__dirname, templateDir, '**/*.html'));
    return templateFiles.map(item => {
      const parts = item.split('/');
      const name = parts[parts.length - 1];
      const filename = name;
      return new HtmlWebpackPlugin({
        title: 'Webpack App',
        filename: filename,
        template: path.resolve(__dirname, templateDir, name),
        minify: false
      });
    });
  }
  
  const htmlPlugins = generateHtmlPlugins('./src');

module.exports = {
  mode: 'development',
  entry: {
    bundle: path.resolve(__dirname, 'src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name][contenthash].js',
    clean: true,
    assetModuleFilename: 'assets/[name][ext]',
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // instead of 'style-loader'
          'style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|mp3|mp4)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/main.css', // Output file
    }),
   ...htmlPlugins
    //new BundleAnalyzerPlugin(),
  ],
}
