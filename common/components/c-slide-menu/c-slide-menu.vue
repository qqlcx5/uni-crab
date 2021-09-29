<template>
    <view
        class="slideMenu"
        :style="{ zIndex: zIndex }"
    >
        <!-- 客服 -->
        <view
            v-if="contactBtn || shopInfo_.customer_index"
            class="item"
        >
            <view
                v-if="contactBtn || shopInfo_.customer_type && shopInfo_.customer_type === 1"
                class="item-button"
            >
                <!-- #ifdef MP-WEIXIN -->
                <c-button
                    open-type="contact"
                    bindcontact="handleContact"
                    height="110"
                >
                    <c-image
                        src="home/kefu.png"
                        size="110"
                        radius="56"
                        mode="aspectFill"
                    />
                </c-button>
                <!-- #endif -->
            </view>
            <view
                v-else
                @tap.stop="handleCustomerService"
            >
                <c-image
                    src="home/kefu.png"
                    size="110"
                    radius="56"
                    mode="aspectFill"
                    @click="handleClick"
                />
            </view>
        </view>
    </view>
</template>
<script>
import {
    mapState
} from 'vuex'
export default {
    props: {
        contactBtn: { // 集速配物流
            type: Boolean,
            default: false
        },
        zIndex: {
            type: [String, Number],
            default: 20
        }
    },
    computed: {
        ...mapState({
            shopInfo_: (state) =>
                state.config.shopInfo ? state.config.shopInfo : {}
        })
    },
    methods: {
        handleClick() {
            const url = this.shopInfo_.customer_url
            if (!url) return this.$toast('未配置地址')
            this.$serverJump({
                app_page: /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g.test(url) ? url : this.$config
                    .hostUrl + url
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.slideMenu {
    position: fixed;
    right: 30rpx;
    @include iosSafeArea(bottom, 180rpx, bottom);

    .item {
        margin-top: 20rpx;
        padding: 0;
        background-color: transparent;
        .item-button {
            background-color: transparent;
        }
        /deep/ button {
            padding: 0;
        }

        &::after {
            display: none;
        }
    }
}
</style>
