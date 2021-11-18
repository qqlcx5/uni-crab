let modules = {}
let files = Object
// #ifndef APP-PLUS-NVUE
files = require.context('.', false, /\.js$/)
import { basename } from 'path'
files.keys().forEach(key => {
    if (key === './index.js') return false

    const name = basename(key, '.js')
    modules[name] = files(key).default
})
// #endif
// #ifdef APP-PLUS-NVUE
import cart from './cart.js'
import common from './common.js'
import config from './config.js'
import goods from './goods.js'
import page from './page.js'
import user from './user.js'
modules = {
    cart, common, config, goods, page, user
}
// #endif
export default modules
