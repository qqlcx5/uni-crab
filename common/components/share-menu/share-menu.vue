<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-11-11 10:22:00
-->
<template>
    <view>
        <view class="share-menu">
            <view class="share-menu-title">
                <view class="share-menu-title__left">
                    <c-image
                        src="share/header-left.png"
                        width="240"
                        height="84"
                        mode="heightFix"
                    />
                    <text class="share-menu-title__title">分享至</text>
                </view>
                <view
                    class="share-menu-title__right"
                    :style="[titleStyle_]"
                    :class="[mode !== 'article' ? 'flex align-center' : 'flex-column justify-center']"
                >
                    <slot name="header">
                        <view
                            v-if="title"
                            :class="[mode !== 'article' ? 'flex-1' : 'plr24']"
                        ><text class="title-elli">{{ title }}</text></view>
                        <slot name="headerRight">
                            <view
                                v-if="['goods', 'group', 'skill'].includes(mode)"
                                class="share-menu-bd__price line-block"
                            >
                                <view
                                    class="price-com"
                                    data-price_prefix="￥"
                                >
                                    {{ goodsInfo[priceKey] }}
                                    <text class="share-menu-bd__price--small">{{ goodsInfo.price_show_unit }}</text>
                                </view>
                            </view>
                            <view
                                v-else-if="mode === 'integral'"
                                class="share-menu-bd__price line-block"
                            >
                                <view class="flex align-center">
                                    <c-image
                                        src="integral/gold-coin.png"
                                        size="30"
                                    />
                                    <view class="integral-num">
                                        {{ goodsInfo.credit }}
                                    </view>
                                </view>
                            </view>
                            <view
                                v-else-if="mode ==='live'"
                                class="flex-1 line-block"
                            >
                                <view class="flex align-center">
                                    <c-image
                                        size="48"
                                        radius="24"
                                        :src="playerInfo.anchor.headingimg"
                                    />
                                    <text class="ml12 c-ellipsis">{{ playerInfo.anchor.wechat_nickname }}</text>
                                </view>
                            </view>
                        </slot>
                    </slot>
                </view>
            </view>
            <view class="share-menu-bd">
                <!-- #ifdef MP-WEIXIN -->
                <view class="share-menu-bd__item">
                    <c-button
                        open-type="share"
                        height="142"
                    >
                        <view class="flex-column align-center">
                            <c-image
                                size="90"
                                src="common/wechat-share.png"
                            ></c-image>
                            <text class="share-menu-bd__text">分享给好友</text>
                        </view>
                    </c-button>
                </view>
                <!-- #endif -->

                <!-- #ifdef H5 -->
                <template v-if="$isWechatBrowser">
                    <view
                        class="share-menu-bd__item"
                        @click="handleShowPoster('h5')"
                    >
                        <c-image
                            size="90"
                            src="common/wechat-share.png"
                        ></c-image>
                        <text class="share-menu-bd__text">分享给好友</text>
                    </view>
                    <view
                        class="share-menu-bd__item"
                        @click="handleShowPoster('h5')"
                    >
                        <c-image
                            size="90"
                            src="common/wechat-timeline.png"
                        ></c-image>
                        <text class="share-menu-bd__text">分享到朋友圈</text>
                    </view>
                </template>
                <!-- #endif -->

                <view
                    v-if="showPoster_"
                    class="share-menu-bd__item"
                    @click="handleShowPoster('posters')"
                >
                    <c-image
                        size="90"
                        src="common/share-poster.png"
                    ></c-image>
                    <text class="share-menu-bd__text">生成分享海报</text>
                </view>
            </view>
            <view class="share-menu-ft">
                <view class="c-underline__top">
                    <c-button
                        size="large"
                        @click="handleCancel"
                    >
                        <text class="c-999">取消</text>
                    </c-button>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        /**
        * 海报类型：
        * goods 商品相关
        * live 直播相关
        * article 文章咨询相关
        * plotter 海报列表
        * skill 秒杀
        * card 名片
       */
        mode: {
            type: String,
            default: 'goods'
        },
        // 头部标题
        title: {
            type: String,
            default: ''
        },
        /**
        *	商品相关的信息
        */
        goodsInfo: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 标题样式
        titleStyle: {
            type: Object,
            default: () => {
                return {
                    backgroundColor: 't'
                }
            }
        },
        /**
         * 展示生成海报按钮
         */
        showPoster: {
            type: [Boolean, String],
            default: true
        },
        /**
         * 主播信息
         */
        playerInfo: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 金额字段
        priceKey: {
            type: String,
            default: 'price_show'
        }
    },
    data() {
        return {
            shareH5: false,
            defaultColors: {
                theme: '#FF5D0C',
                subColor1: '#FFAE37',
                subColor2: '#FF5D0C'
            }
        }
    },
    computed: {
        showPoster_() {
            return String(this.showPoster) !== 'false'
        },
        colors_() {
            return this.shopConfig_?.color || this.defaultColors
        },
        titleStyle_() {
            const titleStyle = {}
            const colorsMap = new Map([
                ['t', 'theme'],
                ['s1', 'subColor1'],
                ['s2', 'subColor2']
            ])
            if (this.titleStyle.backgroundColor) {
                titleStyle.backgroundColor = colorsMap.has(this.titleStyle.backgroundColor) && this.colors_ ? this.colors_[colorsMap.get(this.titleStyle.backgroundColor)] : titleStyle.backgroundColor
            }
            if (this.titleStyle.color) {
                titleStyle.color = colorsMap.has(this.titleStyle.color) && this.colors_ ? this.colors_[colorsMap.get(this.titleStyle.color)] : titleStyle.color
            }
            return {
                ...this.titleStyle,
                ...titleStyle
            }
        }
    },
    methods: {
        handleShowPoster(platform) {
            this.$emit('showPoster', platform)
        },
        handleCancel() {
            this.$emit('cancel')
        },
        handleDowmload() {
            this.$emit('save')
        }
    }
}
</script>

<style lang="scss">
.share-menu {
    width: 750rpx;

    &-title {
        position: relative;
        height: 84rpx;
        padding-top: 10rpx;
        &__left {
            position: absolute;
            left: 0;
            bottom: 0;
            height: 84rpx;
            top: 0;
            z-index: 2;
        }
        &__title {
            @include abs(50%, null, null, 48rpx);
            transform: translateY(-50%);
            font-size: $font-lg;
            color: $color-text;
            font-weight: bold;
        }
        &__right {
            color: #fff;
            padding-left: 206rpx;
            height: 100%;
            border-top-right-radius: 16rpx;
            font-size: 0;

            .price-com {
                position: relative;
                top: 4rpx;
                &::before {
                    bottom: 4rpx;
                }
            }
            .integral-num {
                font-family: 'd-din-bold';
                font-size: 36rpx;
                margin-left: 8rpx;
            }
            .flex-1 {
                padding: 0 24rpx;
            }
            .title-elli {
                width: 100%;
                display: inline-block;
                @include ellipsis;
                font-size: 28rpx;
            }
        }
    }
    .line-block {
        position: relative;
        &::before {
            content: '';
            width: 2px;
            height: 32rpx;
            @include abs(50%, null, null, 0);
            transform: scaleX(0.5) translateY(-50%);
            background-color: #fff;
        }
    }
    &-bd {
        height: 228rpx;
        @include flex(row);
        align-items: center;
        justify-content: center;
        background: #ffffff;
        &__price,
        &__anchor {
            padding: 0 24rpx;
            &--small {
                font-size: 24rpx;
                position: relative;
                bottom: 4rpx;
            }
        }
        &__item {
            flex: 1;
            @include flex(row);
            align-items: center;
            flex-direction: column;
            font-size: 28rpx;

            &::after {
                display: none;
            }
        }
        &__text {
            font-size: 28rpx;
            margin-top: 12rpx;
            color: #333333;
        }
    }

    &-ft {
        padding: 0 24rpx;
        background-color: #fff;
        @include iosSafeArea(padding-bottom, 0px, bottom);
    }
}
</style>
