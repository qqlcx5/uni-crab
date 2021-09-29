/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-09-29 10:23:02
 */
//vue.config.js
const defaultConfig = require('./common/vueconfig.js')

const path = require('path');//引入path模块
function resolve(dir) {
    return path.join(__dirname, dir)//path.join(__dirname)设置绝对路径
}

module.exports = {
    ...defaultConfig,
    chainWebpack: (config) => {
        config.resolve.alias.set('@common', resolve('./common'))
    }
}