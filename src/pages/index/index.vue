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
            placeholder="呵呵哈哈哈"
            :placeholder-style="{color:'red'}"
        />
        <view class="c-mt-24">
            使用c-colors有效
            <c-colors
                :pro="['bgc', 'c']"
                :theme="['#f00', '#fff']"
                type="button"
            >
                <c-button radius="16">继承按钮</c-button>
            </c-colors>
        </view>
        <view class="c-mt-24">
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
            <view class="c-flex-ajcenter">
                <image src="/static/logo.png" />
            </view>
        </c-modal>
        <c-button
            class="c-mt-24"
            type="success"
            radius="16"
            @click="calendarFlag = true"
        >显示日历</c-button>
        <!-- 日历弹窗 -->
        <!-- v-model="calendarFlag" -->
        <c-calendar :popup="false" />
        <c-button
            class="c-mt-24"
            type="success"
            radius="16"
            @click="keyboardFlag = true,keyboardMode = 'number',keyboardSimple = true"
        >显示数字键盘</c-button>
        <c-button
            class="c-mt-24"
            type="success"
            radius="16"
            @click="keyboardFlag = true,keyboardMode = 'number',keyboardSimple = false"
        >显示数字键盘-含清空</c-button>
        <c-button
            class="c-mt-24"
            type="success"
            radius="16"
            @click="keyboardFlag = true,keyboardMode = 'car'"
        >显示车牌键盘</c-button>
        <!-- 键盘弹窗 -->
        <c-keyboard
            v-model="keyboardFlag"
            :mode="keyboardMode"
            :simple="keyboardSimple"
        />
        <c-radio-group>
            <c-radio>111</c-radio>
        </c-radio-group>
        <c-checkbox-group>
            <c-checkbox>111</c-checkbox>
            <c-checkbox>222</c-checkbox>
        </c-checkbox-group>
        <c-fixed-menu
            position="bottom"
            height="124"
            destroy-ele
        >
            <view class="c-p-24">
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
        <!-- <c-tabbar @tabbarheightchange="handleTabbarHeightChange" /> -->
    </view>
</template>

<script>
export default {
    data() {
        return {
            title: 'Hello',
            modalFlag: false,
            pwd: '',
            calendarFlag: false,
            keyboardFlag: false,
            keyboardSimple: false,
            keyboardMode: 'number'
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
        } catch (error) {
            console.log(error)
        }
        uni.$on('pageScroll', () => {
            console.log('pageScroll')
        })
    },
    methods: {
        handleTabbarHeightChange(e) {
            console.log(e)
        },
        handleModal() {
            this.modalFlag = true
        }
    }
}
</script>

<style lang="scss">
.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 24rpx;
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
