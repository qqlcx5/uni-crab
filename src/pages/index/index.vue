<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-09-29 10:00:57
-->
<template>
    <view class="content">
        <c-top-search
            v-model="pwd"
            placeholder-style="color: red"
        />
        <c-input
            v-model="pwd"
            displayable
        />
        <view class="mt24">
            使用c-colors有效
            <c-colors
                :pro="['bgc', 'c']"
                :theme="['#f00', '#fff']"
                type="button"
            >
                <c-button radius="16">继承按钮</c-button>
            </c-colors>
        </view>
        <view class="mt24">
            使用c-colors无效
            <c-colors
                :pro="['bgc', 'c']"
                :theme="['#f00', '#fff']"
                type="button"
            >
                <c-button
                    type="success"
                    radius="16"
                >非继承按钮</c-button>
            </c-colors>
        </view>
        <c-modal
            v-model="modalFlag"
            custom-class="saas-ui-modal"
        >
            <view class="flex-ajcenter">
                <image src="/static/logo.png" />
            </view>
        </c-modal>
        <c-button
            class="mt24"
            type="success"
            radius="16"
            @click="calendarFlag = true"
        >显示日历</c-button>
        <c-keyboard
            v-model="calendarFlag"
            mode="car"
        />
        <c-fixed-menu
            position="bottom"
            height="124"
        >
            <view class="p24">
                <c-colors
                    :pro="['bgc', 'c']"
                    :theme="['#f00', '#fff']"
                    type="button"
                >
                    <c-button
                        type="success"
                        radius="16"
                        @click="handleModal"
                    >弹窗测试</c-button>
                </c-colors>
            </view>
        </c-fixed-menu>
    </view>
</template>

<script>
export default {
    data() {
        return {
            title: 'Hello',
            modalFlag: false,
            pwd: '',
            calendarFlag: true
        }
    },
    async onLoad() {
        this.sayHello()
        this.$c.logHello()
        this.$config.config
        console.log('框架名称', this.$config.libName)
        console.log('加:', this.$c.calcFn.add(1.1, 2))
        console.log('减:', this.$c.calcFn.sub(1.1, 2))
        console.log('乘:', this.$c.calcFn.mul(1.1, 2))
        console.log('除:', this.$c.calcFn.divide(1.2, 2))
        try {
            this.$http('shopInfo')
            console.log(111)
        } catch (error) {
            console.log(error)
        }
        uni.$on('pageScroll', () => {
            console.log('pageScroll')
        })
    },
    methods: {
        handleModal() {
            this.modalFlag = true
        }
    }
}
</script>

<style lang="scss">
.saas-ui-modal {
    /deep/ .c-btn {
        background-color: red !important;
    }
}
.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.logo {
    height: 200rpx;
    width: 200rpx;
    margin: 200rpx auto 50rpx auto;
}

.text-area {
    display: flex;
    justify-content: center;
}

.title {
    font-size: 36rpx;
    color: #8f8f94;
}
</style>
