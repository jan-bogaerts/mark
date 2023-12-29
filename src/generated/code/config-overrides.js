const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function override(config, env) {
  config.target = 'electron-renderer';
  config.plugins.push(new MonacoWebpackPlugin({
    languages: ['json', 'markdown', 'javascript', 'typescript', 'css', 'html', 'python']
  }));
  return config;
}