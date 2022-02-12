<template>
    <view class="c-calendar">
        <c-popup
            v-model="popupFlag_"
            :mask="popup"
            :fixed="popup"
            :mode="mode"
        >
            <view class="c-calendar__content">
                <!-- 当前日期 -->
                <view class="c-calendar-hd flex justify-center align-center">
                    <view
                        class="p24"
                        @click.stop="prev('year')"
                    >
                        <c-icons
                            type="zsuicon-towards-the-right"
                            size="36"
                            rotate="180"
                        />
                    </view>
                    <view
                        class="p24"
                        @click.stop="prev('month')"
                    >
                        <c-icons
                            type="zsuicon-tiaozhuan"
                            size="36"
                            rotate="180"
                        />
                    </view>
                    <picker
                        class="p24"
                        mode="date"
                        :value="date"
                        fields="month"
                        @change="bindDateChange"
                    >
                        <text class="c-fs-32 c-text-color">{{ `${nowDate.year ? nowDate.year + '年' : ''}${nowDate.month ? nowDate.month + '月' : ''}` }}</text>
                    </picker>
                    <view
                        class="p24"
                        @click.stop="next('month')"
                    >
                        <c-icons
                            type="zsuicon-tiaozhuan"
                            size="36"
                        />
                    </view>
                    <view
                        class="p24"
                        @click.stop="next('year')"
                    >
                        <c-icons
                            type="zsuicon-towards-the-right"
                            size="36"
                        />
                    </view>
                    <text
                        v-if="backtoday && !hasExitToday"
                        class="c-calendar__backtoday flex align-center"
                        @click="backToToday"
                    >今天</text>
                </view>
                <view class="c-calendar-bd">
                    <!-- 周日 - 周一 -->
                    <view class="flex justify-around p24 c-underline">
                        <view
                            v-for="week in weekTexts"
                            :key="week"
                            class="c-gray c-fs-24"
                        >
                            {{ week }}
                        </view>
                    </view>
                    <!-- 所有日期列表 -->
                    <view class="c-calendar-box">
                        <!-- 是否显示当前日期 -->
                        <view
                            v-if="showMonth && isExpand"
                            class="c-calendar__month"
                        >
                            <text class="c-calendar__month-text">{{ Number(nowDate.month) }}</text>
                        </view>
                        <view
                            v-for="(week,weekIndex) in weeks"
                            :key="weekIndex"
                            class="c-calendar-list flex justify-around c-plr-24"
                            :class="[
                                isExpand || expandIndex === weekIndex ? 'c-calendar-list--expand c-ptb-8' : ''
                            ]"
                        >
                            <template v-for="(day,dayIndex) in week">
                                <view
                                    :key="dayIndex"
                                    class="c-calendar-item"
                                    :class="{
                                        'is-disable':day.disable,
                                        'is-grey':day.isGrey,
                                        'is-today': day.isDay,
                                        'is-checked':(calendar.fullDate === day.fullDate && !day.isDay) ,
                                        'start-date':day.beforeMultiple,
                                        'in-range': day.multiple,
                                        'end-date':day.afterMultiple,
                                    }"
                                    @click="choiceDate(day)"
                                >
                                    <!-- 有额外信息，则添加小圆点 -->
                                    <text
                                        v-if="day.extraInfo"
                                        class="c-calendar-item__circle"
                                    ></text>
                                    <!-- 当前日期 -->
                                    <text class="c-calendar-item__text">{{ day.date }}</text>
                                    <!-- 额外信息 -->
                                    <text class="c-calendar-item__lunar-text">{{ day.extraInfo ? day.extraInfo.text : day.isDay ? '今天' : lunar ? (day.lunar.IDayCn === '初一'?day.lunar.IMonthCn:day.lunar.IDayCn) : '' }}</text>
                                </view>
                            </template>
                        </view>
                    </view>
                </view>
                <view
                    v-if="!popup && showExpand"
                    class="flex justify-center c-ptb-24"
                    @click="handleSlideToggle"
                >
                    <c-icons
                        type="zsuicon-tiaozhuan"
                        :rotate="isExpand ? -90 : 90"
                    />
                </view>
                <!-- 底部按钮 -->
                <view
                    v-if="popup && showConfirm"
                    class="c-calendar-ft p24"
                    @click="confirm"
                >
                    <c-colors
                        :pro="['bgc', 'c']"
                        :theme="[confirmColor, '#fff']"
                        type="button"
                    >

                        <c-button
                            block
                            size="large"
                            shape="circle"
                            :background="confirmColor"
                        >{{ confirmText }}</c-button>
                    </c-colors>
                </view>
                <slot name="footer" />
            </view>
        </c-popup>
    </view>
</template>

<script>
import Calendar from './util.js'
// import { defineComponent, ref, watch, computed, reactive } from 'vue'
import props from './props.js'
/**
 * Calendar 日历
 * @description 日历组件可以查看日期，选择任意范围内的日期，打点操作。常用场景如：酒店日期预订、火车机票选择购买日期、上下班打卡等
 * @tutorial https://ext.dcloud.net.cn/plugin?id=56
 * @property {String} date 自定义当前时间，默认为今天
 * @property {Boolean} lunar 显示农历
 * @property {String} startDate 日期选择范围-开始日期
 * @property {String} endDate 日期选择范围-结束日期
 * @property {Boolean} range 范围选择
 * @property {Boolean} popup = [true|false] 弹窗模式,默认为false
 * 	@value true 弹窗模式
 * 	@value false 插入模式
 * @property {Boolean} clearDate = [true|false] 弹窗模式是否清空上次选择内容
 * @property {Array} selected 打点，期待格式[{date: '2019-06-27', info: '签到', data: { custom: '自定义信息', name: '自定义消息头',xxx:xxx... }}]
 * @property {Boolean} showMonth 是否选择月份为背景
 * @event {Function} change 日期改变，`popup :ture` 时生效
 * @event {Function} confirm 确认选择`popup :true` 时生效
 * @event {Function} monthSwitch 切换月份时触发
 * @example <c-calendar :popup="true":lunar="true" :start-date="'2019-3-2'":end-date="'2019-5-20'"@change="change" />
 */
export default {
    name: 'CrabCalendar',
    props,
    data() {
        return {
            cale: {},
            // 周
            weeks: [],
            // 当前日历面板
            nowDate: {},
            // 选中日历面板
            calendar: {},
            isExpand: true,
            weekTexts: ['日', '一', '二', '三', '四', '五', '六']
        }
    },
    computed: {
        popupFlag_: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        },
        expandIndex() {
            const fullDate = this.nowDate.fullDate
            const index = Object.values(this.weeks).findIndex(week => week.filter(o => o.fullDate === fullDate).length)
            return index === -1 ? 0 : index
        },
        hasExitToday() {
            return Object.values(this.weeks).filter(week => week.filter(o => o.isDay).length).length > 0
        }
    },
    watch: {
        value(value) {
            if (value) {
                this.popup && this.clearDate && this.cale && this.cale.resetMultipleStatus()
                this.init(this.date)
            }
        },
        date(val) {
            this.init(val)
        },
        startDate(val) {
            this.cale.setSatrtDate(val)
            this.cale.setDate(this.nowDate.fullDate)
            this.weeks = this.cale.weeks
        },
        endDate(val) {
            this.cale.setEndDate(val)
            this.cale.setDate(this.nowDate.fullDate)
            this.weeks = this.cale.weeks
        },
        selected(val) {
            this.cale.setSelectInfo(this.nowDate.fullDate, val)
            this.weeks = this.cale.weeks
        }
    },
    created() {
        this.cale = new Calendar({
            selected: this.selected,
            startDate: this.startDate,
            endDate: this.endDate,
            range: this.range
        })
        if (this.value) {
            this.init(this.date)
        }
    },
    methods: {
        /**
         * 初始化日期显示
         * @param {Object} date
         */
        init(date) {
            this.cale.setDate(date)
            console.log(this.cale)
            this.weeks = this.cale.weeks
            this.nowDate = this.calendar = this.cale.getInfo(date)
        },
        bindDateChange(e) {
            const value = e.detail.value + '-1'
            this.cale.getDate(value)
            this.init(value)
        },
        /**
         * 确认按钮
         */
        confirm() {
            this.setEmit('confirm')
        },
        /**
         * 变化触发
         */
        change() {
            this.setEmit('change')
        },
        /**
         * 选择月份触发
         */
        monthSwitch() {
            const {
                year,
                month
            } = this.nowDate
            this.$emit('monthChange', {
                detail: {
                    year,
                    month: Number(month)
                }
            })
        },
        /**
         * 派发事件
         * @param {Object} name
         */
        setEmit(name) {
            const {
                year,
                month,
                date,
                fullDate,
                lunar,
                extraInfo
            } = this.nowDate
            this.$emit(name, {
                range: this.cale.multipleStatus,
                year,
                month,
                date,
                fulldate: fullDate,
                lunar,
                extraInfo: extraInfo || {}
            })
        },
        /**
         * 选择天触发
         * @param {Object} weeks
         */
        choiceDate(day) {
            if (day.disable) return
            this.nowDate = this.calendar = day
            // 设置多选
            this.cale.setMultiple(this.nowDate.fullDate)
            this.weeks = this.cale.weeks
            this.change()
        },
        /**
         * 回到今天
         */
        backToToday() {
            const date = this.cale.getDate(new Date()).fullDate
            this.init(date)
            this.change()
        },
        /**
         * 上个月
         */
        prev(str = 'month') {
            const preDate = this.cale.getDate(this.nowDate.fullDate, -1, str).fullDate
            this.setDate(preDate)
            this.monthSwitch()
        },
        /**
         * 下个月
         */
        next(str = 'month') {
            const nextDate = this.cale.getDate(this.nowDate.fullDate, +1, str).fullDate
            this.setDate(nextDate)
            this.monthSwitch()
        },
        /**
         * 设置日期
         * @param {Object} date
         */
        setDate(date) {
            this.cale.setDate(date)
            this.weeks = this.cale.weeks
            this.nowDate = this.cale.getInfo(date)
            console.log()
        },

        handleSlideToggle() {
            this.isExpand = !this.isExpand
        }
    }
}
</script>

<style lang="scss" scoped>
.c-calendar {
    @include flex;
    flex: 1;
    .c-ptb-24 {
        padding-top: 24rpx;
        padding-bottom: 24rpx;
    }
    .c-ptb-8 {
        padding-top: 8rpx;
        padding-bottom: 8rpx;
    }
    .c-fs-24 {
        font-size: 24rpx;
    }
    &__content {
        background-color: #fff;
    }
    &-hd {
        height: 100rpx;
        position: relative;
    }
    &-bd {
        position: relative;
    }
    &__backtoday {
        @include site(null, 0);
        padding: 0 20rpx;
        padding-left: 20rpx;
        height: 50rpx;
        font-size: 24rpx;
        border-radius: 50rpx 0 0 50rpx;
        color: $color-text;
        background-color: $bg-color-hover;
    }
    &__month {
        @include flex;
        justify-content: center;
        align-items: center;
        @include siteCenter;
        pointer-events: none;
        &-text {
            font-size: 200px;
            font-weight: bold;
            color: rgba($color: $color-gray, $alpha: 0.1);
        }
    }
    &-box {
        overflow: hidden;
        position: relative;
    }
    &-list {
        max-height: 0;
        @include tst;
        overflow: hidden;
        &--expand {
            max-height: 150rpx;
        }
    }
    &-item {
        flex: 1;
        @include flex(column);
        justify-content: center;
        align-items: center;
        position: relative;
        height: 100rpx;
        @include tst;
        &__text {
            font-size: $font-base;
            color: $color-text;
        }

        &__lunar-text {
            font-size: 0.8 * $font-sm;
            color: $color-gray;
        }
        &.is-disable,
        &.is-grey {
            opacity: 0.45;
        }
        &.is-disable {
            cursor: not-allowed;
        }
        &.is-today {
            .c-calendar-item {
                &__text,
                &__lunar-text {
                    color: $calendar-color;
                }
            }
        }
        &.in-range {
            opacity: 1;
            background-color: rgba($color: $calendar-color, $alpha: 0.1);
            .c-calendar-item {
                &__text,
                &__lunar-text {
                    color: $calendar-color;
                }
            }
        }
        &.is-checked,
        &.start-date,
        &.end-date {
            opacity: 1;
            background-color: $calendar-color;
            color: #fff;
            .c-calendar-item {
                &__text,
                &__lunar-text {
                    color: #fff;
                }
            }
        }
        &.is-checked {
            border-radius: $border-radius-base;
        }
        &.start-date {
            border-radius: $border-radius-base 0 0 $border-radius-base;
        }
        &.end-date {
            border-radius: 0 $border-radius-base $border-radius-base 0;
        }
        &__circle {
            @include abs(10rpx, 10rpx);
            width: 16rpx;
            height: 16rpx;
            border-radius: 100%;
            background-color: $color-danger;
        }
    }
}
</style>
