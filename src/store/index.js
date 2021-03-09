import Vue from 'vue'
import Vuex from 'vuex'

// modules
import modules from './modules'

Vue.use(Vuex)

console.log(modules);

const store = new Vuex.Store({
	modules: modules
})

export default store
