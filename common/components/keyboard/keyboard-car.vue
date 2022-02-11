<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-12-28 15:41:09
-->
<template>
    <view
        class="ca-keyboard-car"
        :class="[
            `ca-keyboard-car--${config_.operation}`,
            config_.operation !== 'empty' && ripple ? 'ripple': ''
        ]"
        @click.stop="handleClick"
    >
        <template v-if="config_.type === 'text' || (config_.type === 'symbol' && config_.operation !== 'empty')">
            {{ config_.value }}
        </template>
        <template v-if="config_.type === 'tabs'">
            <text
                v-for="(item, index) in config_.value"
                :key="index"
                class="ca-keyboard-car__tab"
                :class="[
                    active === index ? 'ca-keyboard-car__tab--active' : ''
                ]"
            >
                {{ item }}
            </text>
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
        active: {
            type: Number,
            default: 0
        },
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
.ca-keyboard-car {
    overflow: hidden;
    position: relative;
    background-color: #ffffff;
    border-radius: $keyboard-border-radius;
    box-shadow: $keyboard-box-shadow;
    border-bottom: 1px solid $keyboard-border;
    font-weight: bold;
    height: 106rpx;
    font-size: 30rpx;
    @include flex(row);
    align-items: center;
    justify-content: center;
    &--delete,
    &--switchTab {
        background-color: #c2c6cf;
        color: #fff;
    }
    &__tab {
        font-size: 24rpx;
        font-weight: 400;
        color: #eee;
        @include flex(row);
        align-items: center;
        justify-self: center;
        &:nth-last-of-type(1) {
            &::before {
                font-weight: 400;
                font-size: 30rpx;
                content: '/';
                color: #eee;
                margin: 0 4rpx;
            }
        }
        &--active {
            font-weight: bold;
            font-size: 30rpx;
            color: #fff;
        }
    }
}
</style>
