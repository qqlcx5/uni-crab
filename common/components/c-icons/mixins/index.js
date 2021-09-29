/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-08-03 10:44:50
 */
export default {
    name: 'c-icons',
    props: {
        type: {
            type: String,
            default: ''
        },
        color: {
            type: [String, Boolean],
            default: false
        },
        size: {
            type: [Number, String],
            default: 28
        },
        spin: {
            type: Boolean,
            default: false
        },
        rotate: {
            type: [Number, String, Boolean],
            default: false
        }
    },
    computed: {
        iconName() {
            const prevName = this.type.split('-')[0]
            return prevName === 'icon' ? 'iconfont' : prevName
        },
        rotate_() {
            return String(this.rotate) === 'false' ? false : this.rotate
        },
        styleObj_() {
            const obj = {
                fontSize: String(this.size).indexOf('px') !== -1 ? this.size : uni.upx2px(this.size) + 'px'
            }
            String(this.color) !== 'false' && (obj['color'] = this.color)
            return obj
        },
        parentObj_() {
            const obj = {}
            // obj.height = String(this.size).indexOf('px') !== -1 ? this.size : uni.upx2px(this.size) + 'px'
            this.rotate_ && (obj.transform = isNaN(this.rotate) ? `rotate(${this.rotate})` : `rotate(${this.rotate}deg)`)
            if (this.spin) {
                obj.animation = 'c-icon-spin 1.5s linear infinite'
            }
            return obj
        }
    },
    methods: {
        onClick(e) {
            this.$emit('click', e)
        }
    }
}
