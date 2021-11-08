<template>
    <view>
        <c-popup
            v-model="showHippingAddress"
            mode="right"
            width="750rpx"
        >
            <view class="edit-address">
                <view class="ss-modal__title">{{ itemObj.id ? '编辑地址' : '新增地址' }}</view>
                <scroll-view
                    class="edit-scroll"
                    scroll-y
                >
                    <c-form
                        ref="formRef"
                        @submit="handleSubmit"
                    >
                        <c-cell-group>
                            <template v-for="(item, index) in inputGroup_">
                                <template v-if="String(item.show) === 'true' ? true : showObj_[item.show]">
                                    <!-- 选择框类型 -->
                                    <c-cell
                                        v-if="item.type === 'select'"
                                        :key="index"
                                        :border="item.border"
                                    >
                                        <c-input
                                            :value="selectObj_[item.selectProp]"
                                            :name="item.prop || item.selectProp"
                                            :before-width="item.beforeWidth"
                                            :before-style="beforeStyle"
                                            :type="item.type"
                                            :disabled="item.disabled"
                                            :placeholder="item.placeholder"
                                            @select="handleSelect($event, item.handler)"
                                        >
                                            <view slot="before">{{ item.label }}</view>
                                        </c-input>
                                    </c-cell>
                                    <!-- 单选框 -->
                                    <c-cell
                                        v-else-if="item.type === 'radio'"
                                        :key="index"
                                        :border="item.border"
                                        :title="item.label"
                                        :title-style="{width: `${item.beforeWidth}rpx`, flex: '0 0 auto', ...beforeStyle}"
                                        :value-style="{width: `calc(100% - ${item.beforeWidth}rpx)`, justifyContent: 'flex-start'}"
                                    >
                                        <view slot="value">
                                            <c-radio-group
                                                :name="item.prop"
                                                :value="itemObj[item.prop]"
                                                @change="handleRadioChange($event, item.prop)"
                                            >
                                                <c-radio
                                                    v-for="(row, idx) in item.radioList"
                                                    :key="idx"
                                                    :name="row.value"
                                                >{{ row.label }}</c-radio>
                                            </c-radio-group>
                                        </view>
                                    </c-cell>
                                    <!-- 含有单位的输入框 -->
                                    <c-cell
                                        v-else-if="item.unit"
                                        :key="index"
                                        :border="item.border"
                                        :title="item.label"
                                        :title-style="{width: `${item.beforeWidth}rpx`, flex: '0 0 auto', ...beforeStyle}"
                                        :value-style="{width: `calc(100% - ${item.beforeWidth}rpx)`, justifyContent: 'flex-start'}"
                                    >
                                        <view
                                            slot="value"
                                            class="flex"
                                        >
                                            <view class="flex">
                                                <view class="flex-1">
                                                    <c-input
                                                        :name="item.prop"
                                                        :type="item.type"
                                                        :decimal="item.decimal"
                                                        :before-width="item.beforeWidth"
                                                        :maxlength="item.maxlength"
                                                        :pattern="item.pattern"
                                                        :msg-name="item.msgName"
                                                        :before-style="beforeStyle"
                                                        :value="itemObj[item.prop]"
                                                        :placeholder="item.placeholder"
                                                    >
                                                        <view :style="[item.unitStyle]">{{ item.unit }}</view>
                                                    </c-input>
                                                </view>
                                                <view :style="[item.afterStyle]">{{ item.afterText }}</view>
                                            </view>
                                        </view>
                                    </c-cell>
                                    <!-- 普通输入框 -->
                                    <c-cell
                                        v-else
                                        :key="index"
                                        :border="item.border"
                                    >
                                        <c-input
                                            :name="item.prop"
                                            :type="item.type"
                                            :decimal="item.decimal"
                                            :before-width="item.beforeWidth"
                                            :maxlength="item.maxlength"
                                            :pattern="item.pattern"
                                            :msg-name="item.msgName"
                                            :before-style="beforeStyle"
                                            :value="itemObj[item.prop]"
                                            :placeholder="item.placeholder"
                                        >
                                            <view slot="before">{{ item.label }}</view>
                                        </c-input>
                                    </c-cell>
                                </template>
                            </template>
                            <c-cell
                                title="设置默认地址"
                                :title-style="{width: `${beforeWidth + 20}rpx`, flex: '0 0 auto', ...beforeStyle}"
                                :value-style="{width: `calc(100% - ${beforeWidth + 20}rpx)`}"
                            >
                                <view slot="value">
                                    <c-switch
                                        v-if="showHippingAddress"
                                        v-model="itemObj.is_default"
                                        :on-val="1"
                                        scale="0.8"
                                        :off-val="0"
                                    />
                                </view>
                            </c-cell>
                        </c-cell-group>
                        <c-fixed-menu
                            position="bottom"
                            height="136"
                        >
                            <view class="flex p24">
                                <view
                                    v-if="itemObj.id"
                                    class="flex-1 pr24"
                                >
                                    <c-colors
                                        :theme="['#ededed', '#333333']"
                                        :pro="['bgc', 'c']"
                                        type="button"
                                    >
                                        <c-button
                                            size="large"
                                            radius="16"
                                            @click="handlerDelete"
                                        >删除</c-button>
                                    </c-colors>
                                </view>
                                <view class="flex-1">
                                    <c-colors
                                        :theme="['t', '#fff']"
                                        :pro="['bgc', 'c']"
                                        type="button"
                                    >
                                        <c-button
                                            size="large"
                                            radius="16"
                                            form-type="submit"
                                        >保存</c-button>
                                    </c-colors>
                                </view>
                            </view>
                        </c-fixed-menu>
                    </c-form>
                </scroll-view>
            </view>
        </c-popup>
        <c-modal
            v-model="deleteFlag"
            title="是否确认删除该收货地址？"
            @confirm="confirmDelete"
        ></c-modal>
        <c-select-city
            v-model="selectCityFlag"
            :default-value="defaultValue_"
            @confirm="sureLocal"
        />
        <c-popup
            v-model="limitTimeFlag"
            mode="bottom"
            radius="24rpx 24rpx 0 0"
        >
            <view class="limit-picker__content">
                <picker-view
                    :indicator-style="indicatorStyle"
                    :value="limitPickerValue_"
                    class="limit-picker"
                    @change="handleTimeChange"
                >
                    <picker-view-column>
                        <view
                            v-for="(item,index) in startTimes_"
                            :key="index"
                            class="limit-picker__time"
                            :class="{'limit-picker__time--active': index === startIndex}"
                        >{{ item }}</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view class="limit-picker__lime">—</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view
                            v-for="(item,index) in endTImes_"
                            :key="index"
                            class="limit-picker__time"
                            :class="{'limit-picker__time--active': index === endIndex}"
                        >{{ item }}</view>
                    </picker-view-column>
                </picker-view>
                <view class="limit-picker__btn-group flex">
                    <view class="flex-1">
                        <c-colors
                            :theme="['#f5f5f5', 't']"
                            :pro="['bgc', 'c']"
                            type="button"
                        >
                            <c-button @click="limitTimeFlag = false;">取消</c-button>
                        </c-colors>
                    </view>
                    <view class="flex-1">
                        <c-colors
                            type="button"
                            :theme="['t', '#fff']"
                            :pro="['bgc', 'c']"
                        >
                            <c-button @click="handleSubmitTime">确定</c-button>
                        </c-colors>
                    </view>
                </view>
            </view>
        </c-popup>
    </view>
</template>
<script>
const beforeWidth = 160
export default {
    name: 'CEditAddress',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        tempItem: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            limitTimeFlag: false, // 限行时间弹窗
            beforeWidth: beforeWidth,
            deleteFlag: false,
            selectCityFlag: false,
            itemObj: {
                address: '',
                car_is_downstairs: 0,
                floor: '',
                is_default: 0,
                is_elevator: 0,
                is_limit_line: 0,
                limit_line_time: '',
                mobile: '',
                remark: '',
                shipping_distance: '',
                user_name: ''
            },
            beforeStyle: {
                fontSize: '28rpx',
                lineHeight: '40rpx',
                color: '#333'
            },
            indicatorStyle: 'height: 96rpx;',
            showHippingAddress: false,
            allTimes: [],
            startIndex: 0,
            endIndex: 0,
            hasExtraAddress: false
        }
    },
    computed: {
        startTimes_() {
            return this.allTimes.slice(0, this.allTimes.length - 2)
        },
        endTImes_() {
            return this.allTimes.slice(1, this.allTimes.length - 1)
            // return this.allTimes.slice(this.startIndex + 1, this.allTimes.length - 1)
        },
        limitPickerValue_() {
            return [this.startIndex, 0, this.endIndex]
        },
        showObj_() {
            return {
                limiTime: this.itemObj.is_limit_line === 1
            }
        },
        inputGroup_() {
            const inputGroup = [{
                beforeWidth,
                label: '收货姓名',
                maxlength: '20',
                pattern: 'name',
                type: 'text',
                msgName: '姓名',
                value: '',
                show: true,
                prop: 'user_name',
                placeholder: '请输入收货人姓名'
            }, {
                beforeWidth,
                label: '手机号',
                maxlength: '11',
                pattern: 'mobile',
                msgName: '手机号',
                value: '',
                type: 'number',
                show: true,
                prop: 'mobile',
                placeholder: '请输入收货人电话'
            }, {
                beforeWidth,
                label: '所在地区',
                pattern: 'notnull',
                msgName: '所在地区',
                type: 'select', // 如果type为select的话  prop值应该为selectObj_里面的属性
                // prop: "local",
                selectProp: 'local',
                placeholder: '请选择省/市/区/街道',
                disabled: true,
                show: true,
                value: '',
                handler: 'handleSelectLocal'
            }, {
                beforeWidth,
                label: '详情地址',
                pattern: 'notnull',
                type: 'text',
                msgName: '详情地址',
                value: '',
                prop: 'address',
                show: true,
                placeholder: '请输入街道详情地址'
            }]
            let lastInputGroup = []
            if (this.hasExtraAddress) {
                lastInputGroup = inputGroup.concat([{
                    beforeWidth,
                    label: '限行',
                    pattern: 'notnull',
                    prop: 'is_limit_line',
                    radioList: [{
                        value: 1,
                        label: '有'
                    }, {
                        value: 0,
                        label: '无'
                    }],
                    value: 0,
                    show: true,
                    type: 'radio'
                }, {
                    beforeWidth,
                    label: '限行时段',
                    pattern: 'notnull',
                    toast: '请选择限行时段',
                    type: 'select',
                    prop: 'limit_line_time',
                    selectProp: 'limitLineTime',
                    value: '',
                    show: 'limiTime', // 显示条件
                    handler: 'handleSelectLimitTime',
                    placeholder: '请选择限时时段'
                }, {
                    beforeWidth,
                    label: '车到楼下',
                    pattern: 'notnull',
                    toast: '请选择车到楼下',
                    prop: 'car_is_downstairs',
                    show: true,
                    value: 0,
                    radioList: [{
                        value: 1,
                        label: '能'
                    }, {
                        value: 0,
                        label: '不能'
                    }],
                    show: true,
                    type: 'radio'
                }, {
                    beforeWidth,
                    label: '托运',
                    pattern: 'notnull',
                    toast: '请选择车到楼下',
                    prop: 'shipping_distance',
                    show: true,
                    value: '',
                    type: 'price',
                    decimal: 0,
                    unit: '米',
                    unitStyle: {
                        color: '#333333',
                        fontSize: '28rpx'
                    },
                    afterStyle: {
                        color: '#43548F',
                        fontSize: '28rpx',
                        textAlign: 'right',
                        width: '350rpx'
                    },
                    afterText: '200米以内免费',
                    placeholder: '请输入距离'
                }, {
                    beforeWidth,
                    label: '电梯',
                    pattern: 'notnull',
                    value: '0',
                    prop: 'is_elevator',
                    show: true,
                    value: 0,
                    radioList: [{
                        value: 1,
                        label: '有'
                    }, {
                        value: 0,
                        label: '无'
                    }],
                    type: 'radio'
                }, {
                    beforeWidth,
                    label: '楼层',
                    pattern: 'notnull',
                    value: '',
                    prop: 'floor',
                    show: true,
                    type: 'price',
                    decimal: 0,
                    placeholder: '请输入楼层',
                    msgName: '楼层'
                }, {
                    beforeWidth,
                    label: '备注',
                    value: '',
                    prop: 'remark',
                    show: true,
                    type: 'text',
                    placeholder: '请输入内容'
                }])
            } else {
                lastInputGroup = [...inputGroup]
            }
            return lastInputGroup.map((o, i) => {
                return {
                    ...o,
                    border: true
                }
            })
        },
        selectObj_() {
            return {
                local: this.itemObj.province ? `${this.itemObj.province} ${this.itemObj.city} ${this.itemObj.district}` : '',
                limitLineTime: this.itemObj.limit_line_time
            }
        },
        defaultValue_() {
            if (this.itemObj.province) {
                return [{
                    value: this.itemObj.province_id,
                    label: this.itemObj.province
                }, {
                    value: this.itemObj.city_id,
                    label: this.itemObj.city
                }, {
                    value: this.itemObj.district_id,
                    label: this.itemObj.district
                }]
            } else {
                return []
            }
        }
    },
    watch: {
        value: {
            handler(val) {
                this.showHippingAddress = val
                val && this.getEnableExtraAddres()
            },
            immediate: true
        },
        showHippingAddress(newVal) {
            this.$emit('input', newVal)
        }
    },
    created() {
        const allTimes = []
        for (var i = 0; i < 24; i++) {
            allTimes.push(`${i}:00`)
        }
        this.allTimes = allTimes
    },
    methods: {
        async getEnableExtraAddres() {
            const { data: { is_enable_address_extra = 0 } } = await this.$http('getEnableExtraAddres')
            this.hasExtraAddress = is_enable_address_extra === 1
            if (Object.keys(this.tempItem).length > 0) {
                this.itemObj = { ...this.tempItem }
                if (this.itemObj.limit_line_time) {
                    const limitLineTime = this.itemObj.limit_line_time.split('~')
                    this.startIndex = this.startTimes_.findIndex(o => o === limitLineTime[0])
                    this.endIndex = this.endTImes_.findIndex(o => o === limitLineTime[1])
                }
            } else {
                this.initData()
            }
        },
        async handleSubmit(e) {
            const value = e.detail.value
            if (this.hasExtraAddress) {
                if (this.showObj_.limiTime && !this.itemObj.limit_line_time) {
                    this.$toast('请选择限时时段')
                    return
                }
                if (!value.shipping_distance || value.shipping_distance === 0) {
                    this.$toast('请输入托运距离')
                    return
                }
                if (!value.floor || value.floor === 0) {
                    this.$toast('请输入楼层')
                    return
                }
            }
            const params = Object.assign({}, this.itemObj, value)
            delete params.province
            delete params.city
            delete params.district
            if (!this.showObj_.limiTime) delete params.limit_line_time
            const res = await this.$http('userShippingAddressSave', params)
            this.$toast(params.id ? '修改成功' : '新增成功', 1)
            this.showHippingAddress = false
            this.$emit('change', params)
        },
        handleRadioChange(e, prop) {
            this.$set(this.itemObj, prop, e.detail.value)
        },
        handleSubmitTime() {
            this.$set(this.itemObj, 'limit_line_time', this.startTimes_[this.startIndex] + '~' + this.endTImes_[this.endIndex])
            this.limitTimeFlag = false
        },
        handleTimeChange(e) {
            // 说明改变了第一列
            const firstIndex = e.detail.value[0]
            const lastIndex = e.detail.value[2]
            if (this.startIndex !== firstIndex) {
                const oldValue = parseInt(this.endTImes_[this.endIndex])
                this.startIndex = firstIndex || 0
                if (parseInt(this.startTimes_[this.startIndex]) > oldValue) {
                    this.endIndex = this.startIndex + 1
                } else {
                    this.endIndex = this.endTImes_.findIndex(o => parseInt(o) === oldValue)
                }
            } else {
                this.endIndex = lastIndex
                // 这边要稍微延迟下，不然检测不到数据变化
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.endIndex = lastIndex > this.startIndex ? lastIndex : this.startIndex + 1
                    }, 50)
                })
            }
        },
        async confirmDelete() {
            await this.$http('userShippingAddressDel', {
                id: this.itemObj.id
            })
            this.$toast('删除成功', 1)
            this.showHippingAddress = false
            this.$emit('change')
        },
        handlerDelete() {
            this.deleteFlag = true
        },
        initData() {
            const itemObj = {}
            this.inputGroup_.forEach(o => {
                o.prop ? itemObj[o.prop] = o.value : ''
            })
            itemObj.is_default = 0
            this.itemObj = { ...itemObj }
        },
        sureLocal(e) {
            console.log(e)
            const { detail } = e
            const local = {
                province: detail.province.label,
                province_id: detail.province.value,
                city: detail.city.label,
                city_id: detail.city.value,
                district: detail.district.label,
                district_id: detail.district.value
            }
            this.itemObj = Object.assign({}, this.itemObj, local)
        },
        handleDefault(e) {
            this.itemObj.is_default = e.detail.value ? 1 : 0
        },
        handleSelect(e, handler) {
            this[handler](e)
        },
        handleSelectLimitTime() {
            this.limitTimeFlag = true
        },
        handleSelectLocal() {
            this.selectCityFlag = true
        }
    }
}
</script>
<style lang="scss">
// 日期选择
.limit-picker {
    widows: 750rpx;
    height: 530rpx;
    &__content {
        padding: 54rpx 20px;
    }
    &__btn-group {
        padding: 0 55rpx;
        .flex-1 {
            padding: 0 20rpx;
        }
    }
    &__lime {
        font-size: 32rpx;
        font-weight: bold;
        line-height: 96rpx;
        color: #333333;
        text-align: center;
    }
    &__time {
        height: 96rpx;
        @include flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        font-weight: 400;
        color: #333333;
        @include tst(all, 0.1s);
        &--active {
            font-size: 36rpx;
            font-weight: bold;
        }
    }
}
.edit-address {
    width: 100%;
    height: 100%;
    background: $bg-color;

    &-box {
        background-color: #fff;
    }
    .edit-scroll {
        height: calc(100% - 44px);
    }

    .ss-modal__title {
        height: 88rpx;
        background-color: #fff;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        padding: 0 80rpx;
        font-size: 32rpx;
    }

    .back {
        position: absolute;
        left: 0;
    }

    .pl24 {
        padding-left: 24rpx;
        box-sizing: border-box;
    }

    .edit-address-item {
        display: flex;
        align-items: center;
        height: 88rpx;
        &__name {
            font-size: 28rpx;
            width: 160rpx;
            color: #333333;
        }

        &__input {
            flex: 1;
            padding: 12rpx 0;
        }
    }

    .set-default-address {
        padding: 0 24rpx;
        height: 88rpx;
        background: #ffffff;
        display: flex;
        align-items: center;
    }
}
</style>
