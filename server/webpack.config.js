const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './lambda.js',
  target: 'node',
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    // library: 'serverlessExpressEdge',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './views', to: 'views' },
        // { from: './src/vendia-logo.png' }
        { from: './config', to: 'config'},
        { from: './model', to: 'model'},
        { from: './routes', to: 'routes'},
        { from: './validator', to: 'validator'},
        { from: './public', to: 'public'},
        { from: './vcap-local.json', to: 'vcap-local.json'}
      ]
    })
  ]
}
