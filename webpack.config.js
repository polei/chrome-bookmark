const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: __dirname + "/bookmark.js",
    devtool: 'source-map',
    output: {
        path: __dirname + "/dest",
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "es2015", 
                        ]
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader"
                    },
                ]
            },
            
            { test: /(manifest\.json|icon\.png)/, loader: "file" }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + "/bookmark.html"//new 一个这个插件的实例，并传入相关的参数
        })
    ],
};