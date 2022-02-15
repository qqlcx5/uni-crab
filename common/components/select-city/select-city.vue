<template>
    <view>
        <!-- maskabled="false" -->
        <c-popup
            v-model="modalFlag"
            mode="bottom"
            maskabled="false"
            radius="24rpx 24rpx 0 0"
        >
            <view class="select-city">
                <view class="c-modal__title">所在区域</view>
                <view class="select-city-hd c-underline">
                    <view
                        v-for="(item,index) in cityList"
                        :key="index"
                        class="select-city-hd__item"
                    >
                        <c-colors
                            :theme="[index == showRank ? 't' : '#333']"
                            @click="onRankClick(index)"
                        >
                            <text
                                v-show="index <= level && (showRank >= index || item.name)"
                                class="select-city-hd__text"
                            >{{ item.name || '请选择' }}</text>
                        </c-colors>
                        <c-colors
                            class="select-city-hd__line-box"
                            :theme="[index == showRank ? 't' : 'transparent']"
                            :pro="['bgc']"
                            @click="onRankClick(index)"
                        >
                            <text
                                v-show="index === showRank"
                                class="select-city-hd__line"
                            ></text>
                        </c-colors>
                    </view>
                </view>
                <scroll-view
                    class="select-city__middle"
                    scroll-y
                >
                    <view
                        v-for="(item, index) in curList_"
                        :key="index"
                        class="select-city__item"
                        :class="{'select-city__item--active': checked_(item.value)}"
                        @click="onChooseClick(item.label, item.value)"
                    >
                        <c-colors :theme="[checked_(item.value) ? 't' : '#333']">
                            <c-icons
                                class="select-city__icon"
                                color="false"
                                type="zsuicon-queding"
                                size="32"
                            ></c-icons>
                            {{ item.label }}
                        </c-colors>
                    </view>
                </scroll-view>
            </view>
        </c-popup>
    </view>
</template>

<script>
export default {
    name: 'CSelectCity',
    props: {
        // 城级
        level: {
            type: [String, Number],
            default: 2
        },
        // 是否显示	
        value: {
            type: Boolean,
            default: false
        },
        // 默认值	
        defaultValue: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 请求接口
        apiUrl: {
            type: String,
            default: 'getRegion'
        }
    },
    data() {
        return {
            modalFlag: false,
            cityList: [{
                identify: 'province',
                name: '',
                showList: []
            },
            {
                identify: 'city',
                name: '',
                showList: []
            },
            {
                identify: 'district',
                name: '',
                showList: []
            },
            {
                identify: 'town',
                name: '',
                showList: []
            }
            ],
            valueObj: {
                province: {
                    label: '',
                    value: ''
                },
                city: {
                    label: '',
                    value: ''
                },
                district: {
                    label: '',
                    value: ''
                },
                town: {
                    label: '',
                    value: ''
                }
            },
            busy: false,
            showRank: 0,
            showName: 'ext_name'// 要展示接口返回字段的名字
        }
    },
    computed: {
        curList_() {
            return this.cityList[this.showRank].showList
        },
        identifys_() {
            return this.cityList.map(o => o.identify)
        },
        checked_() {
            return (id) => {
                return this.valueObj[this.cityList[this.showRank].identify].value === id
            }
        },
        defaultValue_() {
            return this.$deepClone(this.defaultValue)
        }
    },
    watch: {
        // 因为defaultValue的值为对象或者数组时，需要先computed里deepClone一下，才能正确同步到新旧值
        defaultValue_: {
            handler(val, oldVal) {
                // console.log('val', val)
                // console.log('oldVal', oldVal)
                const len = val.length
                if (len <= 0) {
                    this.initData()
                } else {
                    this.showRank = len >= this.level ? this.level : len
                    val.forEach((o, i) => {
                        this.cityList[i].name = o.label
                        this.valueObj[this.identifys_[i]] = o
                    })
                }
            },
            immediate: true,
            deep: true
        },
        value: {
            handler(val) {
                this.modalFlag = val
                if (val) {
                    this.curReq()
                }
            },
            immediate: true
        },
        modalFlag(val) {
            this.$emit('input', val)
        }
    },
    created() {
        this.initData()
    },
    methods: {
        initData() {
            this.showRank = 0
            this.cityList = [{
                identify: 'province',
                name: '',
                showList: []
            },
            {
                identify: 'city',
                name: '',
                showList: []
            },
            {
                identify: 'district',
                name: '',
                showList: []
            },
            {
                identify: 'town',
                name: '',
                showList: []
            }
            ]
            this.valueObj = {
                province: {
                    label: '',
                    value: ''
                },
                city: {
                    label: '',
                    value: ''
                },
                district: {
                    label: '',
                    value: ''
                },
                town: {
                    label: '',
                    value: ''
                }
            }
        },
        onRankClick(key) {
            this.showRank = key
            this.curReq()
        },
        curReq(submit = false) {
            const showRank = this.showRank - 1
            const lastValue = this.valueObj[this.identifys_[this.showRank]].value
            console.log('curReq', lastValue)
            if (this.showRank === -1 || !Object.keys(this.curList_).length || this.curList_.findIndex(o => o.value === lastValue) === -1) {
                const curArea = this.valueObj[this.identifys_[showRank]] || {}
                this.onChooseClick(curArea.label, curArea.value, submit)
            }
        },
        resetValueObj() {
            this.identifys_.forEach((o, i) => {
                if (i > this.showRank) {
                    this.$set(this.cityList[i], 'name', '')
                    this.$set(this.valueObj, o, {
                        label: '',
                        value: ''
                    })
                }
            })
        },
        /**
         * 选中
         * name {String} 展示选中的值
         * id {Number}  选中的id
         * submit 是否自动提交
        */
        async onChooseClick(name, id, submit = true) {
            if (id && submit) {
                const identify = this.identifys_[this.showRank]
                // 选择不同后要重置后面的选中
                if (this.valueObj[identify].value !== id) {
                    this.resetValueObj()
                }
                this.valueObj[identify].label = name
                this.valueObj[identify].value = id
                this.cityList[this.showRank].name = name
            }
            const res = await this.$http(this.apiUrl, {
                id: id
            })
            const cityList = Object.keys(res.data).map(o => {
                return {
                    value: o,
                    label: res.data[o]
                }
            })
            if (id) {
                if (submit) {
                    if (!Object.keys(cityList).length || this.level <= this.showRank) {
                        if (this.showRank === 2) {
                            this.valueObj.town = {
                                label: '',
                                value: ''
                            }
                        }
                        this.$emit('confirm', {
                            type: 'confirm',
                            detail: this.valueObj
                        })
                        this.modalFlag = false
                    } else {
                        this.showRank++
                        this.cityList[this.showRank].showList = cityList
                    }
                } else {
                    this.cityList[this.showRank].showList = cityList
                }
            } else {
                this.cityList[0].showList = cityList
            }
        }
    }
}
</script>

<style lang="scss">
.select-city {
    background-color: #fff;
    border-radius: 24rpx 24rpx 0px 0px;
    width: 100%;
    .c-modal__title::after {
        display: none;
    }
    &-hd {
        padding: 0 8rpx;
        height: 68rpx;
        &__item {
            font-size: $font-base;
            display: inline-flex;
            align-items: center;
            height: 68rpx;
            position: relative;
            margin: 0 16rpx;
        }
        &__line {
            width: 56rpx;
            height: 4rpx;
            border-radius: 2rpx;
            &-box {
                z-index: 3;
                @include abs(null, 50%, 0);
                transform: translateX(50%);
                width: 56rpx;
                height: 4rpx;
            }
        }
    }

    &__middle {
        height: 72vh;
    }
    &__item {
        position: relative;
        padding: 0 24rpx;
        @include flex(row);
        align-items: center;
        height: 72rpx;
        font-size: $font-base;
        // @include tst();

        &--active {
            padding-left: 60rpx;
            .select-city__icon {
                opacity: 1;
                padding-right: 10rpx;
            }
        }
    }
    &__icon {
        @include site(24rpx);
        opacity: 0;
        @include tst();
    }
}
</style>
