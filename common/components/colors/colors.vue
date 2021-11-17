<template>
    <view
        class="c-colors"
        :style="[ viewcolorsStyle_ ]"
        @click="onClick"
    >
        <slot></slot>
    </view>
</template>

<script>
// #ifdef APP-PLUS-NVUE
import { formatUnit } from '@/common/utils'
// #endif
const colorEnum = {
    t: 'theme',
    s1: 'subColor1',
    s2: 'subColor2'
}
const proEnum = {
    c: 'color',
    bgc: 'backgroundColor',
    bglg: 'backgroundImage',
    bdc: 'borderColor'
}
export default {
    name: 'CColors',
    props: {
        // 多个颜色选择  c, bgc
        pro: {
            type: Array,
            default: () => {
                return ['c']
            }
        },
        /**
         * 跟pro个数对应，如果只有一个则取相同
         * 如果pro中设置了bglg,则对应项应为：'角度|渐变开始颜色|渐变结束颜色'
         * 如果是透明度  请传入    颜色|透明度
         * */
        theme: {
            type: Array,
            default: () => {
                return ['t']
            }
        },
        /**
         * 子元素是圆角的话  背景颜色继承会有问题，所以这边要设置背景颜色（H5端、app端）
         * */
        radius: {
            type: [String, Number],
            default: 0
        },
        /**
         * 继承者类型，这边针对按钮有透明度的处理
         * */
        type: {
            type: String,
            default: 'view'
        }
    },
    data() {
        return {
            defaultColors: {
                theme: '#eee',
                subColor1: '#eee',
                subColor2: '#eee'
            },
            themeColors: null
        }
    },
    computed: {
        colors_() {
            return this.shopConfig_ && this.shopConfig_.color ? this.shopConfig_.color : this.defaultColors
        },
        colorsStyle_() {
            const colorsStyle = {}
            if (this.radius) {
                colorsStyle.borderRadius = this.$c.formatUnit(this.radius)
            }
            this.pro.forEach((key, index) => {
                const cKey = this.theme[index] ? this.theme[index] : this.theme[0]
                colorsStyle[proEnum[key]] = this.getColor(cKey, key)
            })
            // 如果背景色是透明的(设计要求，如果按钮背景是透明度的，字体要变成主色，边框也是主色)
            if (this.type === 'button') {
                const theme = this.colors_[colorEnum['t']]
                const backgroundColor = colorsStyle['backgroundColor'] ? colorsStyle['backgroundColor'].replace(/ /g, '').toLowerCase() : false
                backgroundColor && !colorsStyle.borderColor ? (colorsStyle.borderColor = backgroundColor) : ''
                if (this.isAlpha(colorsStyle['backgroundColor'])) {
                    colorsStyle.color = theme
                    colorsStyle.borderColor = theme
                }
            }
            return colorsStyle
        },
        viewcolorsStyle_() {
            return this.type === 'button' ? {} : this.colorsStyle_
        }
    },
    created() {
        // #ifdef APP-PLUS-NVUE
        !this.$c ? (this.$c = {}) : ''
        this.$c.formatUnit = formatUnit
        // #endif
        // 如果网络加载缓慢就换上这个主题色
        setTimeout(() => {
            this.defaultColors = {
                theme: '#FF5D0C',
                subColor1: '#FFAE37',
                subColor2: '#FF5D0C'
            }
        }, 1000)
    },
    methods: {
        getColor(cKey, key = 'c', splitKey = '|') {
            const cKeyArr = cKey.split(splitKey)
            if (key === 'bglg' && cKeyArr.length === 3) { // 渐变
                return `linear-gradient(${cKeyArr[0]},${this.getColor(cKeyArr[1], key, '^')} 0%,${this.getColor(cKeyArr[2], key, '^')} 100%)`
            } else if (cKeyArr.length === 2) { // 透明度
                const colors = colorEnum[cKeyArr[0]]
                return this.$c.colorToRgba(colorEnum.hasOwnProperty(cKeyArr[0]) ? this.colors_[colors] : colors || cKeyArr[0], cKeyArr[1])
            } else {
                return colorEnum.hasOwnProperty(cKey) ? this.colors_[colorEnum[cKey]] : cKey
            }
        },
        // 透明度？要么长度为9#00000000 或者rgba(0,0,0,0)
        isAlpha(color) {
            if (!color) return false
            color = String(color)
            if (color.length === 9) return true
            color = color.split(',')
            if (color.length < 4) return false
            return color[3].split(')')[0] * 1 !== 1
        },
        onClick(e) {
            this.$emit('click', e)
        }
    }
}
</script>

<style lang="scss" scoped>
.c-colors {
    @include flex(column);
    /* #ifndef APP-PLUS-NVUE */
    @include tst((color, background-color, opacity));
    /* #endif */
}
</style>
