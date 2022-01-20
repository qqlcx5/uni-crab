/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2022-01-18 11:54:59
 */
export default {
    /**
    * 是否显示modal框
    */
    value: {
        type: Boolean,
        default: true
    },
    // 自定义当前时间，默认为今天
    date: {
        type: String,
        default: ''
    },
    selected: {
        type: Array,
        default: () => []
    },
    // 原点颜色
    circleColor: {
        type: String,
        default: '#cc1438'
    },
    // 显示农历
    lunar: {
        type: Boolean,
        default: false
    },
    // 日期选择范围-开始日期
    startDate: {
        type: String,
        default: ''
    },
    // 日期选择范围-结束日期
    endDate: {
        type: String,
        default: ''
    },
    // 范围选择
    range: {
        type: Boolean,
        default: false
    },
    // 是否是弹窗模式。可选值：ture：弹窗模式；false：插入模式；默认为插入模式
    popup: {
        type: Boolean,
        default: true
    },
    // 是否显示月份为背景
    showMonth: {
        type: Boolean,
        default: true
    },
    // 弹窗模式是否清空上次选择内容
    clearDate: {
        type: Boolean,
        default: true
    },
    mode: {
        type: String,
        default: 'bottom'
    },
    title: {
        type: String,
        default: '日期选择'
    },
    // 显示返回今天
    backtoday: {
        type: Boolean,
        default: false
    },
    // 限制确定按钮,弹窗模式下有效
    showConfirm: {
        type: Boolean,
        default: true
    },
    // 确定按钮文字
    confirmText: {
        type: String,
        default: '确定'
    },
    confirmColor: {
        type: String,
        default: 'rgb(60, 156, 255)'
    },
    // 是否要收起功能，仅在popup为false时该属性生效
    showExpand: {
        type: Boolean,
        default: true
    }
}
