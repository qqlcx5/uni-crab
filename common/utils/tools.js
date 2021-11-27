/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-08-03 10:44:50
 */
/**
 *@description 判断数据类型
 * @param {*} anything 任意数据类型 any
 * @return {string} 返回数据类型有Array,Number,Object,Boolean,String,Undefined,Function,Null
 */
export function getVariableType(anything) {
    return Object.prototype.toString.call(anything).slice(8, -1)
}

// 深拷贝
export const deepClone = (obj) => {
    // 申明一个容器 用于存放科隆的数据
    let warp
    // 读取类型
    const objType = getVariableType(obj)
    // 判断读到的类型 并且以符合的存放格式存放数据
    if (objType === 'Object') {
        warp = {}
    } else if (objType === 'Array') {
        warp = []
    } else {
        return obj
    }
    //  循环数据内容
    for (var x in obj) {
        //  得到的数据内容
        const value = obj[x]
        // 判断 已经得到的内容里是否还有Object，Array
        //  因为 数据中可能出现 [1,2,[4,5,4,],47,97] 这种情况
        const valueType = getVariableType(value)
        if (valueType === 'Object' || valueType === 'Array') {
            // 当出现上述情况是 使用递归函数进行再次运行
            warp[x] = deepClone(value)
        } else {
            // 如果没有出现上诉情况 直接克隆
            warp[x] = obj[x]
        }
    }
    return warp
}

/** *
 * 是否为空
 * @parmas any - val 传进来的值
 */
export const isEmpty = (val) => {
    if (val instanceof Array) {
        if (val.length === 0) return true
    } else if (val instanceof Object) {
        if (!Object.keys(val).length) return true
    } else {
        if (val === 'null' || val === null || val === 'undefined' || val === undefined || val === '') return true
        return false
    }
    return false
}

export const isArrayEqual = (a, b, has = true) => {
    if (a.length !== b.length) return false
    const s = new Set(b)
    for (let i = 0; i < a.length; i++) {
        if (!s.has(a[i])) has = false
    }
    return has
}
