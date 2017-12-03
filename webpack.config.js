const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var distDir =  __dirname + "/dest";

var staticFile = ['manifest.json' , 'icon.png', 'folder.png'];
var fs = require('fs');
var path = require('path');

if(!fs.existsSync(distDir)){
    fs.mkdirSync(distDir);
}
staticFile.forEach(fileName=>{
    var sourceFile = path.join(__dirname, fileName);
    var destPath = path.join(distDir, fileName);
    copy(sourceFile, destPath);
});

function copy(src, dst) {
    fs.writeFileSync(dst, fs.readFileSync(src));
}

module.exports = {
    entry: __dirname + "/bookmark.js",
    devtool: 'source-map',
    output: {
        path: distDir,
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