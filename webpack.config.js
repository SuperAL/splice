var path = require('path')
var webpack = require('webpack')

module.exports = {
    target: 'electron-renderer',
    entry: {
        app: './js/modules.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    resolve: {
        alias: {
            'handlebars': 'handlebars/dist/handlebars.js'
        }
    },
    module: {
        rules: [{
                test: /\.js$/,
                include: /node_modules/,
                loader: 'shebang-loader'
            },
            {
                test: /\.node$/,
                include: /node_modules/,
                loader: 'node-loader'
            }
        ]
    }
}