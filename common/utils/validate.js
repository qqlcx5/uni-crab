/** *
 *      ┌─┐       ┌─┐ + +
 *   ┌──┘ ┴───────┘ ┴──┐++
 *   │                 │
 *   │       ───       │++ + + +
 *   ███████───███████ │+
 *   │                 │+
 *   │       ─┴─       │
 *   │                 │
 *   └───┐         ┌───┘
 *       │         │
 *       │         │   + +
 *       │         │
 *       │         └──────────────┐
 *       │                        │
 *       │                        ├─┐
 *       │                        ┌─┘
 *       │                        │
 *       └─┐  ┐  ┌───────┬──┐  ┌──┘  + + + +
 *         │ ─┤ ─┤       │ ─┤ ─┤
 *         └──┴──┘       └──┴──┘  + + + +
 *                神兽保佑
 *               代码无BUG!
 */

/* 常见正则
 * 登录密码--由数字和字母组成，并且要同时含有数字和字母，且长度要在8-16位之间。
 * 邮箱
 * 手机号
 * 是否固定电话
 * 是否短信验证码
 * 面积
 * 姓名
 * 账号名
 * 验证身份证号码
 */
// 使用教程
// import { validateReg } from "@/common/utils/validate.js";
// if(!validateReg('password',value)){...}

export default function validateReg(type, str, hasMsg = false) {
    let reg = ''; let validate = false
    if (type === 'idCard') {
        validate = checkIdCard(str)
    } else {
        switch (type) {
            case 'password':
                reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
                break
            case 'email':
                reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                break
            case 'mobile':
                reg = /^1[3456789]\d{9}$/
                break
            case 'landline':
                reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/
                break
            case 'verify':
                reg = /^\d{6}$/
                break
            case 'verify4':
                reg = /^\d{4}$/
                break
            case 'number':
                reg = /^[0-9]*$/
                break
            case 'area':
                reg = /^[0-9]{2,4}$/
                break
            case 'bank':
                str = str ? str.replace(/\s+/g, '') : ''
                reg = /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/
                break
            case 'name':
                reg = /^[\u4e00-\u9fa50-9A-Za-z]{2,20}$/
                break
            case 'userName':
                reg = /^[A-Za-z0-9_]{4,10}$/
                break
            case 'enNumber': // 英文数字
                reg = /^[0-9a-zA-Z]+$/
                break
            default:
                reg = ''
                break
        }
        validate = !reg ? (!!str) : reg.test(str)
    }
    return hasMsg ? {
        validate: validate,
        message: !validate ? (str ? '格式错误' : '不能为空') : '校验正确'
    } : validate
}

function checkIdCard(idCard) {
    // 15位和18位身份证号码的正则表达式
    var regIdCard =
        /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
    // 如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regIdCard.test(idCard)) {
        if (idCard.length == 18) {
            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2) // 将前17位加权因子保存在数组里
            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2) // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
            var idCardWiSum = 0 // 用来保存前17位各自乖以加权因子后的总和
            for (var i = 0; i < 17; i++) {
                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i]
            }
            var idCardMod = idCardWiSum % 11 // 计算出校验码所在数组的位置
            var idCardLast = idCard.substring(17) // 得到最后一位身份证号码
            // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if (idCardMod == 2) {
                if (idCardLast == 'X' || idCardLast == 'x') {
                    return true
                } else {
                    return false
                }
            } else {
                // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                if (idCardLast == idCardY[idCardMod]) {
                    return true
                } else {
                    return false
                }
            }
        }
        return true
    } else {
        return false
    }
}
