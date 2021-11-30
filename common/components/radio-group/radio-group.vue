<template>
    <view class="c-radio-group c-clearfix">
        <slot></slot>
    </view>
</template>

<script>
import Emitter from '../../utils/emitter.js'
/**
 * radioRroup 单选框父组件
 * @description 单选框用于有一个选择，用户只能选择其中一个的场景。搭配c-radio使用
 * @tutorial https://www.uviewui.com/components/radio.html
 * @property {Boolean} disabled 是否禁用所有radio（默认false）
 * @property {String Number} size 组件整体的大小，单位rpx（默认40）
 * @property {String} active-color 选中时的颜色，应用到所有子Radio组件（默认#2979ff）
 * @property {String Number} zsuicon-size 图标大小，单位rpx（默认20）
 * @property {String} shape 外观形状，shape-方形，circle-圆形(默认circle)
 * @property {Boolean} label-disabled 是否禁止点击文本操作checkbox(默认false)
 * @property {String} width 宽度，需带单位
 * @property {Boolean} wrap 是否每个radio都换行（默认false）
 * @event {Function} change 任一个radio状态发生变化时触发
 * @example <c-radio-group v-model="value"></c-radio-group>
 */
export default {
    name: 'CRadioGroup',
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
        // 是否禁用所有单选框
        disabled: {
            type: Boolean,
            default: false
        },
        // 匹配某一个radio组件，如果某个radio的name值等于此值，那么这个radio就被会选中
        value: {
            type: [String, Number],
            default: ''
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
        // 是否禁止点击提示语选中复选框
        labelDisabled: {
            type: Boolean,
            default: false
        },
        // 形状，square为方形，circle为原型
        shape: {
            type: String,
            default: 'circle'
        },
        // 图标的大小，单位rpx
        iconSize: {
            type: [String, Number],
            default: 42
        },
        // 每个checkbox占c-checkbox-group的宽度
        width: {
            type: [String, Number],
            default: 'auto'
        },
        // 是否每个checkbox都换行
        wrap: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            radioName: '',
            radioValue: ''
        }
    },
    computed: {
        // 这里computed的变量，都是子组件c-radio需要用到的，由于头条小程序的兼容性差异，子组件无法实时监听父组件参数的变化
        // 所以需要手动通知子组件，这里返回一个parentData变量，供watch监听，在其中去通知每一个子组件重新从父组件(c-radio-group)
        // 拉取父组件新的变化后的参数
        parentData() {
            return [this.value, this.disabled, this.activeColor, this.size, this.labelDisabled, this.shape, this.iconSize, this.width, this.wrap]
        }
    },
    watch: {
        value: {
            handler(val) {
                this.radioValue = val
            },
            immediate: true
        },
        // 当父组件需要子组件需要共享的参数发生了变化，手动通知子组件
        parentData() {
            if (this.children.length) {
                this.children.map(child => {
                    // 判断子组件(c-radio)如果有updateParentData方法的话，就就执行(执行的结果是子组件重新从父组件拉取了最新的值)
                    typeof (child.updateParentData) === 'function' && child.updateParentData()
                })
            }
        }
    },
    created() {
        this.radioName = this.name ? this.name : ('crabRadio' + Math.random().toString(32).substr(2))
        // 如果将children定义在data中，在微信小程序会造成循环引用而报错
        this.children = []
        this.parent = this.$c.getParent.call(this, 'CForm')
        this.parent && this.parent.children.push(this)
    },
    methods: {
        validate(hasMsg = true) {
            const validatenotNull = this.pattern === 'notNull' && !this.value
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
        // 该方法有子组件radio调用，当一个radio被选中的时候，给父组件设置value值(props传递的value)
        setValue(val) {
            // 通过子组件传递过来的val值(此被选中的子组件内部已将parentValue设置等于val的值)，将其他
            // c-radio设置未选中的状态
            this.children.map(child => {
                if (child.parentData.value != val) child.parentData.value = ''
            })
            this.radioValue = val
            // 通过emit事件，设置父组件通过v-model双向绑定的值
            this.$emit('input', val)
            this.$emit('change', {
                type: 'change',
                detail: {
                    value: val
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.c-radio-group {
    display: block;
    width: 100%;
}
</style>
