/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-09-29 10:23:02
 */
// vue.config.js
const TransformPages = require('uni-read-pages')

const path = require('path')// 引入path模块
function resolve(dir) {
    return path.join(__dirname, dir)// path.join(__dirname)设置绝对路径
}

// 读取路由文件插件
const { webpack } = new TransformPages()

module.exports = {
    transpileDependencies: ['uni-simple-router', 'luch-request'],
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                ROUTES: webpack.DefinePlugin.runtimeValue(() => {
                    const tfPages = new TransformPages({
                        includes: ['path', 'name', 'meta', 'aliasPath']
                    })
                    return JSON.stringify(tfPages.routes)
                }, true)
            })
        ]
    },
    chainWebpack: (config) => {
        config.resolve.alias.set('@common', resolve('/common'))
    }
}
