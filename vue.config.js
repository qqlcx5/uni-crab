/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-11-10 15:24:54
 */
// vue.config.js
const TransformPages = require('uni-read-pages')
// 读取路由文件插件
const { webpack } = new TransformPages()

module.exports = {
    transpileDependencies: ['uni-simple-router', 'luch-request', 'uni-luck-draw'],
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
    }
}
