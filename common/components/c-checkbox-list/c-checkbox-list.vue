<template>
    <view>
        <view
            v-if="loading"
            class="flex-column align-center"
        >
            <c-loading
                color="#666"
                size="100"
            />
        </view>
        <block v-else>
            <block v-if="list.length">
                <c-checkbox-group
                    v-model="selectValue"
                    :is-multiple="isMultiple"
                    :shape="shape"
                    class="column"
                    :pattern="pattern"
                    :msg-name="msgName"
                    @change="handleRadioGroup"
                >
                    <c-custom-checkbox
                        v-for="(row) in list"
                        :key="row.value"
                        class="ptb24"
                        :name="row.value"
                        column
                        :custom-css="customCss_"
                        :show-border="itemLayer.showBorder"
                        :disabled="row.disabled"
                        :checked="!!row.checked"
                        :active-color="itemLayer.selColor"
                        :custom-style="customStyle_"
                    >
                        <text class="pl24 flex-1">{{ row[labelKey] }}</text>
                    </c-custom-checkbox>
                </c-checkbox-group>
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
        itemLayer: {
            type: Object,
            default: () => { }
        },
        msgName: {
            type: String,
            default: ''
        },
        pattern: {
            type: String,
            default: ''
        },
        value: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 模拟radio
        isMultiple: {
            type: [Boolean, String],
            default: true
        },
        // 形状，square为方形，circle为圆形
        shape: {
            type: String,
            default: 'square'
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
        customCss_() {
            return {
                margin: '10rpx 0',
                'justify-content': 'space-between',
                'flex-direction': 'row-reverse',
                'align-self': 'stretch'
            }
        },
        customStyle_() {
            return this.isMultiple ? 'style2' : 'style1'
        },
        selectValue: {
            get(val) {
                return val.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    created() {
        console.log(this.itemLayer, '--itemLayer')
    },
    methods: {
        handleRadioGroup(e) {
            this.selectValue = e.detail.value
            this.$emit('change', e)
        }
    }
}
</script>

<style>
.column {
    flex-direction: column;
}
</style>
