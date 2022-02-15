<template>
    <view class="sunui-uploader-bd">

        <!--上传模式-->
        <view
            v-if="mode === 'upload'"
            class="sunui-uploader-files"
        >

            <!--先循环视频集-->
            <template v-for="(item, index) in video_list_">
                <view
                    :key="item.src"
                    class="sunui-uploader-file"
                    :class="[item.upload_percent < 100 ? 'sunui-uploader-file-status' : '']"
                    @click="handleMediaClick('video', item, index)"
                >

                    <!--视频加首帧截图-->
                    <c-image
                        class="sunui-uploader-img"
                        radius="8"
                        :size="size"
                        :src="item.src + (item.uploaded ? '?x-oss-process=video/snapshot,t_0,f_jpg': '')"
                        mode="aspectFill"
                    />

                    <!--视频播放按钮-->
                    <c-image
                        v-if="item.upload_percent === 100"
                        class="video-mask"
                        src="goods/comment/comment-video-play.png"
                        size="48"
                    />

                    <!--视频上传进度-->
                    <view
                        v-if="item.upload_percent < 100"
                        class="sunui-loader-filecontent"
                    >{{ item.upload_percent }}%</view>

                    <!--删除按钮-->
                    <view
                        v-show="upMediaMove"
                        class="sunui-img-removeicon right"
                        @click.stop="removeMedia('video', index)"
                    >
                        <c-icons
                            class="sunui-remove-icon"
                            size="34"
                            type="zsuicon-shanchu1"
                        />
                    </view>
                </view>
            </template>

            <!-- 循环图片集 -->
            <template v-for="(item, index) in img_list_">
                <view
                    :key="index"
                    class="sunui-uploader-file"
                    :class="[item.upload_percent < 100 ? 'sunui-uploader-file-status' : '']"
                    @click="handleMediaClick('image', item, index)"
                >

                    <!--图片展示-->
                    <c-image
                        class="sunui-uploader-img"
                        radius="8"
                        :size="size"
                        :src="item.src"
                        mode="aspectFill"
                    />

                    <!--删除按钮-->
                    <view
                        v-show="upMediaMove"
                        class="sunui-img-removeicon right"
                        @click.stop="removeMedia('image', index)"
                    >
                        <c-icons
                            class="sunui-remove-icon"
                            size="34"
                            type="zsuicon-shanchu1"
                        />
                    </view>

                    <!--图片上传进度-->
                    <view
                        v-if="item.upload_percent < 100"
                        class="sunui-loader-filecontent"
                    >{{ item.upload_percent }}%</view>
                </view>
            </template>

            <!--图片上传按钮-->
            <view
                v-if="mediaType_('image')"
                v-show="img_upload_len < imgUploadCount_"
                hover-class="sunui-uploader-hover"
                class="sunui-uploader-inputbox"
                :style="{
                    width: size + 'rpx',
                    height: size + 'rpx',
                    background: bg
                }"
                @click="chooseMedia('image')"
            >
                <slot name="img_btn_slot">
                    <c-icons
                        type="zsuicon-shangchuantupian"
                        color="#999"
                        size="48"
                    ></c-icons>
                    <view class="sunui-uploader-txt">
                        <text>上传凭证</text>
                        <text>(最多{{ imgUploadCount_ }}张)</text>
                    </view>
                </slot>
            </view>

            <!--视频上传按钮-->
            <view
                v-if="mediaType_('video')"
                v-show="video_upload_len < videoUploadCount_"
                hover-class="sunui-uploader-hover"
                class="sunui-uploader-inputbox"
                :style="{
                    width: size + 'rpx',
                    height: size + 'rpx',
                    background: bg
                }"
                @click="chooseMedia('video')"
            >
                <slot name="video_btn_slot">
                    <c-icons
                        type="zsuicon-shangchuantupian"
                        color="#999"
                        size="48"
                    ></c-icons>
                    <view class="sunui-uploader-txt">
                        <text>上传视频</text>
                        <text>(最多{{ videoUploadCount_ }}个)</text>
                    </view>
                </slot>
            </view>
        </view>

        <!--预览模式-->
        <view
            v-else
            class="sunui-uploader-files"
        >
            <!-- 图片预览 -->
            <template v-for="(item, index) in imgPreviewList">
                <view
                    :key="item"
                    class="sunui-uploader-file"
                    @click="previewMedia('image', item, index)"
                >
                    <c-image
                        class="sunui-uploader-img"
                        radius="8"
                        :size="size"
                        :src="item"
                        mode="aspectFill"
                    />
                </view>
            </template>

            <!-- 视频预览 -->
            <template v-for="(item, index) in videoPreviewList">
                <view
                    :key="item"
                    class="sunui-uploader-file"
                    @click="previewMedia('video', item, index)"
                >
                    <c-image
                        class="sunui-uploader-img"
                        radius="8"
                        :size="size"
                        :src="item + '?x-oss-process=video/snapshot,t_0,f_jpg'"
                        mode="aspectFill"
                    />

                    <!--视频播放按钮-->
                    <c-image
                        class="video-mask"
                        src="goods/comment/comment-video-play.png"
                        size="48"
                    />
                </view>
            </template>
        </view>

        <!--视频弹层，用于视频播放-->
        <c-popup-video
            v-model="showVideoPopup"
            popup-mode="right"
            popup-width="750"
            :video-src="videoSrc"
            :video-width="'100%'"
            :video-height="'100vh'"
        ></c-popup-video>
    </view>
</template>

<script>

/* 2021年5月8日15:04:56 todo
    调整c-uploader为媒体类通用组件（拍摄或从手机相册中选择图片或视频）
    增加media_type属性，默认值为['image']
 */

/* 2021年5月27日14:39:20
    再次修改c-uploader为可视频、图片上传集合
    1、media_type属性，默认值为['image']，可选['video'] || ['image', 'video']
    2、上传总数区分图片、视频单独控制
 */

/* 2021年5月29日14:23:05
    1、视频上传增加进度条
    2、增加img-preview-list、video-preview-list用来接收预览模式下得图集、视频集
 */

export default {
    name: 'SunuiUpimg',
    props: {
        // 服务器url
        url: {
            type: String,
            default: 'Tools/upload/shop_uid/1'
        },
        /**
         * 展示模式
         * upload 上传模式
         * preview 查看模式
         * */
        mode: {
            type: String,
            default: 'upload'
        },

        // 允许上传的文件类型
        mediaType: {
            type: Array,
            default: () => ['image'] // 'image', 'video'
        },

        // 上传按钮样式
        bg: {
            type: String,
            default: ''
        },
        // 上传样式宽高
        size: {
            type: String,
            default: '140'
        },
        // 图片上传数量
        imgUploadCount: {
            type: [Number, String],
            default: 15
        },
        // 视频上传数量
        videoUploadCount: {
            type: [Number, String],
            default: 5
        },
        // 是否自动上传? 可以先用变量为false然后再改为true即为手动上传
        uploadAuto: {
            type: Boolean,
            default: true
        },
        // 是否显示删除
        upMediaMove: {
            type: Boolean,
            default: true
        },
        // 服务器预览图片
        imgPreviewList: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 服务器预览视频
        videoPreviewList: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 服务器返回预览(看服务器卡顿情况设定)
        upimgDelaytime: {
            type: [Number, String],
            default: 300
        },
        // 请求头信息
        header: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            img_upload_len: 0,
            img_upload_cache: [],
            img_upload_cache_list: [],
            img_upload_before_list: [],
            video_upload_len: 0,
            video_upload_cache: [], // 用来上传的            
            video_upload_cache_list: [], // 上传完的            
            video_upload_before_list: [], // 上传前的blob本地文件

            showVideoPopup: false,
            videoSrc: '',

            videoIndex: -1
        }
    },
    computed: {
        img_list_() {
            return this.img_upload_before_list
        },
        video_list_() {
            // return this.video_upload_cache_list
            return this.video_upload_before_list
        },
        mediaType_(type) {
            return (type) => {
                return this.mediaType.includes(type)
            }
        },
        imgUploadCount_() {
            return Number(this.imgUploadCount)
        },
        videoUploadCount_() {
            return Number(this.videoUploadCount)
        }
    },
    watch: {
        imgPreviewList: {
            handler(val) {
                // console.log(val)
                if (!this.imgPreviewList.length) return
                if (this.mode === 'preview') {
                    this.img_upload_before_list = this.img_upload_before_list.concat(this.imgPreviewList.map(o => {
                        return {
                            src: o
                        }
                    }))
                    this.img_upload_len = this.img_upload_before_list.length
                    this.imgPreviewList.map(item => {
                        // step2.这里修改服务器返回字段 ！！！
                        this.img_upload_cache_list.push(item)
                    })

                    // this.emit('image')
                } else {
                    // 上传模式且已有数据回显
                    this.img_upload_before_list = this.imgPreviewList.map(o => {
                        return {
                            src: o,
                            upload_percent: 100
                        }
                    })
                    this.img_upload_cache_list = this.imgPreviewList.map(o => {
                        return {
                            src: o
                        }
                    })
                    this.img_upload_len = this.img_upload_before_list.length
                    console.log('this.img_upload_before_list', this.img_upload_before_list)
                    console.log('this.img_upload_cache_list', this.img_upload_cache_list)
                }
            },
            deep: true,
            immediate: true

        },
        videoPreviewList: {
            handler(val) {
                if (!this.videoPreviewList.length) return
                if (this.mode === 'preview') {
                    this.video_upload_before_list = this.video_upload_before_list.concat(this.videoPreviewList.map(o => {
                        return {
                            src: o,
                            upload_percent: 100,
                            uploaded: true
                        }
                    }))
                    this.video_upload_len = this.video_upload_before_list.length
                    this.videoPreviewList.map(item => {
                        // step2.这里修改服务器返回字段 ！！！
                        this.video_upload_cache_list.push(item)
                    })
                } else {
                    this.video_upload_before_list = this.videoPreviewList.map(o => {
                        return {
                            src: o,
                            upload_percent: 100,
                            uploaded: true
                        }
                    })
                    this.video_upload_cache_list = this.videoPreviewList.map(o => {
                        return {
                            src: o,
                            uploaded: true
                        }
                    })
                    this.video_upload_len = this.video_upload_before_list.length
                    console.log('this.video_upload_before_list', this.video_upload_before_list)
                    console.log('this.video_upload_cache_list', this.video_upload_cache_list)
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        upMedia(paths, header, type) {
            console.log('paths', paths)
            const _self = this
            const promises = paths.map(function (path) {
                return promisify(upload)({
                    url: _self.url,
                    path: path,
                    name: 'file',
                    extra: header,
                    _self: _self,
                    type: type
                })
            })

            uni.showLoading({
                title: `正在上传...`
            })

            Promise.all(promises)
                .then(function (data) {
                    console.log('data', data)
                    uni.hideLoading()

                    if (type === 'image') {
                        _self.img_upload_cache_list.push(...data)
                        console.log('img_upload_before_list', _self.img_upload_before_list)
                        console.log('img_upload_cache_list', _self.img_upload_cache_list)
                        _self.emit(type)
                    } else if (type === 'video') {
                        console.log('videoIndex', _self.videoIndex)
                        _self.video_upload_cache_list.push(...data)
                        _self.video_upload_before_list[_self.videoIndex].src = data[0].src
                        _self.video_upload_before_list[_self.videoIndex].uploaded = true
                        console.log('video_upload_before_list', _self.video_upload_before_list)
                        console.log('video_upload_cache_list', _self.video_upload_cache_list)
                        _self.emit(type)
                    }
                })
                .catch(function (res) {
                    uni.hideLoading()
                })
        },

        chooseMedia(type) {
            const _self = this

            // 如果media_type = ['image']
            if (type === 'image') {
                // 图片
                uni.chooseImage({
                    count: _self.imgUploadCount_ - _self.img_upload_before_list.length,
                    sizeType: ['compressed', 'original'],
                    sourceType: ['album', 'camera'],
                    success: function (res) {
                        console.log('chooseImage', res)
                        for (let i = 0, len = res.tempFiles.length; i < len; i++) {
                            res.tempFiles[i]['upload_percent'] = 0
                            _self.img_upload_before_list.push({
                                src: res.tempFiles[i].path
                            })
                        }
                        _self.img_upload_cache = res.tempFilePaths
                        _self.upload(_self.uploadAuto, 'image')
                    },
                    fail: function (err) {
                        console.log(err)
                    }
                })
            } else if (type === 'video') {
                // 视频
                uni.chooseVideo({
                    count: _self.videoUploadCount_ - _self.video_upload_before_list.length,
                    sourceType: ['album', 'camera'],
                    success: function (res) {
                        console.log('video', res)
                        _self.video_upload_before_list.push({
                            // 把blob文件视频文件链接修改为公用的占位图片，上传完再替换掉
                            // src: res.tempFilePath,
                            src: _self.$config.ossImgUrl + 'common/video-uploading-placeholder.png',
                            upload_percent: 0,
                            uploaded: false
                        })

                        // 转为数组
                        _self.video_upload_cache = Array.of(res.tempFilePath)
                        // _self.video_upload_cache = _self.video_upload_before_list
                        _self.upload(true, 'video')
                    },
                    fail: function (err) {
                        console.log(err)
                    }
                })
            }
        },

        async upload(upload_auto, type) {
            const _self = this
            if (upload_auto) {
                if (type === 'image') {
                    await _self.upMedia(_self.img_upload_cache, _self.header, type)
                } else if (type === 'video') {
                    await _self.upMedia(_self.video_upload_cache, _self.header, type)
                }
            } else {
                console.warn(`传输参数:this.$refs.xx.upload(true)才可上传,默认false`)
            }
        },

        // 用于处理上传模式中的预览
        handleMediaClick(type, item, idx) {
            const _self = this
            if (type === 'image') {
                uni.previewImage({
                    current: idx,
                    urls: _self.img_upload_before_list.map(o => o.src)
                })
            } else if (type === 'video') {
                this.showVideoPopup = true
                this.videoSrc = item.src
            }
        },

        // 预览模式下得预览
        previewMedia(type, item, idx) {
            const _self = this
            if (type === 'image') {
                uni.previewImage({
                    current: idx,
                    urls: _self.imgPreviewList
                })
            } else if (type === 'video') {
                this.showVideoPopup = true
                this.videoSrc = item
            }
        },

        removeMedia(type, idx) {
            if (type === 'image') {
                this.img_upload_before_list.splice(idx, 1)
                this.img_upload_cache_list.splice(idx, 1)
                this.img_upload_len = this.img_upload_before_list.length
                this.emit(type)
            } else if (type === 'video') {
                this.video_upload_before_list.splice(idx, 1)
                this.video_upload_cache_list.splice(idx, 1)
                this.video_upload_len = this.video_upload_cache_list.length
                this.emit(type)
            }
        },

        emit(type) {
            const _self = this
            _self.$emit(type + 'Change', {
                type: 'change',
                detail: type === 'image' ? _self.img_upload_cache_list : _self.video_upload_cache_list
            })
        }
    }
}

const promisify = api => {
    return function (options, ...params) {
        return new Promise(function (resolve, reject) {
            api(
                Object.assign({}, options, {
                    success: resolve,
                    fail: reject
                }),
                ...params
            )
        })
    }
}

const upload = async function (options) {
    // const url = options.url
    const _self = options._self
    const path = options.path
    const name = options.name
    // data = options.data,
    // const extra = options.extra
    const success = options.success
    // const progress = options.progress
    const fail = options.fail
    const type = options.type

    try {
        console.log('_self.type', type)
        const { data } = await _self.$http('uploadImg', {
            filePath: path,
            name: name,
            getTask: function (res) {
                if (type === 'image') {
                    const index = _self.img_upload_before_list.findIndex(o => o.src === path)
                    _self.$set(_self.img_upload_before_list[index], 'upload_percent', res.progress)
                    _self.img_upload_len = _self.img_upload_before_list.length
                } else if (type === 'video') {
                    const index = _self.video_upload_before_list.findIndex(o => o.src === _self.$config.ossImgUrl + 'common/video-uploading-placeholder.png')
                    _self.videoIndex = index
                    _self.$set(_self.video_upload_before_list[index], 'upload_percent', res.progress)
                    _self.video_upload_len = _self.video_upload_before_list.length
                    console.log(' _self.video_upload_len', _self.video_upload_len)
                }
            }
        })
        success(data)
    } catch (e) {
        fail(e)
    }
}
</script>

<style lang="scss">
.sunui-uploader-img {
    display: block;
}

.sunui-uploader-input {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}

.sunui-uploader-inputbox {
    position: relative;
    margin: 0 12rpx 24rpx;
    //margin-bottom: 16rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8rpx;
    border: 2rpx dashed #b8b8b8;
    white-space: nowrap;
}

.sunui-img-removeicon {
    position: absolute;
    width: 30upx;
    height: 30upx;
    line-height: 30upx;
    z-index: 2;
    text-align: center;
    //background-color: rgba(102, 102, 102, 1);
    background-color: rgb(255, 255, 255);
    border-radius: 50%;
    color: #000;

    &.right {
        top: -15rpx;
        right: -6px;
    }
    .sunui-remove-icon {
        position: relative;
        top: -2rpx;
        left: -1rpx;
        z-index: 1;
    }
}

.sunui-uploader-file {
    position: relative;
    margin: 0 12rpx 24rpx;
}

.sunui-uploader-file-status:before {
    content: ' ';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.sunui-loader-filecontent {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    z-index: 9;
}

.sunui-uploader-bd {
    padding: 24rpx 0 0rpx;
    margin: 0;
    @include flex(row);
}

.sunui-uploader-txt {
    font-size: 40rpx;
    font-weight: 400;
    color: #999;
    line-height: 44rpx;
    height: 44rpx;
    margin-top: 16rpx;
    transform: scale(0.5);
    transform-origin: 50% -50%;
}

.sunui-uploader-txt text {
    display: block;
}

.sunui-uploader-files {
    display: flex;
    flex-wrap: wrap;
}

.sunui-uploader-inputbox > view {
    text-align: center;
}

.sunui-uploader-file-status:after {
    content: ' ';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.sunui-uploader-hover {
    box-shadow: 0 0 0 #e5e5e5;
    background: #e5e5e5;
}
.video-mask {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}
</style>
