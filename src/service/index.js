let modules  = {}
// #ifndef APP-PLUS-NVUE
let files = files = require.context('.', false, /\.js$/)

files.keys().forEach(key => {
	if (key === './index.js') return false
	Object.assign(modules, files(key).default);
})
// #endif
export default modules;
