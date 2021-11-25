const path = require('path');

module.exports = {
  webpack: (config) => {
    config.entry.main = [
      './src/main.ts'
    ];

    config.resolve = {
      extensions: ['.ts', '.js', '.json'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    };

    config.module.rules.push(
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    );

    return config;
  }
};
