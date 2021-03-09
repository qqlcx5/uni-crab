export default {
    name: 'ss-list',
    props: {
        list: {
            type: Array,
            default: () => {
                return []
            }
        },
        noData: {
            type: Boolean,
            default: false
        },
        noPadding: {
            type: [ Boolean, String ],
            default: false
        },
        lodingText: {
            type: String,
            default: ''
        },
        waterfall: {
            type: [ Boolean, String ],
            default: true
        },
        /**
         * 展示模式
         * column 2列
         * row 一行
         */
        mode: {
            type: String,
            default: 'column'
        },
        /**
         * normal 正常产品列表
         * decoration 案例列表
         * case 案例列表
         * setMeal 套餐包
         * hotSelling 热销爆品
         * seckill 限时秒杀
         */
        type: {
            type: String,
            default: 'normal'
        },
        /**
         * 支持数字或者百分比，如果是横竖切换的布局，传入逗号分隔的字符串：column的宽，row的宽, imgWidth > imgSize, imgHeight > imgSize
         */
        imgSize: {
            type: [String, Number, Array],
            default: 200
        },
        /**
         * 同imgSize
         */
        imgWidth: {
            type: [String, Number, Array],
            default: ''
        },
        /**
         * 同imgSize
         */
        imgHeight: {
            type: [String, Number, Array],
            default: ''
        },
        /**
         * 如果是横竖切换的布局，传入逗号分隔的字符串：column的圆角，row的圆角
         */
        radius: {
            type: [String, Number, Array],
            default: 16
        },
        /**
         * 默认继承radius
         */
        imgRadius: {
            type: [String, Number, Array],
            default: 0
        },
        /**
         * 要显示的图片 key值
         */
        imgKey: {
            type: String,
            default: 'goods_img'
        },
        /**
         * 要显示的拼团人员 key值
         */
        userImgKey: {
            type: String,
            default: 'user_imgs'
        },
        /**
         * 要显示的title key值
         */
        titleKey: {
            type: String,
            default: 'goods_name'
        },
        /**
         * title显示几行开始点点点  仅支持false  1 2 3这4个参数
         */
        ellipsis: {
            type: [String, Number],
            default: 2
        },
        titleSize: {
            type: [String, Number],
            default: 28
        },
        bgColor: {
            type: String,
            default: '#f5f5f5'
        },
        loadingStyle: {
            type: Object,
            default: () => {
                return {}
            }
        }

    },
    computed: {
        waterfall_() {
            return String(this.waterfall) === 'false' ? false : true;
        },
        noPadding_() {
            return String(this.noPadding) === 'false' ? false : true;
        },
        imgWidth_() {
            return this.formatData(this.imgWidth, this.imgSize);
        },
        imgHeight_() {
            return this.formatData(this.imgHeight, this.imgSize);
        },
        radius_() {
            return this.formatData(this.radius);
        },
        listLen_() {
            return this.list.length;
        },
        listGroupStyle_() {
            return {
                borderRadius: this.getPX(this.radius_)
            }
        },
        imgRadius_() {
            return this.formatData(this.imgRadius, this.radius_, true);
        },
        imgStyle_() {
            let radius = this.getPX(this.imgRadius_);
            return {
                width: this.getPX(this.imgWidth_),
                height: this.getPX(this.imgHeight_),
                borderRadius: this.mode === 'row' ? radius : `${radius} ${radius} 0 0`
            }
        },
        titleClass_() {
            let titleClass = {};
            String(this.ellipsis) !== 'false' && (titleClass = 'c-ellipsis-' + this.ellipsis);
            return titleClass;
        },
        titleStyle_() {
            let fontSizes = this.formatData(this.titleSize);
            return {
                fontSize: this.getPX(fontSizes)
            }
        },
        itemObj_() {
            return {
                titleStyle: this.titleStyle_,
                titleClass: this.titleClass_,
                imgStyle: this.imgStyle_,
                listGroupStyle: this.listGroupStyle_,
                titleKey: this.titleKey,
                imgKey: this.imgKey,
                userImgKey: this.userImgKey,
                type: this.type,
                mode: this.mode,
                waterfall: this.waterfall_
            }
        },
        itemObjNormal_ () {
            return (index) => {
                return {
                    ...this.itemObj_,
                    index
                }
            }
        }
    },
    methods: {
        formatData(any, oAny, existZero = false) {
            any = existZero ? (any !== undefined ? any : oAny) : (any || oAny);
            any = String(any).split(',');
            if (any.length < 2) {
                any.push(any[0]);
            }
            return any;
        },
        getPX(arr, deault = 0) {
            var val = this.mode === 'column' ? arr[0] : arr[1];
            return !val ? deault : (!isNaN(val) ? (val + 'rpx') : val);
        },
        goDetial(item) {
            let routeName = "", id="", params = {};
            switch (this.type) {
                case "decoration":
                    routeName = 'decorationDetails';
                    id = item.id;
                    break;
                case "setMeal":
                    routeName = 'setMealDetails';
                    id = item.id;
                    break;
                case "case":
                    routeName = 'caseDetails';
                    id = item.id;
                    break;
                case "group":
                    routeName = 'groupDetails';
                    params.activity_id = item.id;
                    params.activity_type = item.activity_type;
                    id = item.goods_id;
                    break;
                case "groupDetails":
                    routeName = 'groupDetails';
                    params.activity_id = item.id;
                    params.activity_type = item.activity_type;
                    params.activity_order_id = item.order_id;
                    id = item.goods_id;
                    break;
                case "seckill":
                    params.activity_id = item.id;
                    params.activity_type = item.activity_type;
                    routeName = 'seckillDetails';
                    id = item.goods_id;
                    break;
                case "giftPack":
                    params.activity_id = item.id;
                    params.activity_type = item.activity_type;
                    routeName = 'goodsDetails';
                    id = item.goods_id;
                    break;
                default:
                    routeName = 'goodsDetails';
                    id = item.id;
            }
            this.$jumpDetail(routeName, id, params);
        }
    }
}