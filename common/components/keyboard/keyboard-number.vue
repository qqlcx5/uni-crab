<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-28 15:41:09
-->
<template>
    <view
        class="ca-keyboard-number"
        :class="[
            `ca-keyboard-number--${config_.operation}`
        ]"
        @click.stop="handleClick($event)"
    >
        <template v-if="config_.type === 'text' || (config_.type === 'symbol' && config_.operation !== 'empty')">
            {{ config_.value }}
        </template>
        <template v-else-if="config_.type === 'icon'">
            <c-icons
                size="40"
                :type="config_.value"
            />
        </template>
    </view>
</template>

<script>
export default {
    props: {
        config: {
            type: Object,
            default: () => ({})
        },
        showDotted: {
            type: Boolean,
            default: null
        }
    },
    computed: {
        showDotted_() {
            return this.showDotted || this.parent?.showDotted
        },
        config_() {
            return {
                ...this.config,
                operation: this.config.type === 'symbol' && !this.showDotted_ ? 'empty' : this.config.operation
            }
        }
    },
    created() {
        this.parent = this.$c.getParent.call(this, 'CKeyboard')
    },
    methods: {
        handleClick(e) {
            this.$emit('choose', {
                detail: this.config_
            })
        }
    }
}
</script>

<style lang="scss">
.ca-keyboard-number {
    @include flex(row);
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    background-color: #ffffff;
    border-radius: $keyboard-border-radius;
    box-shadow: $keyboard-box-shadow;
    border-bottom: 1px solid $keyboard-border;
    font-weight: bold;
    height: 106rpx;
    font-size: 40rpx;
    &--empty {
        background-color: rgba(255, 255, 255, 0.5);
    }
    &--confirm {
        height: calc(212rpx + $keyboard-spacing-base);
    }
    &--reset {
        font-size: 32rpx;
        font-weight: 400;
    }
    &--delete,
    &--confirm,
    &--reset {
        background-color: #c2c6cf;
        color: #fff;
    }
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
        transition: transform 0.2s ease-in-out, opacity 0.3s ease-in-out;
    }
    &:active::after {
        transform: scale(0);
        opacity: 0.5;
        //设置初始状态
        transition: 0s;
    }
}
</style>
