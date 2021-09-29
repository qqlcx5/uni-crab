<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-08-03 10:44:50
-->
<template>
    <view>
        <template v-if="iconStyle_ === 'style1'">
            <c-icons-style1
                :type="type_"
                :color="color"
                :size="size"
                :spin="spin"
                :rotate="rotate"
                @click="onClick"
            />
        </template>
        <template v-else-if="iconStyle_ === 'style2'">
            <c-icons-style2
                :type="type_"
                :color="color"
                :size="size"
                :spin="spin"
                :rotate="rotate"
                @click="onClick"
            />
        </template>
        <template v-else-if="iconStyle_ === 'style3'">
            <c-icons-style3
                :type="type_"
                :color="color"
                :size="size"
                :spin="spin"
                :rotate="rotate"
                @click="onClick"
            />
        </template>
    </view>
</template>

<script>
import cIconsMixins from './mixins/index'
const { props, methods, name } = cIconsMixins
export default {
    mixins: [{ props, methods, name }],
    computed: {
        iconStyle_() {
            return this.shopConfig_ && this.shopConfig_.iconStyle ? this.shopConfig_.iconStyle : 'style1'
        },
        type_() {
            const types = this.type.split('-')
            if (['tarbar'].includes(types[0])) return this.type
            types.splice(1, 0, this.iconStyle_)
            return types.join('-')
        }
    }
}
</script>
