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
            `ca-keyboard-number--${config_.operation}`,
            config_.operation !== 'empty' && ripple ? 'ripple': ''
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
        },
        // 开启水波特效
        ripple: {
            type: Boolean,
            default: true
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
        height: 212rpx + $keyboard-spacing-base;
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
}
</style>
