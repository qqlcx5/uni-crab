<template>
    <view class="c-icons" :style="[ parentObj_ ]">
    	<text :style="[ styleObj_ ]" :class="[
			iconName,
			type
		]" @click="onClick"></text>
    </view>
</template>

<script>
    export default {
        name: "c-icons",
        props: {
            type: {
                type: String,
                default: ""
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
				let prevName = this.type.split('-')[0]
				return prevName === 'icon' ? 'iconfont' : prevName;
			},
            rotate_ () {
              return String(this.rotate) === 'false' ? false : this.rotate;
            },
            styleObj_ () {
                let obj = {
                    fontSize: String(this.size).indexOf('px') !== -1 ? this.size : (uni.upx2px(this.size) + 'px')
                };
                String(this.color) !== "false" && (obj["color"] = this.color);
                return obj;
            },
			parentObj_() {
				let obj = {};
                this.rotate_ && (obj.transform = isNaN(this.rotate) ? `rotate(${this.rotate})` : `rotate(${this.rotate}deg)`);
                if (this.spin) {
                    obj.animation = "c-icon-spin 1.5s linear infinite";
                }
				return obj;
			}
        },
        methods: {
            onClick(e) {
                this.$emit("click", e);
            }
        }
    };
</script>

<style scoped lang="scss">
	/* #ifndef APP-PLUS-NVUE */
    @import "@/common/styles/iconfont.css";//公用样式
	/* #endif */
	.c-icons{
		@include flex(row);
        /* #ifndef APP-PLUS-NVUE */
        display: inline-flex;
        /* #endif */
		line-height: 1;
		justify-content: center;
		align-items: center;
		@include tst(transform);
	}
</style>
