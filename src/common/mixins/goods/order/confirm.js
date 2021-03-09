export default {
    data() {
        return {
            address_id: undefined,
            addressFinish: false,
            pageData: {},
            selectInvoiceFlag: false, //选择发票
            shippingFlag: false, //选择配送方式
            goodsFinish: false,
            formData: {
                remark: '',
                invoice_id: '',
                shipping_id: ''
            },
            shopingText: '',
            valueStyle: {
                fontSize: '28rpx',
                color: '#333333'
            },
            valueStyleLg: {
                fontSize: '30rpx',
                color: '#333333'
            },
            titleStyle: {
                fontSize: '28rpx',
                color: '#333333'
            },
            remarkStyle: {
                fontSize: '28rpx',
                width: '136rpx',
                flex: '0 0 auto',
                color: '#333333'
            },
            addressList: [], //地址列表
            routeQuery: {}, //地址栏参数
            shippingList: [], //配送方式
            invoiceName: '不开发票',
            order_id: ''
        }
    },
    computed: {
        showBottomNav_() {
          return this.addressFinish && this.goodsFinish
        },
        defaultAddress_() {
            return (this.address_id ? this.addressList.find(o => o.id == this.address_id) : (this.addressList.find(
                o => o.is_default === 1) || this.addressList[0])) || {};
        },
        hasAddress_() {
            return Object.keys(this.defaultAddress_).length;
        },
        goodsList_() {
            return this.pageData.list || [];
        },
        totalPrice_() {
            if (!this.pageData.goods_price) return ' ';
            return this.$c.calcFn.add(this.pageData.goods_price, this.pageData.price_shipping).toFixed(2)
        }
    },
    watch: {
        'formData.shipping_id'(val) {
            this.shopingText = (this.shippingList.find(o => val === o.value) || {}).label;
        },
        address_id(val) {
            console.log(val);
        }
    },
    onLoad() {
        this.routeQuery = this.$Route.query;
        let address_id = this.routeQuery.address_id;
        address_id && (this.address_id = address_id);
        this.getExpressList(!this.routeQuery.order_id);
    },
    async onShow() {
        if (this.routeQuery.order_id) { //说明订单提交过了，可以根据订单id取查询商品
            this.getOrderData();
        } else {
            this.getPageData();
        }
        this.getAllAddress(); //不能确定用户是否新增了，所以要去查询下, 修改完地址回调
    },
    methods: {
        async getOrderData() {
            const {
                data
            } = await this.$http('orderInfo', {
                order_id: this.routeQuery.order_id
            })
            let invoice = data.invoice ? data.invoice.invoice_type : false;
            if(invoice){
                this.invoiceName = invoice.type;
            }else{
                this.invoiceName = '不开发票';
            }
            this.pageData = {
                list: data.order_goods,
                price_shipping: data.price_shipping,
                goods_price: data.total_price,
                count: data.total_num,
                payFlag: String(data.order_status).charAt(0) === '1'
            }
            this.address_id = data.address_id;
            this.formData = {
                remark: data.remark,
                invoice_id: data.invoice_id,
                shipping_id: data.shipping_id
            }
            if(data.order_status > 10){//说明订单已经支付

            }else{

            }
            this.goodsFinish = true;
        },
        //弹窗的确认提交操作
        handleConfirm(e, fPro) {
            let {
                value,
                invoiceName
            } = e.detail;
            this.formData[fPro] = value;
            if (fPro === 'invoice_id') {
                this.invoiceName = invoiceName
            }
        },
        // 获取订单的所有状态类型
        async getExpressList(setDefault = true) {
            let {
                data
            } = await this.$http('orderExpressList');
            let defaultIndex = 0;
            this.shippingList = data.map((o, index) => {
                o.is_default === 1 && (defaultIndex = index);
                return {
                    checked: o.is_default === 1,
                    label: o.type_text,
                    value: o.type
                }
            });
            //默认选中配送方式
            setDefault && this.handleConfirm({
                detail: {
                    value: this.shippingList[defaultIndex].value
                }
            }, 'shipping_id')
        },
        // 获取页面初始化数据
        async getPageData() {
            try{
                let {
                    data
                } = await this.$http('confirmOrder', {
                    ...this.routeQuery
                })
                this.goodsFinish = true;
                this.pageData = {
                    ...data,
                    payFlag: true
                };
            }catch(e){
                setTimeout(() => {
                    // this.$back();
                }, 500)
                //TODO handle the exception
            }
        },
        // 获取用户的所有地址
        async getAllAddress() {
            let {
                data
            } = await this.$http('userShippingAddressList', null, {
                loading: !!this.address_id
            });
            if (!this.address_id) { //用户第一次拿到地址，要赋值初始值
                this.address_id = (data.list.find(o => o.is_default === 1) || data.list[0] || {}).id;
            }
            this.addressList = data.list;
            this.addressFinish = true;
        },
        // 提交订单
        async submit() {
            if (!this.hasAddress_) {
                if (this.addressList.length === 0) {
                    return this.$modal({
                        title: '温馨提示',
                        content: '请先新增一个收货地址',
                        confirmText: '新增',
                        success: (res) => {
                            if (res.confirm) {
                                this.$jump('address', {
                                    action: 'referrer'
                                })
                            }
                        }
                    })
                }
                return this.$toast('请选择收货地址');
            }
            let params = {
                ...this.formData,
                ...this.routeQuery,
                address_id: this.address_id
            }
            let {
                data
            } = await this.$http(this.routeQuery.order_id ? 'editOrder' : 'createOrder', params);
            this.routeQuery.order_id = data.order_id
            this.$jump('orderPayment', {
                    order_id: this.routeQuery.order_id
                }, 'replace')
        }
    },

}
