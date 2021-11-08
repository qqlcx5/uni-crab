<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: sky
 * @Date: 2021-08-12 15:57:19
-->
<template>
    <view class="c-tag">
        <view class="c-tag__content">
            <text
                v-if="plain_"
                class="c-tag__border"
                :style="[ borderStyle_ ]"
            ></text>
            <view
                class="c-tag__text"
                :style="[ style_ ]"
            >
                <slot></slot>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'CTag',
    props: {
        bgColor: {
            type: String,
            default: '#F7F7FA'
        },
        color: {
            type: String,
            default: '#666'
        },
        borderColor: {
            type: String,
            default: ''
        },
        fontSize: {
            type: [String, Number],
            default: 22
        },
        radius: {
            type: [String, Number],
            default: 0
        },
        plain: {
            type: [String, Boolean],
            default: false
        },
        borderStyle: {
            type: Object,
            default: () => { }
        },
        round: {
            type: [String, Boolean],
            default: false
        },
        height: {
            type: [String, Number],
            default: ''
        },
        width: {
            type: [String, Number],
            default: ''
        }

    },
    data() {
        return {

        }
    },
    computed: {
        plain_() {
            return String(this.plain) !== 'false'
        },
        radius_() {
            return String(this.round) !== 'false' ? 999999 : this.radius
        },
        style_() {
            const style = this.parent ? { ...this.parent.colorsStyle_ } : {
                ...style,
                color: this.color,
                backgroundColor: this.plain_ ? 'transparent' : this.bgColor
            }
            this.width ? (style.width = this.$c.formatUnit(this.width)) : style.paddingLeft = style.paddingRight = this.fontSize / 2 + 'rpx'
            this.height ? (style.height = style.lineHeight = this.$c.formatUnit(this.height)) : style.paddingTop = style.paddingBottom = this.fontSize / 12 + 'rpx'
            this.fontSize ? (style.fontSize = this.$c.formatUnit(this.fontSize)) : ''
            if (this.radius_) {
                style.borderRadius = this.$c.formatUnit(this.radius_) + ''
            }
            return style
        },
        borderStyle_() {
            const borderStyle = {
                ...this.borderStyle,
                borderColor: this.plain_ ? this.color : ''
            }
            if (this.style_.borderRadius) {
                // 所有边框（含单位）
                const borderArr = String(this.style_.borderRadius).split(' ')
                // 所有边框转数字（不含单位）
                const borderNumberArr = borderArr.map(o => parseInt(o))
                // 所有边框的单位
                const borderUnit = borderArr.map((o, i) => o.replace(borderNumberArr[i], ''))
                borderStyle.borderRadius = borderArr.map((o, i) => parseInt(o) * 2 + borderUnit[i]).join(' ')
                this.style_.borderColor && (borderStyle.borderColor = this.style_.borderColor)
            }
            return borderStyle
        }
    },
    created() {
        // 支付宝小程序不支持provide/inject，所以使用这个方法获取整个父组件，在created定义，避免循环应用
        this.parent = this.$c.getParent.call(this, 'CColors')
    }
}
</script>

<style lang='scss' scoped>
.c-tag {
    position: relative;
    display: inline-flex;
    align-items: center;

    /*  @include flex(row);
    justify-content: center;
    align-items: center; */
    & + & {
        margin-left: 24rpx;
    }
    &__content {
        @include flex();
        align-items: center;
        justify-content: center;
        position: relative;
        text-align: center;
    }
    &__border {
        content: '';
        width: 200%;
        height: 200%;
        position: absolute;
        top: 0;
        left: 0;
        border: 1px solid rgba(0, 0, 0, 0.2);
        transform: scale(0.5);
        transform-origin: 0 0;
        //border-radius: 2 * $border-radius-base;
    }
}
</style>
