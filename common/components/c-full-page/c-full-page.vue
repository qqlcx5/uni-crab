<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: sky
 * @Date: 2021-07-12 10:27:18
-->
<template>
    <view class="full-page-container">
        <view
            class="full-page-main"
            :style="style"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
        >
            <slot />
        </view>
    </view>
</template>

<script>
export default {
    name: 'FullPage',
    props: {
        // 触发翻页的临界值
        critical: {
            type: Number,
            default: 200
        },
        // 总共页面数
        totalPage: {
            type: Number,
            required: true,
            default: 0
        },
        // 当前页面的索引值
        activeIndex: {
            type: Number,
            required: true,
            default: 0
        },
        // 当前页面的索引值
        status: {
            type: Number,
            required: true,
            default: 0
        }
    },
    data() {
        return {
            pageIndex: 0, // 当前页面的索引值
            startPageX: 0, // 开始的X位置
            startPageY: 0, // 开始的Y位置
            endPageX: 0, // 结束的X位置
            endPageY: 0, // 结束的Y位置
            marginTop: 0, // 滑动下拉(上拉)距离
            timeStart: 0, // 滑动开始时间
            timeEnd: 0, // 滑动结束时间
            shortTime: 300 // 时间差
        }
    },
    computed: {
        style() {
            return `transform:translate3d(0, -${this.pageIndex * 100}%, 0); margin-top: ${this.marginTop}px`
        }
    },
    watch: {
        activeIndex(value) {
            this.pageIndex = value
        },

        // 此字段用于解决内层swiper滑动，current不更新视图的问题，而增加的
        status: {
            handler(val) {
                this.marginTop = 1
                setTimeout(() => {
                    this.marginTop = 0
                }, 100)
            },
            immediate: true
        }
    },
    mounted() {
        this.pageIndex = this.activeIndex
    },
    methods: {
        // 开始滑动
        handleTouchStart(e) {
            this.timeStart = (new Date()).getTime()
            const { pageX, pageY } = e.touches[0]
            this.startPageX = pageX
            this.startPageY = pageY
        },
        // 滑动中
        handleTouchMove(e) {
            const { pageX, pageY } = e.touches[0]
            if (pageY - this.startPageY < this.critical && pageY - this.startPageY > -this.critical) {
                this.marginTop = pageY - this.startPageY
            }
            this.endPageX = pageX
            this.endPageY = pageY
        },
        // 滑动结束
        handleTouchEnd() {
            this.timeEnd = (new Date()).getTime()
            const timeDiff = this.timeEnd - this.timeStart
            /* console.log('timeDiff', timeDiff);
            console.log('endPageX', this.endPageX);
            console.log('startPageX', this.startPageX);
            console.log('endPageY', this.endPageY);
            console.log('startPageY', this.startPageY);
            console.log('endPageY-startPageY', this.endPageY - this.startPageY);
            console.log('(this.endPageY - this.startPageY) > (this.endPageX - this.startPageX)', (this.endPageY - this.startPageY) > (this.endPageX - this.startPageX)); */

            if (!this.endPageY) {
                return
            }
            // 上下偏移量必须大于左右偏移量
            if (Math.abs(this.endPageY - this.startPageY) > Math.abs(this.endPageX - this.startPageX)) {
                if (timeDiff <= this.shortTime) {
                    // 下滑，上一页
                    if (this.endPageY - this.startPageY > 0 && this.pageIndex > 0) {
                        this.pageIndex -= 1
                    }
                    // 上滑，下一页
                    if (this.endPageY - this.startPageY < 0 && this.pageIndex < this.totalPage - 1) {
                        this.pageIndex += 1
                    }
                } else {
                    // 下滑，上一页
                    if (this.endPageY - this.startPageY > this.critical) {
                        this.pageIndex -= 1
                    }
                    // 上滑，下一页
                    if (this.endPageY - this.startPageY < -this.critical && this.pageIndex < this.totalPage - 1) {
                        this.pageIndex += 1
                    }
                }
            }
            this.$emit('update:activeIndex', this.pageIndex)
            this.startPageY = 0
            this.endPageY = 0
            this.marginTop = 0
        }
    }
}
</script>

<style lang="scss" scoped>
.full-page-container {
    height: 100%;
    overflow: hidden;
    .full-page-main {
        height: 100%;
        transition: all 0.5s;
    }
}
</style>
