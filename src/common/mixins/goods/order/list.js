import orderMixins from '@/common/mixins/goods/order/main'
import listMixins from '@/common/mixins/list'
export default {
    mixins: [orderMixins, listMixins],
    data() {
        return {
            reqName: 'orderMyOrder',
            autoReq: false,
            reqParams: {
                order_status: ''
            },
            menuIndex: -1,
            timer: null,
            isFirst: true,
        }
    },
    onLoad() {
        this.pageType = 'index'
        this.menuIndex = (this.$Route.query.menu_index || 0) * 1
    },
    onShow() {
        !this.isFirst && this.initPage()
    },
    computed: {
        showMenu_() {
            return this.order_tab.length > 0;
        }
    },
    methods: {
        handleToDetail(id) {
            this.$jumpDetail('orderDetails', id)
        },
        handleToLogistics(order) {
            this.$jumpDetail('logistics', order.id)
        },
        changeType(e) {
            if (this.order_tab && !this.order_tab.length) {
                this.timer = setTimeout(() => {
                    this.changeType(e)
                }, 200)
                return
            }
            this.reqParams.order_status = this.order_tab[e.detail.value].value
            this.initPage();
        },
        finishInit() {
            this.isFirst = false;
        }
    },
    beforeDestroy() {
        clearTimeout(this.timer)
    },
}
