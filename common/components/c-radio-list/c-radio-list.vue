<template>
    <view>
        <view
            v-if="loading"
            class="flex-column align-center"
        >
            <c-loading
                color="#666"
                size="60"
            />
        </view>
        <block v-else>
            <block v-if="list.length">
                <c-radio-group
                    v-model="selectValue"
                    wrap
                    @change="handleRadioGroup"
                >
                    <c-radio
                        v-for="(item, index) in list"
                        :key="item.value"
                        :name="item[idKey]"
                        class="flex-space-between ptb24"
                        :class="{'c-underline': index !== list.length - 1}"
                    >
                        <view slot="before">
                            <view
                                class="flex"
                                :class="{'align-center': !item.canQuota}"
                            >
                                <c-image
                                    v-if="item.icon"
                                    :src="item.icon"
                                    width="44"
                                    max-height="44"
                                    mode="widthFix"
                                ></c-image>
                                <view class="pl24 flex-1">
                                    {{ item[labelKey] }}
                                    <template v-if="item.canQuota">
                                        <view class="radio-summary">
                                            <template v-if="item.useQuota">
                                                已消费：<text class="radio-summary__text d-din">{{ item.useQuota }}</text>
                                            </template>
                                            <template v-if="item.canQuota">
                                                {{ item.type === 'b' ? '可用余额' :'可用额度' }}： <text class="radio-summary__text d-din">{{ item.canQuota }}</text>
                                            </template>
                                        </view>
                                    </template>
                                </view>
                            </view>
                        </view>
                    </c-radio>
                </c-radio-group>
            </block>
            <block v-else>
                <c-no-data
                    :text="lodingText"
                    show-img
                    :icon="lodingIcon"
                ></c-no-data>
            </block>
        </block>
    </view>
</template>

<script>
export default {
    props: {
        value: {
            type: [Number, String],
            default: () => {
                return ''
            }
        },
        // 加载中文字样式
        loadingStyle: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 没有数据
        noData: {
            type: Boolean,
            default: false
        },
        lodingIcon: {
            type: String,
            default: 'common/no-order.png'
        },
        // 加载文字
        lodingText: {
            type: String,
            default: '暂无可用支付方式'
        },
        list: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 数据加载中
        loading: {
            type: Boolean,
            default: false
        },
        // 页面显示的值
        labelKey: {
            type: String,
            default: 'label'
        },
        // 勾选中的值
        idKey: {
            type: String,
            default: 'value'
        }
    },
    computed: {
        selectValue: {
            get(val) {
                return val.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    methods: {
        handleRadioGroup(e) {
            this.selectValue = e.detail.value
            this.$emit('change', e)
        }
    }
}
</script>

<style lang="scss" scope>
.radio-summary {
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
    line-height: 32rpx;
    @include flex(row);
    align-items: center;
    &__text {
        color: #ff5d0c;
        margin-right: 24rpx;
    }
}
</style>
