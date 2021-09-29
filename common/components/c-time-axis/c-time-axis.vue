<template>
    <view>
        <view class="ss-time-axis" :class="{'ss-time-axis-vertical': vertical_}">
            <view class="ss-time-axis__item flex-1" :class="{'ss-time-axis__item--active': step >= index}" :style="{ color: step >= index ? selColor : color }"
                v-for="(item, index) in list" :key="index">
                <view class="ss-time-axis__label">
                    {{item[labelKey]}}
                    <view v-if="item[timeKey]">{{item[timeKey]}}</view>
                </view>
                <c-icons class="ss-time-axis__icon" :color="step >= index ? selIconColor : color" size="32" :type="step >= index ? selIcon: icon" />
                <view class="ss-time-axis__line" :style="{ backgroundColor: step >= index ? selColor : color }"></view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {}
        },
        computed: {
            vertical_() {
                return String(this.vertical) === 'false' ? false : true;
            }
        },
        props: {
            /**
             * 时间轴列表
             * 参考数据(横向)
                [{
                    step: 1,
                    label: '提交申请',
                    time: '2020-11-1 12:24:31'
                    }, {
                    step: 2,
                    label: '商家处理',
                    time: '2020-11-1 12:24:31'
                    }, {
                    step: 3,
                    label: '寄回去商品',
                    time: '2020-11-1 12:24:31'
                    }, {
                    step: 4,
                    label: '正在退款',
                    time: '2020-11-1 12:24:31'
                    }, {
                    step: 5,
                    label: '退款成功',
                    time: '2020-11-1 12:24:31'
                }]
            */
            list: {
                type: Array,
                default: () => {
                    return []
                }
            },
            vertical: {
                type: [String, Boolean],
                default: false
            },
            step: {
                type: [String, Number],
                default: 0
            },
            labelKey: {
                type: String,
                default: 'label'
            },
           timeKey: {
                type: String,
                default: 'time'
            },
            color: {
                type: String,
                default: 'rgba(255, 255, 255, .5)'
            },
            selColor: {
                type: String,
                default: 'rgba(255, 255, 255, 1)'
            },
            icon: {
                type: String,
                default: 'icon-xuanzhong'
            },
            selIcon: {
                type: String,
                default: 'icon-xuanzhong'
            },
            selIconColor: {
                type: String,
                default: 'rgba(255, 255, 255, 1)'
            },
        }
    }
</script>

<style lang="scss" scoped>
    .ss-time-axis {
        @include flex(row);
        border-radius: 16rpx;

        &__item {
            @include flex(column);
            justify-content: center;
            align-items: center;
            position: relative;
            padding: 24rpx 0;

            &:first-child {
                .ss-time-axis__line {
                    display: none;
                }
            }
        }
        &__icon{
            margin-top: 12rpx;
            position: relative;
            z-index: 2;
        }
        &__label {
            font-size: 24rpx;
            line-height: 32rpx;
            @include ellipsis;
            text-align: center;
            view{
                margin-top: 8rpx;
            }
        }

        &__line {
            width: 42%;
            height: 2px;
            transform: scale(1, 0.5);
            opacity: .5;
            @include abs(null, null, 36rpx, -21%);
        }

        &-vertical {
            flex-direction: column;

            .ss-time-axis {
                &__item {
                    padding: 24rpx;
                    width: 100%;
                    flex-direction: row-reverse;
                    justify-content: flex-end;
                    align-items: center;
                }
                &__icon{
                    margin-top: 0;
                }

                &__label {
                    padding-left: 24rpx;
                    line-height: 36rpx;
					text-align: left;
					text-overflow: initial;
					white-space: inherit;
                }

                &__line {
                    height: 100%;
                    width: 2px;
                    left: 40rpx;
                    top: -50%;
                    bottom: auto;
                    transform: scale(0.5, 1);
                }
            }
        }
    }
</style>
