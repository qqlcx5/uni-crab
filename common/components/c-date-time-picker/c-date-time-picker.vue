<template>
    <picker
        mode="multiSelector"
        :range="range"
        range-key="text"
        :value="value"
        :disabled="disabled"
        @change="change"
        @columnchange="columnchange"
        @cancel="cancel"
    >
        <view
            class="content"
            :class="{ placeholder: !dateStr }"
        >
            <text :class="{ 'txt-gray-ccc' : dateStr == ''}">{{ dateStr ? dateStr : placeholder }}</text>
        </view>
    </picker>
</template>

<script>
import utils from './utils.js' // 封装的工具集
export default {
    /**
     * 数据
     */
    props: {
        // 是否禁用
        disabled: {
            type: Boolean,
            default: false
        },

        // 占位符
        placeholder: {
            type: String,
            default: ''
        },

        // 表示有效日期时间范围的开始，
        // 字符串格式为 "YYYY-MM-DD hh:mm"
        start: {
            type: String,
            default: '1970-1-1 00:00'
        },

        // 表示有效日期时间范围的结束
        // 字符串格式为 "YYYY-MM-DD hh:mm"
        end: {
            type: String,
            default: '2300-1-1 00:00'
        },

        // 表示选择器的粒度，有效值：year | month | day | hour | minute
        fields: {
            type: String,
            default: 'minute'
        },

        // 默认值
        // 字符串格式为 "YYYY-MM-DD hh:mm"
        defaultValue: {
            type: String,
            default: ''
        }
    },

    /**
     * 数据
     */
    data() {
        return {
            range: [],
            value: [],
            dateStr: '', // 最终显示的字符串
            dtStart: null, // 有效范围开始
            dtEnd: null // 有效范围结束
        }
    },

    /**
     * 监听数据
     */
    watch: {
        // 默认值
        defaultValue() {
            // 设置默认值
            this.setDefaultValue()
        },
        start(newVal, oldVal) {
            if (newVal == oldVal) return
            this.getInit()
        },
        // 默认值
        end(newVal, oldVal) {
            if (newVal == oldVal) return
            this.getInit()
        }
    },

    /**
     * 组件初次加载完成
     */
    mounted() {
        this.getInit()
    },

    /**
     * 方法
     */
    methods: {
        getInit() {
            // 有效日期开始和结束
            let start = this.start
            const end = this.end

            // 验证是否是有效的开始和结束日期
            if (!utils.isString(this.start)) {
                console.log('开始日期需为String类型，格式为 "YYYY-MM-DD hh:mm"')
                start = '1970-1-1 00:00'
            }
            if (!utils.isString(this.start)) {
                console.log('结束日期需为String类型，格式为 "YYYY-MM-DD hh:mm"')
                start = '2300-1-1 00:00'
            }

            // 将开始日期和结束日期转为 Date 
            const dtStart = utils.formatDate(start).dt
            let dtEnd = utils.formatDate(end).dt

            // 判断有效日期结束是否大于有效日期开始，如果不是，则将有效日期结束修改为有效日期开始往后300年
            if (dtEnd <= dtStart) {
                dtEnd = utils.formatDate(start).dt
                dtEnd.setFullYear(dtStart.getFullYear() + 300)
                dtEnd.setDate(dtEnd.getDate() - 1)
            }

            // 更新开始日期和结束日期
            this.dtStart = dtStart
            this.dtEnd = dtEnd

            // 设置默认值
            this.setDefaultValue()
        },
        /**
         * 确认选择
         */
        change(event) {
            let year, month, day, hour, minute
            if (this.fields == 'year') {
                year = this.range[0][this.value[0]].number // 年
                const dtStr = `${year}`
                this.setDateStr(dtStr)
                this.$emit('change', utils.formatDate(dtStr))
                return
            } else if (this.fields == 'month') {
                year = this.range[0][this.value[0]].number // 年
                month = this.range[1][this.value[1]].number // 月
                const dtStr = `${year}-${month}`
                this.setDateStr(dtStr)
                this.$emit('change', utils.formatDate(dtStr))
                return
            } else if (this.fields == 'day') {
                year = this.range[0][this.value[0]].number // 年
                month = this.range[1][this.value[1]].number // 月
                day = this.range[2][this.value[2]].number // 日
                const dtStr = `${year}-${month}-${day}`
                this.setDateStr(dtStr)
                this.$emit('change', utils.formatDate(dtStr))
                return
            } else if (this.fields == 'hour') {
                year = this.range[0][this.value[0]].number // 年
                month = this.range[1][this.value[1]].number // 月
                day = this.range[2][this.value[2]].number // 日
                hour = this.range[3][this.value[3]].number // 时
                day = this.range[2][this.value[2]].number // 日
                const dtStr = `${year}-${month}-${day} ${hour}`
                this.setDateStr(dtStr)
                this.$emit('change', utils.formatDate(dtStr))
                return
            } else if (this.fields == 'minute') {
                year = this.range[0][this.value[0]].number // 年
                month = this.range[1][this.value[1]].number // 月
                day = this.range[2][this.value[2]].number // 日
                hour = this.range[3][this.value[3]].number // 时
                minute = this.range[4][this.value[4]].number // 分
                const dtStr = `${year}-${month}-${day} ${hour}:${minute}`
                this.setDateStr(dtStr)
                this.$emit('change', utils.formatDate(dtStr))
                return
            }
        },

        /**
         * 设置显示的值
         * @param {Date|String} date 日期字符串或日期对象
         */
        setDateStr(date) {
            const dt = utils.formatDate(date)
            if (this.fields == 'year') {
                this.dateStr = `${dt.YYYY}年`
                return
            }
            if (this.fields == 'month') {
                this.dateStr = `${dt.YYYY}年${dt.M}月`
                return
            }
            if (this.fields == 'day') {
                this.dateStr = `${dt.YYYY}年${dt.M}月${dt.D}日`
                return
            }
            if (this.fields == 'hour') {
                this.dateStr = `${dt.YYYY}年${dt.M}月${dt.D}日 ${dt.h}时`
                return
            }
            this.dateStr = `${dt.YYYY}-${this.getNow(dt.M)}-${this.getNow(dt.D)} ${this.getNow(dt.h)}:${this.getNow(dt.m)}`
        },

        /**
         * 设置年数据
         */
        setYearData() {
            // 有效日期
            const yearStart = this.dtStart.getFullYear()
            const yearEnd = this.dtEnd.getFullYear()
            // 年
            const years = []
            for (let year = yearStart; year <= yearEnd; year++) {
                const item = {
                    number: year,
                    text: `${year}年`
                }
                years.push(item)
            }
            this.range.splice(0, 1, years)
        },

        /**
         * 设置月数据
         * @param {Number} year 年 
         */
        setMonthData(year) {
            // 有效日期
            const yearStart = this.dtStart.getFullYear()
            const monthStart = this.dtStart.getMonth() + 1
            const yearEnd = this.dtEnd.getFullYear()
            const monthEnd = this.dtEnd.getMonth() + 1

            // 月
            const months = []
            const monthStartIndex = year == yearStart ? monthStart : 1
            const monthEndIndex = year == yearEnd ? monthEnd : 12
            for (let month = monthStartIndex; month <= monthEndIndex; month++) {
                const monthVal = this.getNow(month)
                const item = {
                    number: monthVal,
                    text: `${monthVal}月`
                }
                months.push(item)
            }
            this.range.splice(1, 1, months)
        },

        /**
         * 设置日数据
         * @param {Number} year 年 
         * @param {Number} month 月 
         */
        setDayData(year, month) {
            // 有效日期
            const yearStart = this.dtStart.getFullYear()
            const monthStart = this.dtStart.getMonth() + 1
            const dayStart = this.dtStart.getDate()
            const yearEnd = this.dtEnd.getFullYear()
            const monthEnd = this.dtEnd.getMonth() + 1
            const dayEnd = this.dtEnd.getDate()

            // 日
            const days = []
            const dayStartIndex = year == yearStart && month == monthStart ? dayStart : 1
            let dayEndIndex
            if (year == yearEnd && month == monthEnd) {
                dayEndIndex = dayEnd
            } else {
                dayEndIndex = (new Date(year, month, 0)).getDate()
            }
            for (let day = dayStartIndex; day <= dayEndIndex; day++) {
                const dayVal = this.getNow(day)
                const item = {
                    number: dayVal,
                    text: `${dayVal}日`
                }
                days.push(item)
            }
            this.range.splice(2, 1, days)
        },

        /**
         * 设置时数据
         * @param {Number} year 年 
         * @param {Number} month 月 
         * @param {Number} day 日 
         */
        setHourData(year, month, day) {
            // 有效日期
            const yearStart = this.dtStart.getFullYear()
            const monthStart = this.dtStart.getMonth() + 1
            const dayStart = this.dtStart.getDate()
            const hourStart = this.dtStart.getHours()
            const yearEnd = this.dtEnd.getFullYear()
            const monthEnd = this.dtEnd.getMonth() + 1
            const dayEnd = this.dtEnd.getDate()
            const hourEnd = this.dtEnd.getHours()

            // 时
            const hours = []
            const hourStartIndex = year == yearStart && month == monthStart && day == dayStart ? hourStart : 0
            const hourEndIndex = year == yearEnd && month == monthEnd && day == dayEnd ? hourEnd : 23
            for (let hour = hourStartIndex; hour <= hourEndIndex; hour++) {
                const hourVal = this.getNow(hour)
                const item = {
                    number: hourVal,
                    text: `${hourVal}时`
                }
                hours.push(item)
            }
            this.range.splice(3, 1, hours)
        },

        /**
         * 设置分数据
         * @param {Number} year 年 
         * @param {Number} month 月 
         * @param {Number} day 日
         * @param {Number} hour 时
         */
        setMinuteData(year, month, day, hour) {
            // 有效日期
            const yearStart = this.dtStart.getFullYear()
            const monthStart = this.dtStart.getMonth() + 1
            const dayStart = this.dtStart.getDate()
            const hourStart = this.dtStart.getHours()
            const minuteStart = this.dtStart.getMinutes()
            const yearEnd = this.dtEnd.getFullYear()
            const monthEnd = this.dtEnd.getMonth() + 1
            const dayEnd = this.dtEnd.getDate()
            const hourEnd = this.dtEnd.getHours()
            const minuteEnd = this.dtEnd.getMinutes()

            // 分
            const minutes = []
            const minuteStartIndex = year == yearStart && month == monthStart && day == dayStart && hour == hourStart ? minuteStart : 0
            const minuteEndIndex = year == yearEnd && month == monthEnd && day == dayEnd && hour == hourEnd ? minuteEnd : 59
            for (let minute = minuteStartIndex; minute <= minuteEndIndex; minute++) {
                const minuteVal = this.getNow(minute)
                const item = {
                    number: minuteVal,
                    text: `${minuteVal}分`
                }
                minutes.push(item)
            }
            this.range.splice(4, 1, minutes)
        },

        /**
         * 设置默认值
         */
        setDefaultValue() {
            // 默认日期
            let dtDefault

            // 开始日期和结束日期
            const dtStart = this.dtStart
            const dtEnd = this.dtEnd

            // 判断是否传了默认日期
            // 传了默认日期，格式化默认日期为日期对象
            if (this.defaultValue) {
                dtDefault = utils.formatDate(this.defaultValue).dt
            }
            // 如果没有传默认日期，将默认日期设置为当前日期
            else {
                dtDefault = new Date()
            }

            // 如果默认日期不在有效日期范围内，设置默认日期为有效日期开始值
            if (dtDefault < dtStart || dtDefault > dtEnd) {
                dtDefault = dtStart
            }

            // 更新 dateStr
            if (this.defaultValue) this.setDateStr(dtDefault)

            // 默认值相关数据
            const dfYear = dtDefault.getFullYear()
            const dfMonth = dtDefault.getMonth() + 1
            const dfDay = dtDefault.getDate()
            const dfHour = dtDefault.getHours()
            const dfMinute = dtDefault.getMinutes()

            // 设置年数据
            this.setYearData()
            // 设置 Year 这一列的 value 值
            const yearIndex = this.range[0].findIndex(year => {
                return dfYear == year.number
            })
            this.value.splice(0, 1, yearIndex >= 0 ? yearIndex : 0)

            // 设置月数据
            if (this.fields == 'year') return
            this.setMonthData(dfYear)
            // 设置 Month 这一列的 value 值
            const monthIndex = this.range[1].findIndex(month => {
                return dfMonth == month.number
            })
            this.value.splice(1, 1, monthIndex >= 0 ? monthIndex : 0)

            // 设置日数据
            if (this.fields == 'month') return
            this.setDayData(dfYear, dfMonth)
            // 设置 Day 这一列的 value 值
            const dayIndex = this.range[2].findIndex(day => {
                return dfDay == day.number
            })
            this.value.splice(2, 1, dayIndex >= 0 ? dayIndex : 0)

            // 设置时数据
            if (this.fields == 'day') return
            this.setHourData(dfYear, dfMonth, dfDay)
            // 设置 Hour 这一列的 value 值
            const hourIndex = this.range[3].findIndex(hour => {
                return dfHour == hour.number
            })
            this.value.splice(3, 1, hourIndex >= 0 ? hourIndex : 0)

            // 设置分数据
            if (this.fields == 'hour') return
            this.setMinuteData(dfYear, dfMonth, dfDay, dfHour)
            // 设置 Minute 这一列的 value 值
            const minuteIndex = this.range[4].findIndex(minute => {
                return dfMinute == minute.number
            })
            this.value.splice(4, 1, minuteIndex >= 0 ? minuteIndex : 0)
        },

        /**
         * 某一列的值改变时触发
         * @param {Number} event.detail.column 表示改变了第几列（下标从0开始）
         * @param {Number} event.detail.value 表示变更值的下标
         */
        columnchange(event) {
            const columnIndex = event.detail.column // 改变的列的下标
            const valueIndex = event.detail.value // 变更值的下标

            // 更新改变列的 value
            this.value.splice(columnIndex, 1, valueIndex)

            // 改变年要更新月数据
            if (this.fields == 'year') return
            if (columnIndex == 0) {
                // 当前选择的月
                const monthBeforeUpdate = this.range[1][this.value[1]]
                // 更新月数据
                this.setMonthData(this.range[0][this.value[0]].number)
                // 更新 Month Value
                const monthIndex = this.range[1].findIndex(month => {
                    return month.number == monthBeforeUpdate.number
                })
                this.value.splice(1, 1, monthIndex >= 0 ? monthIndex : 0)
            }

            // 改变年、月都要更新日数据
            if (this.fields == 'month') return
            if (columnIndex == 0 || columnIndex == 1) {
                // 当前选择的日
                const dayBeforeUpdate = this.range[2][this.value[2]]
                // 更新日数据
                this.setDayData(this.range[0][this.value[0]].number, this.range[1][this.value[1]].number)
                // 更新 Day Value
                const dayIndex = this.range[2].findIndex(day => {
                    return day.number == dayBeforeUpdate.number
                })
                this.value.splice(2, 1, dayIndex >= 0 ? dayIndex : 0)
            }

            // 改变年、月、日都要更新时数据
            if (this.fields == 'day') return
            if (columnIndex == 0 || columnIndex == 1 || columnIndex == 2) {
                // 当前选择的时
                const hourBeforeUpdate = this.range[3][this.value[3]]
                // 更新时数据
                this.setHourData(this.range[0][this.value[0]].number, this.range[1][this.value[1]].number, this.range[2][this.value[2]].number)
                // 更新 Hour Value
                const hourIndex = this.range[3].findIndex(hour => {
                    return hour.number == hourBeforeUpdate.number
                })
                this.value.splice(3, 1, hourIndex >= 0 ? hourIndex : 0)
            }

            // 当前选择的分
            if (this.fields == 'hour') return
            const minuteBeforeUpdate = this.range[4][this.value[4]]
            // 更新分数据
            this.setMinuteData(this.range[0][this.value[0]].number, this.range[1][this.value[1]].number, this.range[2][this.value[2]].number, this.range[3][this.value[3]].number)
            // 更新 Minute Value
            const minuteIndex = this.range[4].findIndex(minute => {
                return minute.number == minuteBeforeUpdate.number
            })
            this.value.splice(4, 1, minuteIndex >= 0 ? minuteIndex : 0)
        },
        getNow(s) {
            return s < 10 ? '0' + s : s
        },
        cancel() {
            this.$emit('cancel')
        }
    }
}
</script>
<style>
.txt-gray-ccc {
    color: #b8b8b8;
    font-weight: normal;
}
</style>
