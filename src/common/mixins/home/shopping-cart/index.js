  import { mapActions } from 'vuex'
	export default {
        data() {
            return {
                shopList: [],
                invilidShopList: [],
                isEdit: false,
                favoritesFlag: false,
                reqName: 'orderCart',
                pageSize: 100,
                goodsPrice: 0,
                noDataText: '亲，购物车还没商品哦~',
                autoReq: false,
                isFirst: true,
                goodsStock: false,
                goodsStockContent: '',
                popupTitle: ''
            }
        },
        computed: {
            showTab_() {
                return this.shopList.length > 0;
            },
            selectIds_() {
                 return this.shopList.filter(o => o.checked).map(o => o.cart_id);
            },
            selectNum_() {
                return this.selectIds_.length;
            },
            selectedAll_() {
                return this.shopList.length === this.selectNum_;
            },
            popupFlag_() {
                return this.goodsStock || this.favoritesFlag;
            }
        },
        onShow() {
            this.initPage();
        },
        watch: {
            pageList: {
                handler(val) {
                    // is_on_sale   0：未上架，1：已上架
                    // goods_stock  库存，小于0不能购买
                    let prevSelIds = uni.getStorageSync('curShopingCartSelId') || [];
                    this.shopList = val.filter(o => o.is_on_sale === 1 && o.goods_stock > 0).map(o => {
                        o.checked = prevSelIds.includes(o.cart_id);
                        return o;
                    });
                    this.invilidShopList = val.filter(o => o.is_on_sale === 0 || o.goods_stock <= 0).map(o => {
                        o.invilidText = o.is_on_sale === 0 ? '商品下架' : '商品库存不足'
                        return o;
                    });
                    this.isFirst = false;
                },
                deep: true
            },
            selectNum_() {//不能去watch  因为每次都会改变shopList ，所以只能监听selectIds_
                if(!this.selectNum_){
                    uni.removeStorageSync('curShopingCartSelId');
                    this.goodsPrice = 0;
                }else{
                    uni.setStorageSync('curShopingCartSelId', this.selectIds_);
                    this.confirmOrder();
                }
            }
        },
        methods: {
            ...mapActions('common', ['favoritesSave']),
            showFavorites() {
                if(!this.selectIds_.length) return ;
                this.favoritesFlag = true;
            },
            batchFavoritesSave() {
                this.shopList.filter(o => {
                    if(o.checked){
                        this.favoritesSave({
                            id: o.goods_id,
                            reqConfig: {
                                toast: false,
                                showErr: false
                            }
                        });
                    }
                })
                this.removeSelect();
            },
            //计算商品总价
            async confirmOrder() {
                let { data: { goods_price, goods_stock = [] } } = await this.$http('confirmOrder', {
                    cartId: this.selectIds_.join(',')
                })
                if(goods_stock.length){
                    this.popupTitle = '库存不足提示';
                    let goodsStockContent = [];
                    let promiseArr = [];
                    goods_stock.forEach(o => {
                        goodsStockContent.push(o.goods_name);
                        promiseArr.push(this.$http('addCart', {
                            num: o.sku_able_stock,
                            goods_id: o.goods_id,
                            goods_sku_id: o.goods_sku_id,
                            is_change: 1
                        }, {
                            showErr: false,
                            toast: false
                        }))
                    })
                    await Promise.all(promiseArr);
                    this.goodsStockContent = goodsStockContent.join(',') + '库存不足，系统已帮您校验重新购物车数量';
                    this.goodsStock = true;
                    this.initPage();
                    this.confirmOrder();
                }else{
                    this.goodsPrice = goods_price;
                }
            },
            //确定订单
            orderConfirm() {
                if(!this.selectNum_) return ;
                this.$jump('orderConfirm', {
                    cartId: this.selectIds_.join(',')
                })
            },
            handleSwiper(e) {
                this.removeCart(this.shopList[e.detail.value].cart_id);
            },
            //移除选中
            removeSelect() {
                this.removeCart(this.selectIds_.join(','));
            },
            // 清空失效
            handleInvalid() {
                let ids = this.invilidShopList.map(o => o.cart_id).join(',');
                this.removeCart(ids);
            },
            /**
             * 清空购物车商品
             *
             */
            async removeCart(ids) {
                let { msg, data } = await this.$http('removeCart', {
                    ids
                });
                if(data.failure && data.failure.length){
                    this.$toast('清空失败');
                }
                if(data.success && data.success.length){
                    this.initPage();
                }
            },
            handleEdit(e) {
                this.isEdit = e.detail.value;
                if (!this.isEdit) {
                    this.invilidShopList.forEach((o, index) => {
                        this.$set(this.invilidShopList[index], 'checked', false);
                    });
                }
            },
            handleCheckbox(e, isAll) {
                let val = e.detail.value;
                let shopList = [].concat(this.shopList);
                if (isAll) {
                    let checked = val[0] === 'all';
                    shopList.forEach(o => o.checked = checked);
                } else {
                    shopList.forEach((o, index) => {
                        o.checked = val.includes(index)
                    })
                }
                this.shopList = shopList;
            }
        }
    }