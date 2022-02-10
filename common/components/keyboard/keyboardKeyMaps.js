/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-28 17:23:56
 */
export const deleteKey = getKeyItem('zsuicon-delete', 'icon', 'delete')
export const resetKey = getKeyItem('清空', 'text', 'reset')
export const confirmKey = getKeyItem('zsuicon-enter', 'icon', 'confirm')
const natural = '1234567890'
const letter = 'QWERTYUIOPASDFGHJKLZXCVBNM'
const province = '京沪津渝鲁冀鄂黑苏浙皖闽赣豫粤桂琼晋蒙辽吉云藏陕甘青宁湘川贵新港澳台使学'
// 获取键帽
export function formatKeys(str) {
    if (!str) return
    const symbolArr = ['.']
    return str.split('').map(o => {
        return getKeyItem(o, symbolArr.includes(o) ? 'symbol' : 'text')
    })
}
// 组装每个键值的信息
export function getKeyItem(value = '', type = 'text', operation = 'change') {
    return {
        type,
        value,
        operation
    }
}
// 自然数键帽
export const naturalKey = formatKeys(natural)
// 英文字母键帽（键盘顺序）
export const letterKey = formatKeys(letter)
// 数字键盘键帽
export const numberKeys = formatKeys(natural.slice(0, 9) + '.' + natural.slice(9))
// 身份证键帽
export const idcardKeys = formatKeys(natural.slice(0, 9) + 'X' + natural.slice(9))
// 省份键帽
export const provinceKeys = formatKeys(province)

const keyboardKeyMap = new Map([
    ['number', {
        middle: [...numberKeys],
        right: [deleteKey, resetKey, confirmKey]
    }],
    ['idcard', {
        middle: [...idcardKeys],
        right: [deleteKey, resetKey, confirmKey]
    }],
    ['car', {
        middle: {
            '中': [...provinceKeys],
            '英': [...naturalKey, ...letterKey]
        },
        right: [deleteKey, resetKey, confirmKey]
    }]
])

export default keyboardKeyMap
