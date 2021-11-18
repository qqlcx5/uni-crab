/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-11-18 14:14:55
 */
export default {
    namespaced: true,
    state: {
        domain: ''
    },
    mutations: {
        SET_CUR_DOMAIN(state, { url }) {
            state.domain = url
        }
    },
    getters: {
        getCurDomain: state => {
            return state.domain
        }
    }
}
