<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-05-29 09:58:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-02-09 14:26:09
-->
<template>
    <view
        class="c-icons"
        :style="[parentObj_]"
    >
        <text
            :color="color"
            :size="size"
            class="c-icons__text"
            :style="[styleObj_]"
            :class="[iconName_, type_]"
            @click="onClick"
        ></text>
    </view>
</template>

<script>
const specialIcons = ['tarbar', 'tabbar', 'zsuicon']
export default {
    name: 'CIcons',
    props: {
        // 图标名称
        type: {
            type: String,
            default: ''
        },
        // 图标颜色
        color: {
            type: [String, Boolean],
            default: false
        },
        // 图标大小
        size: {
            type: [Number, String],
            default: 28
        },
        // 是否开启旋转动画
        spin: {
            type: Boolean,
            default: false
        },
        // 是否旋转
        rotate: {
            type: [Number, String, Boolean],
            default: false
        }
    },
    computed: {
        iconStyle_() {
            return this.zzspIconStyle
        },
        type_() {
            const types = this.type.split('-')
            if (specialIcons.includes(types[0])) return this.type
            this.iconStyle_ && types.splice(1, 0, this.iconStyle_)
            return types.join('-')
        },
        iconName_() {
            const types = this.type.split('-')
            if (specialIcons.includes(types[0])) return types[0]
            return this.iconStyle_ ? `icon` + this.iconStyle_ : 'iconfont'
        },
        rotate_() {
            return String(this.rotate) === 'false' ? false : this.rotate
        },
        styleObj_() {
            const obj = {
                fontSize: String(this.size).indexOf('px') !== -1 ? this.size : uni.upx2px(this.size) + 'px'
            }
            String(this.color) !== 'false' && (obj['color'] = this.color)
            return obj
        },
        parentObj_() {
            const obj = {}
            // obj.height = String(this.size).indexOf('px') !== -1 ? this.size : uni.upx2px(this.size) + 'px'
            this.rotate_ && (obj.transform = isNaN(this.rotate) ? `rotate(${this.rotate})` : `rotate(${this.rotate}deg)`)
            if (this.spin) {
                obj.animation = 'c-icon-spin 1.5s linear infinite'
            }
            return obj
        }
    },
    methods: {
        onClick(e) {
            this.$emit('click', e)
        }
    }
}

</script>

<style scoped lang="scss">
.c-icons {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    line-height: 0;
    font-size: 0;
    @include tst(transform);

    &__text {
        vertical-align: middle;
        line-height: 1;
    }
}
</style>
