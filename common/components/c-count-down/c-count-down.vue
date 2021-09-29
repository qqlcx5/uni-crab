<template>
    <view class="c-countdown d-din">
        <c-colors
            :theme="theme_"
            :pro="['bgc', 'c']"
            radius="8"
            :style="{height: itemStyle.height}"
        >
            <view
                v-if="showDays && (hideZeroDay || (!hideZeroDay && d != '00'))"
                class="c-countdown-item"
                :style="[itemStyle]"
            >
                <view
                    class="c-countdown-time"
                    :style="[letterStyle]"
                >
                    {{ d }}
                </view>
            </view>
        </c-colors>
        <c-colors :theme="separatorColor_">
            <view
                v-if="showDays && (hideZeroDay || (!hideZeroDay && d != '00'))"
                class="c-countdown-colon"
                :style="[ separatorStyle_ ]"
            >
                {{ separator == 'colon' ? ':' : '天' }}
            </view>
        </c-colors>
        <c-colors
            :theme="theme_"
            :pro="['bgc', 'c']"
            radius="8"
            :style="{height: itemStyle.height}"
        >
            <view
                v-if="showHours"
                class="c-countdown-item"
                :style="[itemStyle]"
            >
                <view
                    class="c-countdown-time"
                    :style="{ fontSize: fontSize + 'rpx', color: color}"
                >
                    {{ h }}
                </view>
            </view>
        </c-colors>
        <c-colors :theme="separatorColor_">
            <view
                v-if="showHours"
                class="c-countdown-colon"
                :style="[ separatorStyle_ ]"
            >
                {{ separator == 'colon' ? ':' : '时' }}
            </view>
        </c-colors>
        <c-colors
            :theme="theme_"
            :pro="['bgc', 'c']"
            radius="8"
            :style="{height: itemStyle.height}"
        >
            <view
                v-if="showMinutes"
                class="c-countdown-item"
                :style="[itemStyle]"
            >
                <view
                    class="c-countdown-time"
                    :style="{ fontSize: fontSize + 'rpx', color: color}"
                >
                    {{ i }}
                </view>
            </view>
        </c-colors>
        <c-colors :theme="separatorColor_">
            <view
                v-if="showMinutes"
                class="c-countdown-colon"
                :style="[ separatorStyle_ ]"
            >
                {{ separator == 'colon' ? ':' : '分' }}
            </view>
        </c-colors>
        <c-colors
            :theme="theme_"
            :pro="['bgc', 'c']"
            radius="8"
            :style="{height: itemStyle.height}"
        >
            <view
                v-if="showSeconds"
                class="c-countdown-item"
                :style="[itemStyle]"
            >
                <view
                    class="c-countdown-time"
                    :style="{ fontSize: fontSize + 'rpx', color: color}"
                >
                    {{ s }}
                </view>
            </view>
        </c-colors>
        <c-colors :theme="separatorColor_">
            <view
                v-if="showSeconds && separator == 'zh'"
                class="c-countdown-colon"
                :style="[ separatorStyle_ ]"
            >
                秒
            </view>
        </c-colors>
    </view>
</template>

<script>
import TimeUtil from '../../utils/countDown.js'
/**
 * countDown 倒计时
 * @description 该组件一般使用于某个活动的截止时间上，通过数字的变化，给用户明确的时间感受，提示用户进行某一个行为操作。
 * @tutorial https://www.uviewui.com/components/countDown.html
 * @property {String Number} timestamp 倒计时，单位为秒
 * @property {Boolean} autoplay 是否自动开始倒计时，如果为false，需手动调用开始方法。见官网说明（默认true）
 * @property {String} separator 分隔符，colon为英文冒号，zh为中文（默认colon）
 * @property {String Number} separator-size 分隔符的字体大小，单位rpx（默认30）
 * @property {String} separator-color 分隔符的颜色（默认#303133）
 * @property {String Number} font-size 倒计时字体大小，单位rpx（默认30）
 * @property {Boolean} show-border 是否显示倒计时数字的边框（默认false）
 * @property {Boolean} hide-zero-day 当"天"的部分为0时，隐藏该字段 （默认true）
 * @property {String} border-color 数字边框的颜色（默认#303133）
 * @property {String} bg-color 倒计时数字的背景颜色（默认#ffffff）
 * @property {String} color 倒计时数字的颜色（默认#303133）
 * @property {String} height 数字高度值(宽度等同此值)，设置边框时看情况是否需要设置此值，单位rpx（默认auto）
 * @property {Boolean} show-days 是否显示倒计时的"天"部分（默认true）
 * @property {Boolean} show-hours 是否显示倒计时的"时"部分（默认true）
 * @property {Boolean} show-minutes 是否显示倒计时的"分"部分（默认true）
 * @property {Boolean} show-seconds 是否显示倒计时的"秒"部分（默认true）
 * @event {Function} end 倒计时结束
 * @event {Function} change 每秒触发一次，回调为当前剩余的倒计秒数
 * @example <c-count-down ref="uCountDown" :timestamp="86400" :autoplay="false"></c-count-down>
 */
export default {
    name: 'CCountDown',
    props: {
        // 倒计时的时间，秒为单位
        timestamp: {
            type: [Number, String],
            default: 0
        },
        timeObj: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 用英文冒号(colon)或者中文(zh)当做分隔符，false的时候为中文，如："11:22"或"11时22秒"
        separator: {
            type: String,
            default: 'colon'
        },
        // 分隔符的大小，单位rpx
        separatorSize: {
            type: [Number, String],
            default: 30
        },
        // 分隔符颜色
        separatorColor: {
            type: String,
            default: 'inherit'
        },
        // 字体颜色
        color: {
            type: String,
            default: 'inherit'
        },
        // 字体大小，单位rpx
        fontSize: {
            type: [Number, String],
            default: 30
        },
        // 背景颜色
        bgColor: {
            type: String,
            default: 'inherit'
        },
        // 数字框高度，单位rpx
        height: {
            type: [Number, String],
            default: 'auto'
        },
        // 是否显示数字框
        showBorder: {
            type: Boolean,
            default: false
        },
        // 边框颜色
        borderColor: {
            type: String,
            default: 'inherit'
        },
        // 是否显示秒
        showSeconds: {
            type: Boolean,
            default: true
        },
        // 是否显示分钟
        showMinutes: {
            type: Boolean,
            default: true
        },
        // 是否显示小时
        showHours: {
            type: Boolean,
            default: true
        },
        // 是否显示“天”
        showDays: {
            type: Boolean,
            default: true
        },
        // 当"天"的部分为0时，不显示
        hideZeroDay: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            d: '00', // 天的默认值
            h: '00', // 小时的默认值
            i: '00', // 分钟的默认值
            s: '00', // 秒的默认值
            firstZero: true, //
            time: null
        }
    },
    computed: {
        theme_() {
            const color = this.color !== 'inherit' ? this.color : '#fff'
            const bgColor = this.bgColor !== 'inherit' ? this.bgColor : 't'
            if (this.bgColor === 'transparent') {
                return ['transparent', 't']
            }
            return [bgColor, color]
        },
        separatorColor_() {
            const color = this.separatorColor !== 'inherit' ? this.separatorColor : (this.bgColor !== 'transparent' ? 't' : this.color)
            return [color]
        },
        // 倒计时item的样式，item为分别的时分秒部分的数字
        itemStyle() {
            const style = {}
            let height = 0
            if (this.height !== 'auto') {
                height = this.height
                style.height = height + 'rpx'
                style.minWidth = this.height + 'rpx'
            } else {
                height = Math.floor(uni.upx2px(1.4 * this.fontSize))
                style.height = height + 'px'
                style.minWidth = height + 'px'
            }
            style.lineHeight = style.height
            style.paddingTop = Math.ceil(height / 18) + 'px'
            if (this.showBorder) {
                style.borderStyle = 'solid'
                style.borderColor = this.borderColor
                style.borderWidth = '1px'
            }
            if (this.bgColor) {
                style.backgroundColor = this.bgColor
            }
            return style
        },
        separatorStyle_() {
            return {
                height: this.itemStyle.height,
                fontSize: this.separatorSize + 'rpx',
                color: this.separatorColor,
                paddingBottom: this.separator === 'colon' ? '4rpx' : 0
            }
        },
        // 倒计时数字的样式
        letterStyle() {
            const style = {}
            if (this.fontSize) style.fontSize = this.fontSize + 'rpx'
            if (this.color) style.color = this.color
            return style
        }
    },
    watch: {
        timeObj: {
            handler(val) {
                if (Object.keys(val).length) {
                    this.handleInit(val)
                    return
                }
            }
        },
        timestamp: {
            handler(val) {
                if (!val) return
                this.time && this.time.end()
                this.time = new TimeUtil()
                this.time.addTask(val)
                this.time.start((res) => {
                    if (res[0].timestamp <= 0 && this.firstZero) {
                        this.firstZero = false
                        this.$emit('zero', true)
                        this.time.end()
                    }
                    this.handleInit(res[0].time)
                })
            },
            immediate: true
        }
    },
    mounted() { },
    created() { },
    beforeDestroy() {
        this.time && this.time.end()
    },
    methods: {
        handleInit(res) {
            this.d = res.day
            this.h = res.showHour
            this.i = res.minute
            this.s = res.second
        }
    }
}
</script>

<style ang="scss" scoped>
.c-countdown {
    padding: 0 4rpx;
    /* #ifndef APP-NVUE */
    display: inline-flex;
    /* #endif */
    align-items: center;
}

.c-countdown-item {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6rpx;
    white-space: nowrap;
    transform: translateZ(0);
    vertical-align: middle;
}

.c-countdown-time {
    margin: 0;
    padding: 0;
    line-height: 1;
}

.c-countdown-colon {
    display: flex;
    justify-content: center;
    line-height: 1;
    padding: 0 4rpx;
    align-items: center;
    padding-bottom: 4rpx;
}

.c-countdown-scale {
    transform: scale(0.9);
    transform-origin: center center;
}
</style>
