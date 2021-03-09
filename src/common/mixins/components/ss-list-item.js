export default {
    computed: {
        priceShow_() {
            return this.$c.numFormat(this.itemData.price_show);
        },
        priceMarket_() {
            return this.$c.numFormat(this.itemData.price_market);
        },
        priceShowUnit_() {
            let { goods_piece_ratio = {} } = this.itemData
            return goods_piece_ratio ? goods_piece_ratio.price_show_unit : ''
        },
        priceSale_() {
            let { goods_piece_ratio = {} } = this.itemData;
            return goods_piece_ratio ? this.$c.numFormat(Number(goods_piece_ratio.price_sale).toFixed(2)): ''
        },
        saleSet_() {
            let { goods_piece_ratio, sale_set } = this.itemData
            return sale_set === 1 && goods_piece_ratio
        },
    },
    props: {
        itemData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        itemObj: {
            type: Object,
            default: () => {
                return {}
            }
        }
    }
}