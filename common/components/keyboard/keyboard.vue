<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-28 15:41:09
-->
<template>
    <view
        class="keyboard-box"
        :class="[mask ? '' : 'keyboard-box--through']"
    >
        <c-popup
            v-model="popupValue"
            bg-color="#e2e3e7"
            mode="bottom"
            :mask="mask"
            show-close="false"
            :hd-style="contentStyle_"
        >
            <view
                class="keyboard"
                :class="[
                    `keyboard--${mode}`,
                    `keyboard--size${keyLength_}`,
                    simple ? 'keyboard--simple' : '',
                ]"
            >
                <view
                    class="keyboard-clipboard flex align-center justify-center"
                    :class="[
                        clipboardData.length ? 'keyboard-clipboard--active' : ''
                    ]"
                    @click="handleClickClipboard"
                >
                    {{ clipboardData }}
                </view>
                <view class="keyboard-hd flex">
                    <view
                        class="keyboard-hd__left flex align-center"
                        @click="handleClick($event, 'cancel')"
                    >
                        <slot name="cancel" />
                        <text
                            v-if="!$slots.cancel && showCancel"
                            class="ellipsis-1"
                            :style="{
                                color: cancelColor
                            }"
                        >{{ cancelText }}</text>
                    </view>
                    <view class="keyboard-hd__middle flex flex-1 align-center justify-center">
                        <c-icons
                            type="zsuicon-tiaozhuan"
                            size="40"
                            color="#acafb6"
                            rotate="90deg"
                            @click="handleClick($event, 'close')"
                        />
                    </view>
                    <view
                        class="keyboard-hd__right flex align-center justify-end"
                        @click="handleClick($event, 'submit')"
                    >
                        <slot name="submit" />
                        <text
                            v-if="!$slots.submit && showSubmit"
                            class="ellipsis-1"
                            :style="{
                                color: submitColor
                            }"
                        >{{ submitText }}</text>
                    </view>
                </view>
                <view class="keyboard-bd flex">
                    <view
                        v-if="!simple && keyboardKeys.left && keyboardKeys.left.length"
                        class="keyboard-bd__left"
                    ></view>
                    <view
                        v-if="middle_"
                        class="keyboard-bd__middle flex flex-wrap"
                    >
                        <template v-if="['idcard', 'number'].includes(mode)">
                            <view
                                v-for="(item, index) in middle_"
                                :key="index"
                                class="keyboard-bd__item"
                            >
                                <keyboard-number
                                    :config="item"
                                    :ripple="ripple"
                                    @choose="handleKeyClick"
                                />
                            </view>
                        </template>
                        <template v-if="mode === 'car'">
                            <view
                                v-for="(item, index) in middle_"
                                :key="index"
                                class="keyboard-bd__item"
                                :class="[
                                    `keyboard-bd__item--${item.type}`
                                ]"
                            >
                                <keyboard-car
                                    :active="keyboardTabIndex"
                                    :config="item"
                                    :ripple="ripple"
                                    @choose="handleKeyClick"
                                />
                            </view>
                        </template>
                    </view>
                    <view
                        v-if="!simple && keyboardKeys.right && keyboardKeys.right.length"
                        class="keyboard-bd__right"
                    >
                        <view
                            v-for="(item, index) in keyboardKeys.right"
                            :key="index"
                            class="keyboard-bd__item"
                        >
                            <keyboard-number
                                :config="item"
                                :ripple="ripple"
                                @choose="handleKeyClick"
                            />
                        </view>
                    </view>
                </view>
            </view>
        </c-popup>
    </view>
</template>

<script>
import keyboardKeyMaps, { deleteKey, getKeyItem } from './keyboardKeyMaps.js'
import validateReg from '../../utils/validate.js'
import keyboardNumber from './keyboard-number.vue'
import keyboardCar from './keyboard-car.vue'

export default {
    name: 'CKeyboard',
    components: { keyboardNumber, keyboardCar },
    props: {
        // 虚拟键盘类型 number 数字键盘 | idcard 身份证键盘 | car 汽车车牌键盘
        mode: {
            type: String,
            default: 'number'
        },
        // 是否显示
        value: {
            type: Boolean,
            default: false
        },
        // 是否显示取消
        showCancel: {
            type: Boolean,
            default: true
        },
        // 取消按钮文字，最多4个字符
        cancelText: {
            type: String,
            default: '取消'
        },
        // 取消按钮文字颜色
        cancelColor: {
            type: String,
            default: '#acafb6'
        },
        // 是否显示确定
        showSubmit: {
            type: Boolean,
            default: true
        },
        // 确定按钮文字，最多4个字符
        submitText: {
            type: String,
            default: '确定'
        },
        // 确定按钮文字颜色
        submitColor: {
            type: String,
            default: '#4fa5e1'
        },
        // 是否显示"."按键，只在mode=number时有效
        showDotted: {
            type: Boolean,
            default: true
        },
        // 开启水波特效
        ripple: {
            type: Boolean,
            default: true
        },
        // 是否打乱键盘按键的顺序，开启了打乱顺序，simple属性失效
        random: {
            type: Boolean,
            default: false
        },
        // 简单模式,键盘上没有清空跟提交按钮,mode = car模式下建议设置为true，不然会很挤
        simple: {
            type: Boolean,
            default: true
        },
        // 蒙层，去掉蒙层，键盘以上的区域会穿透点击
        mask: {
            type: Boolean,
            default: true
        },
        // 开启按键震动
        vibrate: {
            type: Boolean,
            default: true
        },
        // 是否获取剪切板信息
        clipboard: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 键盘的键帽
            keyboardKeys: {},
            // 键盘的中英切换的值
            keyboardTabIndex: 0,
            // 键盘的输出值
            codeInputValue: '',
            // 剪切板内容
            clipboardData: '1111',
            height: 580,
            popupValue: false
        }
    },
    computed: {
        // 键盘的背景颜色
        contentStyle_() {
            const contentStyle = {
            }
            if (this.clipboardData.length) {
                contentStyle.marginTop = '100rpx'
            }
            return contentStyle
        },
        keyboardTabs_() {
            if (this.mode === 'car') {
                return Object.keys(this.keyboardKeys.middle || {})
            } else {
                return []
            }
        },
        // 键盘的一些插入操作
        middle_() {
            const middle = this.$deepClone(this.keyboardTabs_.length ? this.keyboardKeys.middle[this.keyboardTabs_[this.keyboardTabIndex]] : this.keyboardKeys.middle || [])
            if (this.mode === 'car') {
                middle.splice(-(middle.length % 10), 0, getKeyItem(this.keyboardTabs_, 'tabs', 'switchTab'))
                middle.push(deleteKey)
            } else if (['number', 'idcard'].includes(this.mode)) {
                if (this.mode === 'number' && !this.showDotted) {
                    middle.forEach(o => {
                        if (o.type === 'symbol') {
                            o.operation = 'empty'
                        }
                    })
                }
                if (this.simple) {
                    middle.push(deleteKey)
                }
            }
            return middle
        },
        keyLength_() {
            return this.middle_.length
        }
    },
    watch: {
        // 键盘的弹窗显示与隐藏
        value: {
            handler(val) {
                this.popupValue = val
                if (val) {
                    this.$emit('keyboardheightchange', {
                        detail: {
                            height: val ? this.height : 0
                        }
                    })
                    this.keyboardKeys = this.getKeyboardKey()
                    // #ifndef H5
                    if (this.clipboard) {
                        uni.getClipboardData({
                            success: (res) => {
                                // 格式一致才会设置剪切板的值
                                if (res.data && validateReg(this.mode, res.data)) {
                                    this.$c.throttle(() => {
                                        this.clipboardData = res.data
                                        this.$c.throttle(this.clearClipboardData, 5000)
                                    }, 1000)
                                }
                            }
                        })
                    }
                    // #endif
                } else {
                    this.clearClipboardData()
                }
            },
            immediate: true
        },
        popupValue(val) {
            this.$emit('input', val)
        }
    },
    methods: {
        handleKeyClick(e) {
            if (this.vibrate && e.detail.operation !== 'empty') {
                try {
                    uni.vibrateShort()
                } catch (error) {
                    console.log(error)
                }
            }
            const operation = e.detail.operation
            switch (operation) {
                case 'switchTab':
                    this.keyboardTabIndex = 1 ^ this.keyboardTabIndex
                    break
                default:
                    this.$emit(operation, e)
                    break
            }
        },
        // 点击了验证码
        handleClickClipboard() {
            const clipboardDataArr = String(this.clipboardData).split('')
            clipboardDataArr.forEach((o, i) => {
                setTimeout(() => {
                    this.$emit('change', {
                        detail: {
                            value: o
                        }
                    })
                }, 200 * i)
            })
            this.$c.throttle(this.clearClipboardData, 200)
        },
        // 清空裁剪版的内容
        clearClipboardData() {
            this.clipboardData = ''
        },
        handleClick(e, event) {
            this.popupValue = false
            this.$emit(event, {
                detail: {
                    value: e
                }
            })
        },
        // 获取键帽
        getKeyboardKey() {
            const keys = this.$deepClone(keyboardKeyMaps.get(this.mode))
            if (this.random) {
                if (this.$typeOf(keys.middle) === 'Array') {
                    keys.middle = this.$c.scrambleArray(keys.middle)
                } else if (this.$typeOf(keys.middle) === 'Object') {
                    Object.keys(keys.middle).forEach(o => {
                        keys.middle[o] = this.$typeOf(keys.middle[o]) === 'Array' ? this.$c.scrambleArray(keys.middle[o]) : o
                    })
                }
            }
            return keys
        }
    }
}
</script>

<style lang="scss">
.keyboard {
    position: relative;
    &-box {
        &--through {
            ::v-deep .c-modal--bottom {
                top: auto;
            }
        }
        ::v-deep .code-input__num--text {
            background-color: #fff;
        }
    }
    // 剪切板内容
    &-clipboard {
        @include abs(-100rpx, 50%);
        transform: translateX(50%);
        opacity: 0;
        pointer-events: none;
        height: 70rpx;
        min-width: 150rpx;
        border-radius: 40rpx;
        padding: 0 $spacing-row-lg;
        background-color: #fff;
        box-shadow: $keyboard-box-shadow;
        color: $color-sub-text;
        @include tst;
        &--active {
            opacity: 1;
            pointer-events: auto;
        }
    }
    &-hd {
        padding-top: $keyboard-spacing-base;
        &__left,
        &__middle,
        &__right {
            font-size: 34rpx;
            height: 88rpx;
            padding: 0 $spacing-row-lg;
        }
        &__left {
            padding-right: 0;
        }
        &__right {
            padding-left: 0;
        }
        &__middle {
            max-width: calc(100% - 320rpx);
        }
        &__left,
        &__right {
            font-size: 32rpx;
            width: 160rpx;
        }
    }
    &-bd {
        padding: $keyboard-spacing-base / 2;
        &__item {
            padding: $keyboard-spacing-base / 2;
        }
        &__middle {
            flex: 1;
        }
        &__left,
        &__right {
            width: 110rpx;
            .keyboard-bd__item {
                width: 100% !important;
            }
        }
        &__item {
            width: 33.33333333%;
        }
    }
    &--number,
    &--idcard {
        &.keyboard {
            &--size11 {
                .keyboard {
                    &-bd {
                        &__item {
                            &:nth-last-of-type(1) {
                                width: 66.66666667%;
                            }
                        }
                    }
                }
            }
            &--simple {
                .keyboard {
                    &-bd {
                        &__item {
                            &:nth-last-of-type(1) {
                                width: 33.33333333%;
                            }
                            &:nth-last-of-type(2) {
                                width: 66.66666667%;
                            }
                        }
                    }
                }
            }
            &--size12 {
                .keyboard {
                    &-bd {
                        &__item {
                            &:nth-last-of-type(1),
                            &:nth-last-of-type(2) {
                                width: 33.33333333%;
                            }
                        }
                    }
                }
            }
        }
    }
    &--car {
        .keyboard {
            &-bd {
                &__item {
                    width: 10%;
                    &--tabs,
                    &--icon {
                        width: 20%;
                    }
                }
            }
        }
    }
}
</style>
