export default {
    data() {
        return {
            options: [{
                text: '删除商品',
                style: {
                    backgroundColor: '#FA3F1E',
                    padding: '0 30rpx',
                    width: '120rpx',
                    fontSize: '24rpx'
                }
            }],
            editData: {},//当前编辑的下标
            inputFlag: false,//输入购买输入框弹窗
            specFlag: false,//商品规格弹窗
            editFlag: false,//是否开启编辑状态
            specData: {},
            buyMax: 9999,
            jumpMode: [ 'collect' , 'orderConfirm', 'shopingcart' ],//跳转商品详情列表
            smallClassMode: ['small', 'apply', 'orderConfirm', 'order', 'orderList'],//紧凑型mode列表
            hasCheckedMode: ['normal', 'apply', 'shopingcart'],//有选中图标
            orderMode: ['order', 'orderConfirm', 'orderList', 'small'],
        }
    },
    props: {
        /**
         * normal 正常的商品列表
         * shopcard 正常的商品列表
         * collect 收藏列表
         * apply 申请售后
         * package 套餐包
         * invalid 失效商品列表
         * order 退换货
         * shopingcart 购物车
         */
        mode: {
            type: String,
            default: 'normal'
        },
        noData: {
            type: Boolean,
            default: false
        },
        lodingText: {
            type: String,
            default: ''
        },
        optionsText: {
            type: String,
            default: '删除商品'
        },
        disabled: {
            type: [String, Boolean],
            default: false
        },
        // value 同 list,淡水value提供数据双向绑定
        value: {
            type: Array,
            default: () => {
                return []
            }
        },
        list: {
            type: Array,
            default: () => {
                return []
            }
        },
        swipeAction: {
            type: [String, Boolean],
            default: false
        },
        hasEdit: {
            type: [String, Boolean],
            default: false
        }
    },
    computed: {
        oneNumFn_() {//购买数量
            return ({ num = false, buy_num = false}) => {
                return String(num) !== 'false' ? num : String(buy_num) !== 'false' ? buy_num : 0;
            }
        },
        oneTotalNumFn_() {//购买的总片数
            return (item) => {
                return this.$c.calcFn.mul(this.oneNumFn_(item), item.goods_piece_ratio.sale_stock_ratio);
            }
        },
        onePackageFn_() {//每箱的面积
            return ({ goods_piece_ratio}) => {
                return goods_piece_ratio.area;
            }
        },
        totalNumFn_() {//总面积
            return (item) => {
                return this.$c.calcFn.mul(this.onePackageFn_(item), this.oneNumFn_(item));
            }
        },
        totalSaleFn_() {//每个售价单位的价格
            return ({ goods_piece_ratio , num, price}) => {
                return this.$c.calcFn.mul(this.totalNumFn_({ goods_piece_ratio, num }), goods_piece_ratio.area, price);
            }
        },
        priceShowUnit_() {//显示的价格
            return ({ goods_piece_ratio}) => {
                return goods_piece_ratio.price_show_unit || ''
            }
        },
        showChecked_() {
            return this.hasCheckedMode.includes(this.mode) || this.editFlag
        },
        list_() {
            return this.list.length ? this.list : this.value;
        },
        priceSale_() {
            return ({ goods_piece_ratio}) => {
                return Number(goods_piece_ratio.price_sale ? goods_piece_ratio.price_sale : 0).toFixed(2)
            }
        },
        priceSaleUnitFn_() {
            return ({ goods_piece_ratio}) => {
                return goods_piece_ratio.price_sale_unit ? goods_piece_ratio.price_sale_unit.substr(1) : ''
            }
        },
        areaUnitFn_() {
            return ({ goods_piece_ratio}) => {
                return goods_piece_ratio.area_unit ? goods_piece_ratio.area_unit : ''
            }
        },
        priceStockUnitFn_() {
            return ({ goods_piece_ratio}) => {
                return goods_piece_ratio.price_stock_unit ? goods_piece_ratio.price_stock_unit.substr(1) : ''
            }
        },
        saleSetFn_() {
            return ({ sale_set, goods_piece_ratio }) => {
                return sale_set === 1 && goods_piece_ratio
            }
        },
        isOrder_() {
            return this.orderMode.includes(this.mode);
        },
        mode_(){
            return this.smallClassMode.includes(this.mode) ? 'small' : this.mode;
        },
        listClass_() {
            let listClass = '';
            listClass += 'goods-list-box__' + this.mode_;
            listClass += this.editFlag ? ' goods-list-box__edit' : '';
            return  listClass;
        },
        options_() {
            let options_ = this.options.concat();
            options_[0].text = this.optionsText;
            return options_;
        },
        swipeAction_() {
            return String(this.swipeAction) === 'false' ? false : true;
        },
        rightOptions_() {
            return this.swipeAction_ && !this.editFlag ? this.options_ : []
        },
        disabled_() {
            return String(this.disabled) === 'false' ? false : true;
        }
    },
    methods: {
        // 修改数量回调
        async changeBuyNum(e) {
            let val = e.detail.value;
            if(val > this.editData.max) return this.$toast('单个商品最多只能买' + this.editData.max);
            let index = this.list_.findIndex(o => o.cart_id === this.editData.cart_id);
            if(index !== -1){
                this.$set(this.list_[index], 'num', val);
                this.$c.debounce(addCart, 500)
            }
            let that = this;
            function addCart() {
                setTimeout(async () => {
                    await that.$http('addCart', {
                        num: val,
                        goods_id: that.editData.goods_id,
                        goods_sku_id: that.editData.goods_sku_id,
                        is_change: 1
                    }, {
                        loading: !that.list_[index].checked,
                        toast: false
                    });
                    that.list_[index].checked && that.$emit('addCart');
                })
            }
        },
        /**
         *  按钮加减购物车商品
         *  cart_id         当前修改的购车车
         *  num             当前的数量
         *  goods_stock     当前商品的库存
         *  value             加减的数量
         */
        handleAddBtn({ cart_id, num, goods_stock, goods_sku_id, goods_id }, value) {
            if(num === 1 && value === -1) return ;//商品数量只有1
            this.editData = {
                cart_id,
                goods_id,
                goods_sku_id,
                max: this.buyMax < goods_stock ? this.buyMax : goods_stock
            }
            this.changeBuyNum({
                detail: {
                    value: this.$c.calcFn.add(num, value)
                }
            });
        },
        /**
         *  显示input输入框
         *  cart_id         当前修改的购车车
         *  num             当前的数量
         *  goods_stock     当前商品的库存
         */
        showInputModal({ cart_id, num, goods_stock, goods_sku_id, goods_id }) {
            this.inputFlag = true;
            this.editData = {
                cart_id,
                goods_id,
                goods_sku_id,
                max: this.buyMax < goods_stock ? this.buyMax : goods_stock,
                current: num
            };
        },
        //加入购物车
        handleJoin(item) {
            this.specData = item;
            this.specFlag = true;
        },
        /**
         * 所有跟父组件的emit操作
         * emitName String emit名称   父组件@emitName
         * pro [String, Boolean] this下面的对象
         * value anying emit要返回的参数,如果存在这个值value就无效this[pro]则不会被返回
         */
        handleOperation(emitName, pro = false, value = null) {
            pro && (this[pro] = !this[pro]);
            if(emitName === 'change') {
                this.$emit(emitName, value);
            }else{
                this.$emit(emitName, {
                    e: 'click',
                    detail: {
                        value: value !== null ? value : pro && this[pro]
                    }
                })
            }
        },
        goodsItemClick({goods_id, id}) {
            if(this.jumpMode.includes(this.mode)){
                this.$jumpDetail('goodsDetails', goods_id ? goods_id : id)
            }
            // this.$emit("click",id)
        },
        async handleChange(type, order){

            if(type === 'refund_order') {
                this.$jumpDetail('refuseAfterSale', order.id)
                return
            }
            if(type === 'refunding_order'){
                this.$jumpDetail('refuseDetails', order.order_return_id)
                return
            }
            if(type === 'again_order'){
                let promiseAll = [];
                this.$loading('正在购物车')
                promiseAll.push(this.$http('addCart', {
                    num: order.buy_num,
                    goods_id: order.goods_id,
                    goods_sku_id: order.goods_sku_id,
                    is_change: 0
                }, {
                    loading: false
                }))
                Promise.all(promiseAll).finally(()=>{
                  setTimeout(() =>{
                    this.$hideLoading();
                    this.$jump('shoppingCart')
                  }, 1000)
                })
            }
        }
    }
}