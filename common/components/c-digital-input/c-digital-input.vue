<template>
    <view
        class="c-digital-input"
        @click="emitActiveInput"
    >
        <view
            v-for="(item,index) in digits_"
            :key="index"
            class="c-digital-input__text"
            :style="{width: size + 'rpx', height: size + 'rpx'}"
            :data-index="index"
            :class="{ active : (activeInput === index) }"
        >{{ payPassWord_[index] }}</view>
    </view>
</template>

<script>
export default {
    props: {
        // 输入框大小
        size: {
            type: [Number, String],
            default: 92
        },
        value: {
            type: [Number, String],
            default: ''
        },
        // 输入的位置,0开始跟随数组
        activeIndex: {
            type: [Number, String],
            default: 0
        },
        // 输入位数
        digits: {
            type: [Number, String],
            default: 6
        }
    },
    data() {
        return {
            activeInput: -1
        }
    },
    computed: {
        digits_() {
            return isNaN(this.digits) ? 6 : parseInt(this.digits)
        },
        payPassWord_() {
            return String(this.value).split('')
        },
        textSize_() {
            const size = (this.size ? this.size : 92) + 'rpx'
            return {
                width: size,
                height: size
            }
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
        emitActiveInput(e) {
            this.$emit('click', {
                type: 'click',
                detail: {
                    value: e.target.dataset.index
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.c-digital-input {
    position: relative;
    @include flex(row);
    justify-content: center;
    align-items: center;

    &__text {
        position: relative;
        font-size: 50rpx;
        font-weight: bold;
        width: 92rpx;
        height: 92rpx;
        margin: 0 5rpx;
        @include flex(row);
        justify-content: center;
        align-items: center;

        &::before {
            content: '';
            width: 200%;
            height: 200%;
            border: 1px solid #eee;
            @include abs(0, null, null, 0);
            transform: scale(0.5);
            transform-origin: 0 0;
        }

        &.active:after {
            -webkit-animation: twinkle 1s infinite;
            animation: twinkle 1s infinite;
            height: 70%;
            width: 4rpx;
            content: '';
            position: absolute;
            top: 15%;
            left: 50%;
            margin-left: -2rpx;
            background-color: #4fa5e1;
        }

        @keyframes twinkle {
            from {
                background-color: #4fa5e1;
            }

            to {
                background-color: transparent;
            }
        }
    }
}
</style>
