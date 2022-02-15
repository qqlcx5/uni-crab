<template>
    <view class="u-waterfall">
        <view
            id="u-left-column"
            class="u-column"
        >
            <slot
                name="left"
                :leftList="leftList"
                :otherAttr="otherAttr"
            ></slot>
        </view>
        <view
            id="u-right-column"
            class="u-column"
        >
            <slot
                name="right"
                :rightList="rightList"
                :otherAttr="otherAttr"
            ></slot>
        </view>
    </view>
</template>

<script>
/**
 * waterfall 瀑布流
 * @description 这是一个瀑布流形式的组件，内容分为左右两列，结合uView的懒加载组件效果更佳。相较于某些只是奇偶数左右分别，或者没有利用vue作用域插槽的做法，uView的瀑布流实现了真正的 组件化，搭配LazyLoad 懒加载和loadMore 加载更多组件，让您开箱即用，眼前一亮。
 * @tutorial https://www.uviewui.com/components/waterfall.html
 * @property {Array} flow-list 用于渲染的数据
 * @property {String Number} add-time 单条数据添加到队列的时间间隔，单位ms，见上方注意事项说明（默认200）
 * @example <u-waterfall :flowList="flowList"></u-waterfall>
 */
let leftRectHeight = 0
let rightRectHeight = 0
export default {
    name: 'UWaterfall',
    props: {
        value: {
            // 瀑布流数据
            type: Array,
            default: function () {
                return []
            }
        },
        // id值，用于清除某一条数据时，根据此idKey名称找到并移除，如数据为{idx: 22, name: 'lisa'}
        // 那么该把idKey设置为idx
        idKey: {
            type: String,
            default: 'id'
        },
        // 其他数据
        otherAttr: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 固定几个不做瀑布流（每次分页都会按照这个规律来）,这个值最好控制在limit的20%-40%
        fixedNum: {
            type: [String, Number],
            default: 4
        }
    },
    data() {
        return {
            leftList: [],
            rightList: [],
            tempList: [],
            children: [],
            timer: null,
            setTimeoutNum: 0
        }
    },
    computed: {
        // 破坏flowList变量的引用，否则watch的结果新旧值是一样的
        copyFlowList() {
            return this.$deepClone(this.value)
        }
    },
    watch: {
        copyFlowList(nVal, oVal) {
            // 我们可以认为数据被替换了
            let isClear = false
            if (nVal.length <= oVal.length || !this.$c.diffByObj(nVal[0], oVal[0])) {
                this.clear(false)
                isClear = true
            }
            // 取差值，即这一次数组变化新增的部分
            const startIndex = isClear ? 0 : (Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0)
            // 拼接上原有数据
            this.tempList = this.tempList.concat(this.$deepClone(nVal.slice(startIndex)))
            // console.log('copyFlowListcopyFlowListcopyFlowListcopyFlowList')
            this.setTimeoutNum = 0
            this.splitData()
        }
    },
    mounted() {
        this.clear(false)
        this.tempList = this.$deepClone(this.copyFlowList)
        this.splitData()
    },
    beforeDestroy() {
        clearTimeout(this.timer)
    },
    methods: {
        addShopCar(e) {
            console.log(e)
        },
        async splitData() {
            // 前4个直接展示，不做瀑布流
            if (this.tempList.length >= this.fixedNum) {
                // if (this.tempList.length >= this.fixedNum && this.leftList.length === 0 && this.rightList.length === 0) {
                const firstList = this.tempList.splice(0, this.fixedNum)
                this.leftList = this.leftList.concat(firstList.filter((o, i) => i % 2 === 0))
                this.rightList = this.rightList.concat(firstList.filter((o, i) => i % 2 === 1))
            }
            if (!this.tempList.length) return
            // console.log('after', JSON.stringify(this.leftList), JSON.stringify(this.rightList))
            const { height } = await this.$c.getRect.call(this, '#u-left-column')
            const { height: rHeight } = await this.$c.getRect.call(this, '#u-right-column')
            // dom渲染还未完成
            if (leftRectHeight === height && rightRectHeight === rHeight && this.setTimeoutNum < 5) {
                this.timer = setTimeout(() => {
                    this.setTimeoutNum++
                    this.splitData()
                }, 50)
                return
            }
            leftRectHeight = height
            rightRectHeight = rHeight
            // 如果左边小于或等于右边，就添加到左边，否则添加到右边
            const item = this.tempList[0]
            // 解决多次快速上拉后，可能数据会乱的问题，因为经过上面的两个await节点查询阻塞一定时间，加上后面的定时器干扰
            // 数组可能变成[]，导致此item值可能为undefined
            if (!item) return
            if (this.leftList.length === 0) {
                this.leftList.push(item)
            } else if (height <= rHeight) {
                this.leftList.push(item)
            } else if (height > rHeight) {
                this.rightList.push(item)
            }
            // 移除临时列表的第一项
            this.tempList.splice(0, 1)
            // 如果临时数组还有数据，继续循环
            if (this.tempList.length > 0) {
                this.splitData()
                // this.$nextTick(() => {
                //     // console.log(JSON.stringify(this.tempList), 'tempList.length')
                // })
            }
        },
        // 清空数据列表
        clear(clearInput = true) {
            this.leftList = []
            this.rightList = []
            // 同时清除父组件列表中的数据
            clearInput && this.$emit('input', [])
            this.tempList = []
        },
        // 清除某一条指定的数据，根据id实现
        remove(id) {
            // 如果findIndex找不到合适的条件，就会返回-1
            let index = -1
            index = this.leftList.findIndex(val => val[this.idKey] === id)
            if (index !== -1) {
                // 如果index不等于-1，说明已经找到了要找的id，根据index索引删除这一条数据
                this.leftList.splice(index, 1)
            } else {
                // 同理于上方面的方法
                index = this.rightList.findIndex(val => val[this.idKey] === id)
                if (index !== -1) this.rightList.splice(index, 1)
            }
            // 同时清除父组件的数据中的对应id的条目
            index = this.value.findIndex(val => val[this.idKey] === id)
            if (index !== -1) this.$emit('input', this.value.splice(index, 1))
        },
        // 修改某条数据的某个属性
        modify(id, key, value) {
            // 如果findIndex找不到合适的条件，就会返回-1
            let index = -1
            index = this.leftList.findIndex(val => val[this.idKey] === id)
            if (index !== -1) {
                // 如果index不等于-1，说明已经找到了要找的id，修改对应key的值
                this.leftList[index][key] = value
            } else {
                // 同理于上方面的方法
                index = this.rightList.findIndex(val => val[this.idKey] === id)
                if (index !== -1) this.rightList[index][key] = value
            }
            // 修改父组件的数据中的对应id的条目
            index = this.value.findIndex(val => val[this.idKey] === id)
            if (index !== -1) {
                // 首先复制一份value的数据
                const data = this.$deepClone(this.value)
                // 修改对应索引的key属性的值为value
                data[index][key] = value
                // 修改父组件通过v-model绑定的变量的值
                this.$emit('input', data)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.u-waterfall {
    @include flex(row);
    width: 100%;
    align-items: flex-start;
    flex-wrap: nowrap;
}

.u-column {
    @include flex(column);
    flex: 1;
    width: 50%;
    height: auto;
}

.u-image {
    width: 100%;
}
</style>
