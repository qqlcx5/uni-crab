<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-09-29 10:00:57
-->
<template>
    <view class="content">
        <image
            class="logo"
            src="/static/logo.png"
        ></image>
        <view>
            <text class="title">{{title}}</text>
            <c-button type="primary">1</c-button>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            title: 'Hello'
        }
    },
    async onLoad() {
        this.$c.cloga()
        try {
            this.$http('shopInfo')
            console.log(111);
        } catch (error) {
            console.log(error);
        }
    },
    methods: {

    }
}
</script>

<style>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
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
