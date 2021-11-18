/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-07-07 08:50:35
 */
import Vue from 'vue'
import Vuex from 'vuex'

// modules
import modules from './modules'
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: modules
})

export default store
