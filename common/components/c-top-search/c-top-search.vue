 <template>
    <view class="search-box flex-ajcenter" :style="{backgroundColor: bgColor}">
        <slot></slot>
        <c-input confirm-type="search" :focus="focus_" class="search-box__input flex-1" :radius="32" @click="inputClick" :disabled="!!linkUrl" v-model="keyword" :placeholder="placeholder" :clearable='clearable' @confirm="confirmInput">
            <view class="search-box__before flex-ajcenter" slot="before">
                <c-icons size="32" color="#999999" type="icon-sousuo"></c-icons>
            </view>
        </c-input>
        <view class="search-box__after" v-if="mode === 'listMode'" @click="changeMode">
            <c-icons v-if="newListMode === 'column'" size="48" color="#999999" type="icon-shupai"></c-icons>
            <c-icons v-else type="icon-hengpai" size="48" color="#999999"></c-icons>
        </view>
        <view class="search-box__after" v-if="mode === 'searchText'" @click="confirmInput">搜索</view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                keyword: '',
                newListMode: ''
            }
        },
        props: {
            /**
             * listMode 列表模式，带切换的，会有@changeMode事件
             * searchText 搜索字眼  会有@confirm事件
             */
            mode: {
                type: String,
                default: 'none'
            },
            /**
             * 传入Route的name值，点击会跳转
             */
            linkUrl: {
                type: String,
                default: ''
            },
            value: {
                type: String,
                default: ''
            },
			focus: {
                type: [String, Boolean],
                default: false
			},
            bgColor: {
                type: String,
                default: '#fff'
            },
            listMode: {
                type: String,
                default: 'column'
            },
            placeholder: {
                type: String,
                default: '输入搜索关键词'
            },
            clearable: {
                type: Boolean,
                default: false
            }
        },
		computed: {
			focus_() {
				return String(this.focus) === 'false' ? false : true;
			}
		},
        watch: {
            value: {
                handler(val) {
                    this.keyword = val;
                },
                immediate: true
            },
            listMode: {
                handler(val) {
                    this.newListMode = val;
                },
                immediate: true
            },
            keyword(val) {
                this.$emit('input', val)
            }
        },
        methods: {
            changeMode() {
                this.newListMode = this.newListMode === 'column' ? 'row' : 'column'
                this.$emit('changeMode', {
                    type: 'change',
                    detail: {
                        value: this.newListMode
                    }
                });
            },
            inputClick(e) {
                if(!this.linkUrl) return this.$emit('click', e);
                let pages = getCurrentPages();
                if(pages.length > 1 && this.linkUrl.indexOf(pages[pages.length - 2].route) !== -1){
                    this.$back();
                }else{
					this.$jump(this.linkUrl);
                }
            },
            confirmInput(e) {
                this.$emit('confirm', {
                    type: e.type,
                    detail: {
                        value: this.keyword
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    .search-box{
        background-color: #fff;
        padding: 16rpx 24rpx;
        &__input{
            padding: 8rpx 0;
            background-color: $bg-color;
            border-radius: 32px;
        }
        &__before{
            padding-left: 16rpx;
        }
        &__after{
            padding-left: 24rpx;
            font-size: 28rpx;
            color: #333333;
        }
        &__before--image{
            width: 32rpx;
            height: 32rpx;
            display: block;
        }
    }
    .search-box.flex-ajcenter {
        width: 100%;
    }
</style>
