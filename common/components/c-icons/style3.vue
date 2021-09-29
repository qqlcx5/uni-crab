<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-08-03 10:44:50
-->
<template>
    <view
        class="c-icons iconstyle3"
        :style="[parentObj_]"
    >
        <text
            class="c-icons__text"
            :style="[styleObj_]"
            :class="[iconName, type]"
            @click="onClick"
        ></text>
    </view>
</template>

<script>
import cIconsMixins from './mixins/index'
export default {
    name: 'CIconsStyle3',
    mixins: [cIconsMixins]
}
</script>

<style scoped lang="scss">
// @import '~@/common/styles/iconfont.css';
/* #ifndef APP-PLUS-NVUE */
@import './fonts/iconfont-style1.css'; //独有样式
/* #endif */

.c-icons {
    @include flex(row);
    font-size: 0;
    @include tst(transform);

    &__text {
        vertical-align: middle;
        line-height: 1;
    }
}
</style>
