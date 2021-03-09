
import {
    mapActions
} from 'vuex'
export default {
    data() {
        return {
            selectAddress: false,
            goodsInfo: {}, // 所有数据
            selectAddressFlag: false,
            selectSpecFlag: false,
            action: 0,
            isCollect: false,
            tempAddr: {},
            titleStyle: {
                width: '104rpx',
                fontSize: '26rpx',
                fontWeight: 'bold',
                color: '#333333',
                flex: '0 0 auto'
            },
            labelStyle: {
                borderLeft: '4rpx solid #FD6B03',
                color: '#333333',
                paddingLeft: '10rpx'
            },
            lineStyle: {
                left: '132rpx',
                right: '0rpx'
            },
            valueStyle: {
                fontSize: '26rpx',
                justifyContent: 'flex-start',
                color: '#333'
            },
            productImg: '',
            timer: null,
            outState: false,
            goodsId: '', //商品id
            activity_id: '',
            activity_type: '',
            curSkuInfo: null,
            defaultSku: null,
            modalFlag: false,
            cartCount: 0, //购物车数量
            detailFinish: false,//详情接口是否请求完毕
        };
    },
    onLoad() {
        let {
            detailId,
            activity_id,
            activity_type
        } = this.$Route.query;
        !isNaN(detailId) ? (this.goodsId = detailId * 1) : '';
        !isNaN(activity_id) ? (this.activity_id = activity_id * 1) : '';
        !isNaN(activity_type) ? (this.activity_type = activity_type * 1) : '';
        if (!this.goodsId) {
            return this.$back();
        }
        this.handleGoodsDetails();
        // 获取购物车商品数量
        this.handleAddCart();
    },
    computed: {
		activityInfo_() {
			return this.goodsInfo.activity_info ? this.goodsInfo.activity_info : {
				joint_quantity: this.$c.numFormat(null),
				sales: this.$c.numFormat(null),
				msg: ''
			};
		},
        isCommission_() {
            return this.goodsInfo.is_commission === 1 && this.goodsInfo.commission_rate * 1 > 0
        },
        //商品主图
        goodsImgs() {
            return this.goodsInfo.goods_imgs ? this.goodsInfo.goods_imgs : [];
        },
        shareImg_() {
            return this.goodsImgs[0] ? this.goodsImgs[0] : '';
        },
        curSkuInfo_() {
            return this.curSkuInfo ? this.curSkuInfo : {
                price_show: this.$c.numFormat(this.goodsInfo.price_show),
                price_market: this.$c.numFormat(this.goodsInfo.price_market)
            };
        },
        defaultSku_() {
            return this.defaultSku ? this.defaultSku : this.goodsInfo.default_sku;
        },
        // 已选 sku
        defaultSkuText_() {
            // 初始化进入页面报错map问题
            if (!this.defaultSku_ || !this.defaultSku_.length) return false
            const arr = this.defaultSku_.map(v => {
                return v.attr_value
            })
            return arr.join('-')
        },
        saleSet_() {
            return this.goodsInfo.sale_set === 1;
        },
        completeAddr_() {
            if (this.tempAddr && !this.tempAddr.province) return '请选择送至地址'
            if (this.tempAddr.province && this.tempAddr.province.label) return `${this.tempAddr.province.label} ${this.tempAddr.city.label} ${this.tempAddr.district.label}`
            return `${this.tempAddr.province} ${this.tempAddr.city} ${this.tempAddr.district}`
        },
        priceShowUnit_() {
            return this.saleSet_ && this.goodsInfo.goods_piece_ratio ? this.goodsInfo.goods_piece_ratio.price_show_unit : '';
        },
        priceSaleUnit_() {
            return this.saleSet_ && this.goodsInfo.goods_piece_ratio ? (this.goodsInfo.goods_piece_ratio.price_sale_unit ? this.goodsInfo.goods_piece_ratio.price_sale_unit.substr(1) : '') : '';
        },
        // 运费
        shippingFee_() {
            if (Number(this.goodsInfo.shipping_fee)) return `¥${this.goodsInfo.shipping_fee}`
            return '包邮商品'
        },
        commission_() {
            let {
                is_commission,
                commission_rate
            } = this.goodsInfo
            return is_commission && Number(commission_rate)
        }
    },
    watch: {
        async goodsInfo(val) {
            let {
                data: {
                    token = false
                }
            } = await this.$http('wxuserinfo', null, {
                source: 'catch'
            });
            if (token) this.getCollectState();
        },
        productImg(val) {
            this.resetAni();
            this.outState = true;
            val && this.handleAddCart();
            this.timer = setTimeout(() => {
                this.resetAni();
                this.productImg = '';
            }, 1500)
        }
    },
    methods: {
        ...mapActions('common', ['favoritesSave', 'hasFavorite', 'favoritesCancel']),
        showShareModal() {
            this.modalFlag = true;
        },
        // 重置购物车动画
        resetAni() {
            clearTimeout(this.timer);
            this.timer = null
            this.outState = false;
        },
        // 获取商品详情
        async handleGoodsDetails() {
            let {
                data
            } = await this.$http('goodsDetails', {
                goods_id: this.goodsId,
                activity_type: this.activity_type,
                activity_id: this.activity_id,
            });
            let {
                goods_name,
                goods_img
            } = data;
            this.detailFinish = true;
            this.goodsInfo = data;
            this.group_info = data.group_info;
            this.shareParams = {
                imageUrl: goods_img,
                title: goods_name,
                summary: '好物分享'
            }
            //this.h5Share();
        },
        changeSpec(e) {
            this.defaultSku = e.detail.sku;
            e.detail.product_img && (this.productImg = e.detail.product_img);
            this.curSkuInfo = e.detail.skuInfo;
        },

        // 瞄点功能
        async handleTab(val) {
            let data = await this.$c.getRect.call(this, ".top0,.top1,.top2,.top3");
            let nodeInfo = [];
            let height = data[1].height;
            let top = data[0].top;
            val = val.detail.value;
            data.forEach(o => {
                nodeInfo.push(o.top - top - height);
            });
            let scrollTop = nodeInfo[val + 1] > 0 ? nodeInfo[val + 1] : 0;
            uni.pageScrollTo({
                scrollTop: scrollTop,
                duration: 150
            });
        },
        handleSelectAddress() {
            this.selectAddressFlag = true
        },
        // 选择地址
        handleAddress(e) {
            if (e.detail) this.tempAddr = e.detail
            this.selectAddressFlag = false
        },
        async getCollectState() {
            let res = await this.hasFavorite({
                id: this.goodsId
            });
            this.isCollect = res.data;
        },
        handleToCart() {
            this.$jump("shoppingCart");
        },
        handleSelectSpec(val) {
            // if(!this.goodsInfo.default_sku || !this.goodsInfo.default_sku.length) return
            if (val === 2 && this.goodsInfo.activity_info) {
                if (this.goodsInfo.activity_info.status === 0) {
                    return this.$toast('秒杀已经结束');
                }
            }
            this.action = val;
            this.selectSpecFlag = true;
        },
        async handleCollect() {
            if (this.isCollect) {
                await this.favoritesCancel({
                    id: this.goodsId
                });
            } else {
                await this.favoritesSave({
                    id: this.goodsId
                });
            }
            this.getCollectState();
        },
        async handleAddCart() {
            let {
                data
            } = await this.$http('userInfo', {}, {
                source: 'catch'
            });
            console.log(data);
            if (Object.keys(data).length) {
                const {
                    data
                } = await this.$http('orderCart')
                this.cartCount = data.buy_unit_count
            }
        }
    }
}
