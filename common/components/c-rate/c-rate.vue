<template>
    <view class="c-rate">
        <!-- {{scoreList}} -->
        <view
            v-for="(item, index) in scoreList"
            :key="index"
            class="c-rate__item"
            :style="{ 'padding-right': index !== scoreList.length - 1 ? gutter : '' }"
        >
            <c-icons
                :size="size"
                :color="disabled ? disabledColor : item.value <= tempValue ? color : voidColor"
                :type="item.value <= tempValue ? icon : voidIcon"
                @tap.stop="handleTap(item)"
            />
        </view>

        <text
            v-if="!!showValueText"
            class="c-rate-text"
            :style="{ 'color' : valueTextColor }"
        >{{ curValueText }}</text>
    </view>
</template>

<script>
export default {
    props: {
        // 当前分值
        value: {
            type: [Number, String],
            default: 50
        },
        // 图标总数
        count: {
            type: [Number, String],
            default: 5
        },
        // 图标尺寸
        size: {
            type: String,
            default: '44rpx'
        },
        // 选中图标名称
        icon: {
            type: String,
            default: 'icon-shoucangdianpuxuanzhong'
        },
        // 未选中图标名称
        voidIcon: {
            type: String,
            default: 'icon-shoucangdianpu'
        },
        // 选中图标颜色
        color: {
            type: String,
            default: '#FF5B09'
        },
        // 未选中图标颜色
        voidColor: {
            type: String,
            default: '#B8B8B8'
        },
        // 禁用下图标颜色
        disabledColor: {
            type: String,
            default: '#bdbdbd'
        },
        // 图标间隔
        gutter: {
            type: String,
            default: '16rpx'
        },
        // 是否可触摸
        touchable: {
            type: Boolean,
            default: true
        },
        // 是否只读
        readonly: {
            type: Boolean,
            default: false
        },
        // 是否禁用
        disabled: {
            type: Boolean,
            default: false
        },
        // 是否显示星数对应文本
        showValueText: {
            type: Boolean,
            default: false
        },
        valueTextColor: {
            type: String,
            default: '#FF5B09'
        },
        // 星数对应文本数据
        scoreList: {
            type: Array,
            default: () => []
        }

    },
    data() {
        return {
            curValueText: '',
            tempValue: null
        }
    },
    watch: {
        value: {
            handler(val) {
                this.tempValue = val
                // console.log(val)
                // 抛出事件
                this.$emit('input', val)
                this.$emit('change', val)

                // 因为this.scoreList的数据来源父组件接口请求，故需要延时一下执行
                setTimeout(() => {
                    // console.log(this.scoreList.filter(item => item.value === val))
                    this.curValueText = this.scoreList.filter(item => item.value === val)[0].title
                }, 100)
            },
            immediate: true
        }
    },
    mounted() {
        this.init()
    },
    methods: {

        // 初始化
        init() {
            /*  this.tempValue = this.value
             console.log('value', this.value)
             console.log('tempValue', this.tempValue) */
        },

        // 星星点击事件
        handleTap(item) {
            // 只读、禁用
            if (this.readonly || this.disabled) return
            // 星数对应的文本
            this.curValueText = item.title
            // 得星数
            this.tempValue = item.value

            console.log('value', this.value, 'tempValue', this.tempValue)

            // 抛出事件
            this.$nextTick(() => {
                this.$emit('input', item.value)
                this.$emit('change', item.value)
            })
        }
    }

}
</script>

<style lang="scss" scoped>
.c-rate {
    @include flex(row);
    align-items: center;
    &-text {
        margin-left: 40rpx;
        font-weight: bold;
    }
}
</style>
