import allConfig from '../config'
import validateFn from './validate'
import { deepClone, isEmpty, getVariableType } from './tools'

export const validate = validateFn
export const VariableType = getVariableType

/**
 * 一维数组转多维数组
 * @parmas arr { Array } 需要转化的原数组
 * @parmas num { Number } 维度
 * @return { Array }
 */
export function setArrData(arr = [], num = 2) {
    const newArr = deepClone(arr)
    const len = Math.ceil(newArr.length / num)
    const temp = new Array(len)
    for (let i = 0; i < len; i++) {
        temp[i] = newArr.slice(i * num, (i + 1) * num)
    }
    return temp
}

export const isArrayEqual = (a, b, has = true) => {
    if (a.length !== b.length) {
        has = false
    } else {
        const s = new Set(b)
        for (let i = 0; i < a.length; i++) {
            if (!s.has(a[i])) {
                has = false
                break
            }
        }
    }
    return has
}

/**
 * 价格、库存格式化
 * @parmas num {String | Number} 需要被格式化的字段
 * @parmas type {String} 默认是金额格式化price，可选值：price | stock
 * @return {Boolean}
 */
export function numFormat(num, type = 'price') {
    const emptyArr = ['undefined', 'null']
    num = String(num)
    return num.length === 0 || emptyArr.includes(num) ? (type === 'price' ? allConfig.priceNullText : allConfig.stockNullText) : num
}

/**
 * 是否是图片
 * @parmas src {String} 地址或者icon值
 * @return {Boolean}
 */
export const isImg = (src) => {
    if (!src) return false
    // 这个针对微信或者H5
    if (src.indexOf('data:image') !== -1 || src.indexOf('wxfile') !== -1) return true
    // 远端地址都认为是图片
    if (/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g.test(src)) {
        return true
    } else {
        var imgFilter = ['jpeg', 'gif', 'jpg', 'png', 'bmp', 'pic', 'svg']
        var pos = src.lastIndexOf('.')
        if (pos++ > 0) {
            var strPostfix1 = src.substr(pos, 3).toLowerCase()
            var strPostfix2 = src.substr(pos, 4).toLowerCase()
            return imgFilter.includes(strPostfix1) ? true : imgFilter.includes(strPostfix2)
        } else {
            return false
        }
    }
}

/** *
 * 对象参数转为url参数
 * @parmas query 拼接得参数对象
 */
export const parse = (query = {}) => {
    return Object.keys(query)
        .filter(key => !isEmpty(query[key]))
        .reduce((result, key) => {
            const value = query[key]
            // in查询特殊处理
            if (Array.isArray(value) && !isEmpty(value)) {
                return `${result}&${value.reduce((val, cVal) => `${val ? `${val}&` : val}${key}=${cVal}`, '')}`
            }

            // between查询做特殊处理
            if (typeof value === 'object' && !isEmpty(value)) {
                const [start, end] = value
                return `${result}&${key}[]=${start}&${key}[]=${end}`
            }

            return `${result}&${key}=${value}`
        }, '')
        .replace(/^&/, '?')
}

/** *
 * 拆解url地址成为路由跳转参数
 */
export function getUrlQuery(page) {
    const urlArr = String(page).split('?')
    const queryObj = {}
    urlArr[1] && urlArr[1].split('&').forEach(o => {
        const item = o.split('=')
        item[1] ? queryObj[item[0]] = item[1] : ''
    })
    return {
        path: urlArr[0],
        query: queryObj
    }
}

/**
 * 防抖
 * @parmas fn 回调函数
 * @parmas time 规定时间
 */
export const debounce = (function () {
    const timer = {}
    return function (func, wait = 500) {
        const context = this // 注意 this 指向
        const args = arguments // arguments中存着e
        // 根据方法内容作为键值,保证唯一性
        const randomText = String(args[0]).replace(/[\r\n]|\s+/g, '')
        const name = 'debounce' + randomText
        if (timer[name]) clearTimeout(timer[name])
        timer[name] = setTimeout(() => {
            func.apply(context, args)
        }, wait)
    }
})()

/**
 * 节流(规定的时间才触发)
 * @parmas fn 结束完运行的回调
 * @parmas delay 规定时间
 */
export const throttle = (function () {
    let timeout = null
    return function (func, wait) {
        const context = this
        const args = arguments
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null
                func.apply(context, args)
            }, wait)
        }
    }
})()

/** *
 * 复制到粘贴板
 * @parmas str 拷贝的字符
 * @parmas success 成功回调
 * @parmas error 失败回调
 */
export function copyText({ content, success = (title) => {
    uni.showToast({ title, icon: 'none', duration: 2000 })
}, error = () => { } }) {
    if (!content) return error('复制的内容不能为空 !')
    content = typeof content === 'string' ? content : content.toString() // 复制内容，必须字符串，数字需要转换为字符串
    /**
     * 小程序端 和 app端的复制逻辑
     */
    // #ifndef H5
    uni.setClipboardData({
        data: content,
        success: function () {
            success('复制成功~')
            // this.$toast('复制成功~')
        },
        fail: function () {
            error('复制失败~')
            // this.$toast('复制失败~')
        }
    })
    // #endif

    /**
     * H5端的复制逻辑
     */
    // #ifdef H5
    if (!document.queryCommandSupported('copy')) { // 为了兼容有些浏览器 queryCommandSupported 的判断
        // 不支持
        error('浏览器不支持')
    }
    const textarea = document.createElement('textarea')
    textarea.value = content
    textarea.readOnly = 'readOnly'
    document.body.appendChild(textarea)
    textarea.select() // 选择对象
    textarea.setSelectionRange(0, content.length) // 核心
    const result = document.execCommand('copy') // 执行浏览器复制命令
    if (result) {
        success('复制成功~')
    } else {
        error('复制失败，请检查h5中调用该方法的方式，是不是用户点击的方式调用的，如果不是请改为用户点击的方式触发该方法，因为h5中安全性，不能js直接调用！')
    }
    textarea.remove()
    // #endif
}

// 判断对象是否相等
export const diffByObj = (obj1, obj2) => {
    var o1 = obj1 instanceof Object
    var o2 = obj2 instanceof Object
    // 判断是不是对象
    if (!o1 || !o2) {
        return obj1 === obj2
    }

    // Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,
    // 例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false
    }
    var isDif = true
    for (var o in obj1) {
        var t1 = obj1[o] instanceof Object
        var t2 = obj2[o] instanceof Object
        if (t1 && t2) {
            isDif = diffByObj(obj1[o], obj2[o])
        } else if (obj1[o] !== obj2[o]) {
            isDif = false
            break
        }
        if (!isDif) break
    }
    return isDif
}

/**
 * 获取节点的相关信息。
 * @parmas selecter 元素的class或者id
 * @parmas fields，默认size
 * id	Boolean	false	否	是否返回节点 id
 * dataset	Boolean	false	否	是否返回节点 dataset	App、微信小程序、H5
 * rect	Boolean	false	否	是否返回节点布局位置（left right top bottom）
 * size	Boolean	false	否	是否返回节点尺寸（width height）
 * scrollOffset	Boolean	false	否	是否返回节点的 scrollLeft scrollTop，节点必须是 scroll-view 或者 viewport
 * properties	Array＜string＞	[]	否	指定属性名列表，返回节点对应属性名的当前属性值（只能获得组件文档中标注的常规属性值，id class style 和事件绑定的属性值不可获取）	仅 App 和微信小程序支持
 * computedStyle	Array＜string＞	[]	否	指定样式名列表，返回节点对应样式名的当前值	仅 App 和微信小程序支持
 * context	Boolean	false	否	是否返回节点对应的 Context 对象	仅 App 和微信小程序支持
 */

export function getRect(selecter, pro = {}) {
    const isSelectAll = selecter.lastIndexOf(',') !== -1 || selecter.lastIndexOf('.') !== -1
    return new Promise((res, rej) => {
        // #ifdef APP-PLUS-NVUE
        rej({ mag: '当前环境不支持' })
        // #endif
        // #ifndef APP-PLUS-NVUE
        if (!this) {
            return rej({
                code: -1,
                msg: '请用『方法名』.call(this)来调用'
            })
        }
        this.$nextTick && this.$nextTick(() => {
            // 兼容问题
            setTimeout(() => {
                // #ifdef H5
                if (!this.$el) return rej({ mag: '节点获取失败' })// 不存在节点信息就中断
                // #endif
                try {
                    uni.createSelectorQuery()
                        // #ifndef MP-ALIPAY
                        .in(this)
                    // #endif
                    // eslint-disable-next-line no-unexpected-multiline
                    [isSelectAll ? 'selectAll' : 'select'](selecter).fields({
                        size: true,
                        rect: true,
                        ...pro
                    }, (data) => {
                        res(Array.isArray(data) ? (data.length > 1 ? data : data[0]) : data)
                    }).exec()
                } catch (error) {
                    rej({ mag: '节点获取失败' })
                }
            }, 100)
        })
        // #endif
    })
}

// 获取父组件的参数，因为支付宝小程序不支持provide/inject的写法
// this.$parent在非H5中，可以准确获取到父组件，但是在H5中，需要多次this.$parent.$parent.xxx
// 这里默认值等于undefined有它的含义，因为最顶层元素(组件)的$parent就是undefined，意味着不传name
// 值(默认为undefined)，就是查找最顶层的$parent
export function getParent(name = undefined) {
    let parent = this.$parent
    // 通过while历遍，这里主要是为了H5需要多层解析的问题
    while (parent) {
        // 父组件
        if (parent.$options && parent.$options.name !== name) {
            // 如果组件的name不相等，继续上一级寻找
            parent = parent.$parent
        } else {
            return parent
        }
    }
    return false
}

// 生成随机uid
export function guid(len = 32, firstU = true, radix = null) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const uuid = []
    radix = radix || chars.length

    if (len) {
        // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
        for (let i = 0; i < len; i++) { uuid[i] = chars[0 | (Math.random() * radix)] }
    } else {
        let r
        // rfc4122标准要求返回的uuid中,某些位为固定的字符
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16)
                uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
            }
        }
    }
    // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
    if (firstU) {
        uuid.shift()
        return 'u' + uuid.join('')
    } else {
        return uuid.join('')
    }
}

export function addUnit(value = 'auto', unit = 'rpx') {
    function number(value) {
        return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
    }
    value = String(value)
    // 用uView内置验证规则中的number判断是否为数值
    return number(value) ? `${value}${unit}` : value
}

/**
 * 四则运算（加减乘除）
 * add 加
 * sub 减
 * mul 乘
 * div 除
 * */
export const calcFn = {
    add() {
        const arg = Array.from(arguments)
        return arg.reduce((total, num) => {
            return accAdd(total, num)
        })
    },
    sub() {
        const arg = Array.from(arguments)
        return arg.reduce((total, num) => {
            return accAdd(total, -num)
        })
    },
    mul() {
        const arg = Array.from(arguments)
        return arg.reduce((total, num) => {
            return accMul(total, num)
        })
    },
    divide() {
        const arg = Array.from(arguments)
        return arg.reduce((total, num) => {
            return accDiv(total, num)
        })
    }
}

// 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
// 调用：accAdd(arg1,arg2)
// 返回值：arg1加上arg2的精确结果
function accAdd(arg1, arg2) {
    const argInfo1 = dotedAfterInfo(arg1)
    const argInfo2 = dotedAfterInfo(arg2)
    const m = Math.pow(10, Math.max(argInfo1.length, argInfo2.length))
    return (arg1 * m + arg2 * m) / m
}

// 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
// 调用：accMul(arg1,arg2)
// 返回值：arg1乘以arg2的精确结果
function accMul(arg1, arg2) {
    const argInfo1 = dotedAfterInfo(arg1)
    const argInfo2 = dotedAfterInfo(arg2)
    var m = argInfo1.length + argInfo2.length
    return argInfo1.number * argInfo2.number / Math.pow(10, m)
}

// 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
// 调用：accDiv(arg1,arg2)
// 返回值：arg1除以arg2的精确结果
function accDiv(arg1, arg2) {
    const argInfo1 = dotedAfterInfo(arg1)
    const argInfo2 = dotedAfterInfo(arg2)
    return accMul((argInfo1.number / argInfo2.number), Math.pow(10, argInfo2.length - argInfo1.length))
}

function dotedAfterInfo(arg) {
    const s1 = arg.toString()
    const argArr = s1.split('.')
    return {
        str: s1,
        length: (argArr[1] || []).length,
        number: Number(s1.replace('.', ''))
    }
}

export function formatUnit(val, unit = 'rpx', deault = 0) {
    return !val ? deault : validateFn('number', val) ? (val + unit) : val
}
