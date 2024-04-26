const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/server/server.js',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'server.bundle.js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            '@babel/plugin-transform-class-properties',
                            '@babel/plugin-transform-numeric-separator',
                            '@babel/plugin-transform-optional-chaining',
                            '@babel/plugin-transform-private-methods',
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/client/favicon.ico', to: 'favicon.ico' },
            ],
        }),
    ],
    stats: {
        errorDetails: true
    }
};
