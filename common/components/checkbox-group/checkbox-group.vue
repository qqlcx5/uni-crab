<template>
    <view class="c-checkbox-group c-clearfix">
        <slot></slot>
    </view>
</template>

<script>
import Emitter from '../../utils/emitter.js'
/**
 * checkboxGroup 开关选择器父组件Group
 * @description 复选框组件一般用于需要多个选择的场景，该组件功能完整，使用方便
 * @tutorial https://www.uviewui.com/components/checkbox.html
 * @property {String Number} max 最多能选中多少个checkbox（默认999）
 * @property {String Number} size 组件整体的大小，单位rpx（默认40）
 * @property {Boolean} disabled 是否禁用所有checkbox（默认false）
 * @property {String Number} zsuicon-size 图标大小，单位rpx（默认20）
 * @property {Boolean} label-disabled 是否禁止点击文本操作checkbox(默认false)
 * @property {String} width 宽度，需带单位
 * @property {String} width 宽度，需带单位
 * @property {String} shape 外观形状，shape-方形，circle-圆形(默认circle)
 * @property {Boolean} wrap 是否每个checkbox都换行（默认false）
 * @property {String} active-color 选中时的颜色，应用到所有子Checkbox组件（默认#2979ff）
 * @event {Function} change 任一个checkbox状态发生变化时触发，回调为一个对象
 * @example <c-checkbox-group></c-checkbox-group>
 */
export default {
    name: 'CCheckboxGroup',
    mixins: [Emitter],
    props: {
        pattern: {
            type: String,
            default: ''
        },
        msgName: {
            type: String,
            default: 'square'
        },
        // 模拟radio 默认多选
        isMultiple: {
            type: [Boolean, String],
            default: true
        },
        // 最多能选中多少个checkbox
        max: {
            type: [Number, String],
            default: 999
        },
        // 所有选中项的 name
        value: {
            type: Array,
            default() {
                return []
            }
        },
        // 是否禁用所有复选框
        disabled: {
            type: Boolean,
            default: false
        },
        // 在表单内提交时的标识符
        name: {
            type: [Boolean, String],
            default: ''
        },
        // 是否禁止点击提示语选中复选框
        labelDisabled: {
            type: Boolean,
            default: false
        },
        // 形状，square为方形，circle为原型
        shape: {
            type: String,
            default: 'square'
        },
        // 选中状态下的颜色
        activeColor: {
            type: String,
            default: ''
        },
        // 组件的整体大小
        size: {
            type: [String, Number],
            default: 34
        },
        // 每个checkbox占c-checkbox-group的宽度
        width: {
            type: String,
            default: 'auto'
        },
        // 是否每个checkbox都换行
        wrap: {
            type: Boolean,
            default: false
        },
        // 图标的大小，单位rpx
        iconSize: {
            type: [String, Number],
            default: 42
        }
    },
    data() {
        return {
            checkBoxName: ''
        }
    },
    created() {
        this.checkBoxName = this.name ? this.name : ('crabCheckBox' + Math.random().toString(32).substr(2))
        // 如果将children定义在data中，在微信小程序会造成循环引用而报错
        this.children = []
        this.parent = this.$c.getParent.call(this, 'CForm')
        this.parent && this.parent.children.push(this)
    },
    methods: {
        validate(hasMsg = true) {
            const isNotNull = this.value.length
            const validatenotNull = this.pattern === 'notNull' && !isNotNull
            if (hasMsg && validatenotNull) {
                this.$toast(`${this.msgName}不能为空`)
                return {
                    validate: false,
                    message: `${this.msgName}不能为空`
                }
            }
            return {
                validate: true,
                message: '校验正确'
            }
        },
        emitEvent(name) {
            const values = []
            if (this.isMultiple) {
                this.children.forEach(val => {
                    if (val.value) values.push(val.name)
                })
            } else {
                this.children.forEach(val => {
                    if (val.name !== name) { val.value = false }
                })
                this.$nextTick(() => {
                    values.push(name)
                })
            }

            this.$emit('change', {
                type: 'change',
                detail: {
                    value: values
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.c-checkbox-group {
    /* #ifndef MP || APP-NVUE */
    display: flex;
    flex-wrap: wrap;
    /* #endif */
}
</style>
