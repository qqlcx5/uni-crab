<template>
    <view class="digital-key">
        <view
            v-if="showDown_"
            class="digital-key-hd"
        >
            <view
                class="digital-key__icon"
                @click="$emit('close');"
            ></view>
            <slot></slot>
        </view>
        <view
            class="digital-key-bd"
            @click="emitKeyNumber"
        >
            <view
                v-for="item in digitalList"
                :key="item"
                class="digital-key__num"
                :data-num="item"
                :class="{'digital-key__num--no':(item === '' || item === '-1')}"
            >{{ item }}</view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        value: {
            type: [Number, String],
            default: ''
        },
        // 输入位数
        digits: {
            type: [Number, String],
            default: 6
        },
        // 输入的位置,0开始跟随数组
        activeIndex: {
            type: [Number, String],
            default: 0
        },
        /*
         *	可选值说明
         *	hand 手动
         *	auto 自动
         */
        trigger: {
            type: String,
            default: 'auto'
        },
        // 是否显示点击关闭按钮
        showDown: {
            type: [Boolean, String],
            default: false
        }
    },
    data() {
        return {
            digitalList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '-1'], // 键盘
            paymentPwd: '', // 安全密码内容
            activeInput: 0
        }
    },
    computed: {
        digits_() {
            return isNaN(this.digits) ? 6 : parseInt(this.digits)
        },
        showDown_() {
            return String(this.showDown) !== 'false'
        }
    },
    watch: {
        activeIndex: {
            handler(val) {
                this.activeInput = val
            },
            immediate: true
        },
        value: {
            handler(val) {
                this.paymentPwd = val
            },
            immediate: true
        }
    },
    methods: {
        handleSubmit(emitType = 'submit') {
            this.$emit('input', this.paymentPwd)
            this.$emit(emitType, {
                type: 'click',
                detail: {
                    value: this.paymentPwd,
                    activeIndex: this.activeInput
                }
            })
        },
        emitKeyNumber(e) {
            const val = e.target.dataset.num
            const paymentPwdArr = this.paymentPwd.split('')
            if (val === '' || (val !== -1 && paymentPwdArr.length === this.digits_)) { // 空或者已经达到最大值
                if (paymentPwdArr.length === this.digits_ && this.trigger === 'auto') {
                    this.handleSubmit()
                    return
                }
                return false
            } else if (val !== -1) { // 数字输入
                paymentPwdArr.splice(this.activeInput, 0, val)
                this.activeInput++
                this.paymentPwd = paymentPwdArr.join('')
                if (paymentPwdArr.length === this.digits_ && this.trigger === 'auto') {
                    this.handleSubmit()
                    return
                }
            } else { // 删除
                if (this.activeInput >= 0) {
                    this.activeInput--
                    if (this.activeInput === this.digits) {
                        paymentPwdArr.splice(this.activeInput, 1)
                    } else {
                        paymentPwdArr.splice(this.activeInput, 1)
                    }
                    this.activeInput < 0 ? this.activeInput = 0 : ''
                    this.paymentPwd = paymentPwdArr.join('')
                }
            }
            this.handleSubmit('change')
        }
    }
}
</script>

<style lang="scss">
.digital-key {
    width: 750rpx;

    &-hd {
        box-shadow: 0 0 0 2rpx #eee;
        position: relative;
        height: 80rpx;
    }

    // 缩小箭头
    &__icon {
        border-left: 1px solid #bbb;
        border-bottom: 1px solid #bbb;
        width: 40rpx;
        height: 40rpx;
        margin-top: -8rpx;
        @include siteCenter();
        transform: translate(50%, -50%) scale(0.5) rotate(-45deg);
    }

    /* 键盘 */
    &-bd {
        width: 100%;
        @include flex(row);
        flex-wrap: wrap;
    }

    &__num,
    &-hd {
        position: relative;
        overflow: hidden;

        &::before {
            content: '';
            width: 200%;
            height: 200%;
            border: 1px solid #eee;
            @include abs(0, null, null, 0);
            transform: scale(0.5);
            transform-origin: 0 0;
        }
    }

    &__num {
        transition: all 0.2s linear;
        background-color: #fff;
        width: 33.33333333%;
        cursor: pointer;
        height: 100rpx;
        color: #333;
        @include flex();
        align-items: center;
        justify-content: center;
        font-size: 55rpx;
        font-weight: bold;

        &::after {
            content: '';
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            //设置径向渐变
            background-image: radial-gradient(
                circle,
                rgba(0, 0, 0, 0.65) 20%,
                transparent 20%
            );
            background-repeat: no-repeat;
            background-position: 50%;
            transform: scale(5);
            opacity: 0;
            transition: transform 0.1s ease-in-out, opacity 0.2s ease-in-out;
        }

        &:active:after {
            transform: scale(0);
            opacity: 0.5;
            //设置初始状态
            transition: 0s;
        }

        &:nth-of-type(3n + 1) {
            border-bottom: 0;
            border-left: 0;
        }

        &:nth-of-type(3n + 2) {
            border-bottom: 0;
            border-left: 0;
            border-right: 0;
        }

        &--no {
            background-color: #f2f2f2;
            font-size: 0;
        }

        &:last-child {
            background: #f2f2f2
                url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAilBMVEUAAADLy8vLy8vLy8vMzMzMzMzY2NjMzMzMzMzQ0NDOzs7MzMzMzMzNzc3Pz8/T09PMzMzNzc3Nzc3Nzc3Ly8vMzMzMzMzMzMzOzs7MzMzNzc3MzMzOzs7Ozs7Q0NDMzMzMzMzMzMzOzs7Ozs7Ly8vMzMzMzMzMzMzMzMzOzs7MzMzMzMzMzMzMzMzKmFAsAAAALXRSTlMAQICZ9vAD+uoMG+eyRCsHwV5RJfvhjEw2yGdWMiEX7NWjOhL83JKGeinNu3IVbGIkAAADJklEQVR42u2Z2XLiQAxFBY3xBhgw+2IWkxAg+v/fm6lJKgGBkbrHKl76PFJQOm7crWsZPB6Px+PxeDwej0dGsm/UzB7kZJMIFYiOCYhYz1GJcCCqP0Y9hsCSp6jIJgaGXoSqLLn6G9TlCE9ZbVAZA8+YBcigK7BvIYOuQIOpry3QDZFBV2DK1NcWmI6QQVdgyNTXFlgekEFXYCD8cTeG4Rafcl7GUDQjO4EFSggG399+tlsn7a+OVqlp3OuffvbrqLo+fBPP5QKfKKJxdcdgBR9XmS6UCnygiIhfs8NNq+0IBSYoFGDv2tEUrtnJBCYoZUYMuLR1Fgm8o5gOs3NJ3pyiRMCgBQ1ydoY3eZdcfy+QCOzQhqBHumcLf2gRu3WEvEB7h3ZEOclvwY/bDG4oxsgLtDtoS0rW4JQ+/jx5Q0aA1BcTrEilf1c6Tu68GAH7+pVrvUXcFnf/DC+QXdCNVhduiPv9WJAsqUDWR1dGZL9lmV2yNF/a6M7h98RxSZbmt1U6s4BKlshhnOvTruuYbIzN+cvkDqdkYaCoI/++wwOOKBJYYB3s4A6DMoEd1mPQBqfObuCCtdBpu402DPTrWgBKHskEOlgDxnm8ZuBdYxP8tmFeoIuodhCVc8na8ZruzSC7CAQaITLwDZkiz3mG6ZjWkaTs2T1pmf+cRqUnEoneaEyDZcgKuM/j0vz+vm/NgOZ1RsDdYLymO//hXbEPWAGYuRikyePBejglBqeIEXCbyganqsH6iBr0AkbAZS5N/+vVpjqqQvfACDhM5pfP4v9hKExHxvndRIfGf+Z87PMCkNsYJOThnAvLe0bA9v3QnAx22R6Vixr5WmzQvznsRnxYHjAC1u/o8qvrF+SEMmUErA3m5c3jF2dgxFkqkRpEs6+G28QnXArmGcFUBimeVjOG9p4JPZtjDpBNrNJk8Ya1so1s42yxRU14ASgZA2UB3kBfAMozMigLQMwYKAswgxt9AWZ0pS/ADO8UBF5mYMDNQF9APMLVGbCRIb4iC3itQZjAaw2OAC81OGcgMZigEiYGGeWwqcDnCjwej8fj8Xg8Ho/nL38AXRgT/6dxCesAAAAASUVORK5CYII=)
                center center / auto 50rpx no-repeat;
        }
    }
}
</style>
