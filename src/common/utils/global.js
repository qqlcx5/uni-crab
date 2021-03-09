import sendHttp from '@/common/service'
import config from '@/common/config'
import * as utilFn from '@/common/utils'
import filters from '@/common/filters'
import commonFn from '@/common/utils/common'
import colorGradient from '@/common/utils/colorGradient'
import globalMixins from '@/common/mixins/globalMixins'

const globalFun = {
	install(Vue) {
		// 批量挂载在this上
		Vue.prototype.$http = sendHttp;
		Vue.prototype.$config = config;
		Vue.prototype.$c = {
			...utilFn,
			...colorGradient
		}

		// 批量通用方法
		Object.keys(commonFn).forEach(cKey => {
			Vue.prototype[cKey] = commonFn[cKey];
		})

		// 批量注入filter
		Object.keys(filters).forEach(fKey => {
			Vue.filter(fKey, filters[fKey]);
		})

        // 注入全局mixin
        Vue.mixin(globalMixins);
	}
}

export default globalFun
