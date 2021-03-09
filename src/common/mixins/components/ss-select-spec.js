export default {
	props: {
		config: {
			type: Object,
			default: () => {
				return {};
			}
		},
		value: {
			type: Boolean,
			default: false
		},
		/**
		 * 0 显示全部
		 * 1 加入购物车
		 * 2 立即购买
		 * 3 拼团单独购买
		 */
		action: {
			type: [Number, String],
			default: 0
		},
		addressId: { //地址id
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			btnStyles: {
				join: { //加入购物车主题
					theme: ['s1', '#fff'],
					pro: ['bgc', 'c']
				},
				buy: { //立即购买主题
					theme: ['t', '#fff'],
					pro: ['bgc', 'c']
				}
			},
			specIndex: -1,
			pageData: {},
			modalFlag: false,
			goods_sku_attr_value: [], // sku相关信息
			goods_sku_relation: [], //sku关联组合信息
			tempCurSku: {},
			btnAction: null,
			saleSet: 0
		};
	},
	computed: {
		activityInfo_() {
			return this.config.activity_info ? this.config.activity_info : {};
		},
		action_() {
			return parseInt(this.action);
		},
		selectSpec_() {
			let arr = []
			//如果没有规格则选中主商品  主商品规格id为0
			if (this.goods_sku_attr_value.length === 0) return [{
				id: 0
			}];
			this.goods_sku_attr_value.forEach(po => {
				arr.push(po.goods_type_attr.find(o => o.checked))
			})
			return arr
		},
		selectSpecText_() {
			return this.selectSpec_.map(o => o.attr_value).join(' - ')
		},
		selectIds_() {
			return this.selectSpec_.map(o => String(o.id))
		},
		saleSet_() { //是否开启件数比
			return this.saleSet === 1;
		},
		curSku_() {
			return this.goods_sku_relation.find(o => this.$c.isArrayEqual(o.goods_sku_values, this.selectIds_)) || {
				price_show: this.$c.numFormat(null),
				price_market: this.$c.numFormat(null),
				price_sale: this.$c.numFormat(null),
				sku_able_stock: this.$c.numFormat(null)
			}
		},
		priceSale_() {
			return this.$c.numFormat(this.curSku_.price_sale);
		},
		skuStock_() {
			return this.$c.numFormat(this.curSku_.sku_able_stock, 'stock');
		},
		priceShowUnit_() {
			return this.curSku_.price_show_unit || '';
		},
		priceSaleUnit_() {
			return this.curSku_.price_sale_unit ? this.curSku_.price_sale_unit.substr(1) : '';
		},
		priceStockUnit_() { //售卖单位
			return this.curSku_.price_stock_unit ? this.curSku_.price_stock_unit.substr(1) : '';
		},
		area_() {
			return this.curSku_.area_ ? (this.curSku_.area_ * 1 + this.curSku_.area_unit) : '';
		},
		totalArea_() {
			if (!this.tempCurSku.area || !this.tempCurSku.num) return 0;
			return this.$c.calcFn.mul(this.tempCurSku.area, this.tempCurSku.num);
		},
		maxNum_() {
			return this.tempCurSku.num >= this.skuStock_;
		},
		minNum_() {
			return this.tempCurSku.num <= 1
		},
		priceShow_() { // 显示价格, action为3, 显示拼团单买价
			if (this.action_ == 3) return this.$c.numFormat(this.curSku_.price_joint_origin);
			return this.$c.numFormat(this.curSku_.price_show);
		}
	},
	watch: {
		config(val) {
			if (val.id) {
				this.handleGoodsSkuInfo()
			}
		},
		curSku_(newVal) {
			let tempCurSku = this.$deepClone(newVal);
			tempCurSku.num = this.skuStock_ >= 1 ? 1 : 0;
			this.tempCurSku = tempCurSku;
		},
		value: {
			handler(val) {
				this.modalFlag = val;
			},
			immediate: true
		},
		modalFlag(val) {
			this.$emit('input', val);
			if (!val && this.tempCurSku.id) {
				this.$emit('change', {
					type: 'change',
					detail: {
						sku: this.selectSpec_,
						product_img: this.btnAction === 'join' ? this.curSku_.product_img : '',
						skuInfo: this.curSku_
					}
				})
			} else {
				this.btnAction = null;
			}
		}
	},
	methods: {
		handleSelect(pIndex, index) {
			this.goods_sku_attr_value[pIndex].goods_type_attr.forEach((o, i) => {
				o.checked = index === i ? true : false
			})
			this.$set(this.goods_sku_attr_value, pIndex, this.goods_sku_attr_value[pIndex]);
		},
		handleDefault() {
			let defaultLen = this.config.default_sku ? this.config.default_sku.length : 0;
			if (defaultLen && defaultLen === this.goods_sku_attr_value.length) {
				this.config.default_sku.forEach(dor => {
					this.goods_sku_attr_value.forEach((po, pi) => {
						let index = po.goods_type_attr.findIndex(o => o.id === dor.id);
						index !== -1 && this.$set(this.goods_sku_attr_value[pi].goods_type_attr[index], 'checked', true)
					})
				})
			} else {
				this.goods_sku_attr_value.forEach((o, i) => {
					this.handleSelect(i, 0);
				})
			}
			this.$nextTick(() => {
				this.$emit('change', {
					type: 'change',
					detail: {
						sku: this.selectSpec_,
						skuInfo: this.curSku_
					}
				})
			})
		},
		async handleGoodsSkuInfo() {
			let params = {
				goods_id: this.config.id,
			}
			if (this.activityInfo_.id) {
				params.activity_id = this.activityInfo_.id;
				params.activity_type = this.activityInfo_.activity_type;
			}
			let {
				data
			} = await this.$http('goodsSkuInfo', params);
			this.goods_sku_relation = data.goods_sku_relation
			this.goods_sku_attr_value = data.goods_sku_attr_value
			this.saleSet = data.sale_set;
			this.handleDefault()
		},
		handleUpdateNum(isAdd) {
			let num = this.tempCurSku.num
			if (isAdd) {
				if (num < this.skuStock_) {
					this.$set(this.tempCurSku, 'num', ++num)
				}
			} else {
				if (num > 1) {
					this.$set(this.tempCurSku, 'num', --num)
				}
			}
		},
		async handleSubmit(action) {
			if (!this.curSku_.goods_stock || !this.curSku_.goods_stock.sku_able_stock) {
				return this.$toast('该商品暂无库存');
			}
			if (this.activityInfo_.activity_type === 3 && this.activityInfo_.is_new_user !== 1) {
				return this.$toast('新人专享商品');
			}
			let shareData = uni.getStorageSync(this.$config.shareOriginName) || {};
			let shareUserId = shareData.routeName === this.$Route.name && this.config.id * 1 === shareData.detailId * 1 ?
				shareData.parent_id : '';
			let params = {
				goods_id: this.tempCurSku.goods_id,
				goods_sku_id: this.tempCurSku.id,
				num: this.tempCurSku.num
			}
			if (action === 'join') { //加入购物车
				params.is_change = 0;
				await this.$http('addCart', params)
				this.btnAction = action;
				this.modalFlag = false;
			} else {
				shareUserId ? (params.share_user_id = shareUserId) : '';
				// 活动id, activity_id: 1秒杀, 2拼团, 3拼团单独购买
				if (this.tempCurSku && this.tempCurSku.activity_id && this.action_ !== 3) {
					params.activity_type = this.tempCurSku.activity_type,
						params.activity_id = this.tempCurSku.activity_id,
						params.activity_sku_id = this.tempCurSku.activity_sku_id
				}
				this.config.activity_order_id ? (params.activity_order_id = this.config.activity_order_id) : '';
				this.addressId && (params.address_id = this.addressId);
				this.$jump('orderConfirm', params)
			}
		}
	}
}
