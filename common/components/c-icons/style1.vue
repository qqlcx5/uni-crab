<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-05-29 09:58:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-28 16:45:26
-->
<template>
    <view
        class="c-icons iconstyle1"
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
    name: 'CIconsStyle1',
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
