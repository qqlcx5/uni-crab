import _app from './app.js'
import QRCodeAlg from './QRCodeAlg.js'
import { base64ToPath } from './image-tools.js'
const ShreUserPosterBackgroundKey = 'ShrePosterBackground_' // 背景图片缓存名称前缀
const idKey = 'QSSHAREPOSTER_IDKEY' // drawArray自动生成的idkey

var nbgScale = 1
// export default
function getSharePoster(obj) {
    return new Promise(async (resolve, reject) => {
        try {
            _app.abort = false
            const result1 = await returnPromise(obj)
            resolve(result1)
        } catch (e) {
            // TODO handle the exception
            try {
                if (obj.bgScale) {
                    obj.bgScale = Number(obj.bgScale) - 0.1
                } else {
                    nbgScale = nbgScale - 0.1
                }
                console.log('------------清除缓存后, 开始第二次尝试------------')
                const result2 = await returnPromise(obj)
                resolve(result2)
            } catch (e) {
                // TODO handle the exception
                reject(e)
            }
        }
    })
}

function returnPromise(obj) {
    const {
        type,
        formData,
        background,
        posterCanvasId,
        backgroundImage,
        reserve,
        setCanvasWH,
        setCanvasToTempFilePath,
        setDraw,
        _this,
        delayTimeScale,
        drawDelayTime,
        loadingText = '正在绘制海报',
        drawBefore
    } = obj
    let { textArray, drawArray, qrCodeArray, imagesArray, bgScale, Context } = obj
    return new Promise(async (rs, rj) => {
        try {
            loadingText ? _app.showLoading(loadingText, true) : ''
            if (!Context) {
                _app.log('没有画布对象,创建画布对象')
                Context = uni.createCanvasContext(posterCanvasId, _this || null)
            }
            let bgObj
            if (background && background.width && background.height) {
                bgObj = background
            } else {
                bgObj = await getShreUserPosterBackground({
                    backgroundImage,
                    type,
                    formData
                })
            }
            bgScale = bgScale || nbgScale
            bgObj.width = bgObj.width * bgScale
            bgObj.height = bgObj.height * bgScale

            _app.log('获取背景图信息对象成功:' + JSON.stringify(bgObj))
            const params = {
                bgObj,
                type,
                bgScale,
                getBgObj: function () {
                    return params.bgObj
                },
                setBgObj: function (newBgObj) {
                    const n = { ...params.bgObj, ...newBgObj }
                    params.bgObj = n
                    bgObj = n
                }
            }
            if (imagesArray) {
                if (typeof imagesArray === 'function') {
                    imagesArray = imagesArray(params)
                }
                // _app.showLoading('正在生成需绘制图片的临时路径');
                _app.log('准备设置图片')
                imagesArray = await setImage(imagesArray)
                _app.hideLoading()
            }
            if (textArray) {
                if (typeof textArray === 'function') {
                    textArray = textArray(params)
                }
                textArray = setText(Context, textArray)
            }
            if (qrCodeArray) {
                if (typeof qrCodeArray === 'function') {
                    qrCodeArray = qrCodeArray(params)
                }
                // _app.showLoading('正在生成需绘制图片的临时路径');
                for (let i = 0; i < qrCodeArray.length; i++) {
                    _app.log(i)
                    if (qrCodeArray[i].image) {
                        qrCodeArray[i].image = await _app.downloadFile_PromiseFc(qrCodeArray[i].image)
                    }
                }
                _app.hideLoading()
            }
            if (drawArray) {
                if (typeof drawArray === 'function') {
                    drawArray = drawArray(params)
                }
                if (_app.isPromise(drawArray)) {
                    drawArray = await drawArray
                }

                if (_app.isArray(drawArray) && drawArray.length > 0) {
                    let hasAllInfoCallback = false
                    for (let i = 0; i < drawArray.length; i++) {
                        const drawArrayItem = drawArray[i]
                        if (_app.isFn(drawArrayItem.allInfoCallback) && !hasAllInfoCallback) hasAllInfoCallback = true
                        drawArrayItem[idKey] = i
                        let newData
                        switch (drawArrayItem.type) {
                            case 'image':
                                newData = await setImage(drawArrayItem)
                                break
                            case 'text':
                                newData = setText(Context, drawArrayItem)
                                break
                            case 'qrcode':
                                if (drawArrayItem.image) {
                                    newData = {
                                        image: await _app.downloadFile_PromiseFc(drawArrayItem.image)
                                    }
                                }
                                break
                            case 'custom':
                                break
                            case 'fillrect':
                                break
                            case 'strokeRect':
                                break
                            case 'roundStrokeRect':
                                break
                            case 'roundFillRect':
                                break
                            default:
                                _app.log('未识别的类型')
                                break
                        }
                        if (newData && _app.isObject(newData)) {
                            drawArray[i] = {
                                ...drawArrayItem,
                                ...newData
                            }
                        }
                    }

                    if (hasAllInfoCallback) {
                        _app.log('----------------hasAllInfoCallback----------------')
                        const drawArray_copy = [...drawArray]
                        drawArray_copy.sort((a, b) => {
                            const a_serialNum = !_app.isUndef(a.serialNum) && !_app.isNull(a.serialNum) ? Number(a.serialNum) : Number.NEGATIVE_INFINITY
                            const b_serialNum = !_app.isUndef(b.serialNum) && !_app.isNull(b.serialNum) ? Number(b.serialNum) : Number.NEGATIVE_INFINITY
                            return a_serialNum - b_serialNum
                        })
                        _app.log('开始for循环')

                        for (let i = 0; i < drawArray_copy.length; i++) {
                            const item = {
                                ...drawArray_copy[i]
                            }
                            if (_app.isFn(item.allInfoCallback)) {
                                let newData = item.allInfoCallback({
                                    drawArray
                                })
                                if (_app.isPromise(newData)) newData = await newData
                                const item_idKey = item[idKey]
                                if (!_app.isUndef(item_idKey)) {
                                    drawArray[item[idKey]] = {
                                        ...item,
                                        ...newData
                                    }
                                } else {
                                    console.log('程序错误 找不到idKey!!!	...这不应该啊')
                                }
                            }
                        }
                        _app.log('for循环结束')
                    }
                }
            }
            drawArray.sort((a, b) => {
                const a_zIndex = !_app.isUndef(a.zIndex) && !_app.isNull(a.zIndex) ? Number(a.zIndex) : Number.NEGATIVE_INFINITY
                const b_zIndex = !_app.isUndef(b.zIndex) && !_app.isNull(b.zIndex) ? Number(b.zIndex) : Number.NEGATIVE_INFINITY
                return a_zIndex - b_zIndex
            })

            if (drawBefore) {
                const newBgObj = await drawBefore({ drawArray })
                const n = { ...params.bgObj, ...newBgObj }
                params.bgObj = n
                bgObj = n
            }

            console.log('params:' + JSON.stringify(params))

            if (setCanvasWH && typeof setCanvasWH === 'function') {
                await new Promise((resolve, reject) => {
                    setCanvasWH(params)
                    setTimeout(() => {
                        resolve()
                    }, 50)
                })
            }
            if (_app.abort) return new Promise(() => { })
            const poster = await drawShareImage({
                Context,
                type,
                posterCanvasId,
                reserve,
                drawArray,
                textArray,
                imagesArray,
                bgObj,
                qrCodeArray,
                setCanvasToTempFilePath,
                setDraw,
                bgScale,
                _this,
                delayTimeScale,
                drawDelayTime,
                loadingText
            })
            _app.hideLoading()
            rs({
                bgObj,
                poster,
                type,
                Context
            })
        } catch (e) {
            // TODO handle the exception
            rj(e)
        }
    })
}

function drawShareImage(obj) {
    // 绘制海报方法
    const { Context, type, posterCanvasId, reserve, bgObj, drawArray, textArray, qrCodeArray, imagesArray, setCanvasToTempFilePath, setDraw, bgScale, _this, loadingText = '正在绘制海报' } = obj
    let { delayTimeScale, drawDelayTime } = obj
    const params = {
        Context,
        bgObj,
        type,
        bgScale
    }
    delayTimeScale = delayTimeScale !== undefined ? delayTimeScale : 15
    drawDelayTime = drawDelayTime !== undefined ? drawDelayTime : 100
    return new Promise((rs, rj) => {
        try {
            loadingText ? _app.showLoading(loadingText) : ''
            _app.log('背景对象:' + JSON.stringify(bgObj))
            if (bgObj && bgObj.path) {
                _app.log('背景有图片路径')
                Context.drawImage(bgObj.path, 0, 0, bgObj.width, bgObj.height)
            } else {
                _app.log('背景没有图片路径')
                if (bgObj.backgroundColor) {
                    _app.log('背景有背景颜色:' + bgObj.backgroundColor)
                    Context.setFillStyle(bgObj.backgroundColor)
                    Context.fillRect(0, 0, bgObj.width, bgObj.height)
                } else {
                    _app.log('背景没有背景颜色')
                }
            }

            // _app.showLoading('绘制图片');
            if (imagesArray && imagesArray.length > 0) {
                drawImage(Context, imagesArray)
            }

            // _app.showLoading('绘制自定义内容');
            if (setDraw && typeof setDraw === 'function') setDraw(params)

            // _app.showLoading('绘制文本');
            if (textArray && textArray.length > 0) {
                drawText(Context, textArray, bgObj)
            }

            // _app.showLoading('绘制二维码');
            if (qrCodeArray && qrCodeArray.length > 0) {
                for (let i = 0; i < qrCodeArray.length; i++) {
                    drawQrCode(Context, qrCodeArray[i])
                }
            }

            // _app.showLoading('绘制可控层级序列');
            if (drawArray && drawArray.length > 0) {
                for (let i = 0; i < drawArray.length; i++) {
                    const drawArrayItem = drawArray[i]
                    _app.log('绘制可控层级序列, drawArrayItem:' + JSON.stringify(drawArrayItem))
                    switch (drawArrayItem.type) {
                        case 'image':
                            _app.log('绘制可控层级序列, 绘制图片')
                            drawImage(Context, drawArrayItem)
                            break
                        case 'text':
                            _app.log('绘制可控层级序列, 绘制文本')
                            drawText(Context, drawArrayItem, bgObj)
                            break
                        case 'qrcode':
                            _app.log('绘制可控层级序列, 绘制二维码')
                            drawQrCode(Context, drawArrayItem)
                            break
                        case 'custom':
                            _app.log('绘制可控层级序列, 绘制自定义内容')
                            if (drawArrayItem.setDraw && typeof drawArrayItem.setDraw === 'function') {
                                drawArrayItem.setDraw(Context)
                            }
                            break
                        case 'fillRect':
                            _app.log('绘制可控层级序列, 绘制填充直角矩形')
                            drawFillRect(Context, drawArrayItem)
                            break
                        case 'strokeRect':
                            _app.log('绘制可控层级序列, 绘制线条直角矩形')
                            drawStrokeRect(Context, drawArrayItem)
                            break
                        case 'roundStrokeRect':
                            _app.log('绘制可控层级序列, 绘制线条圆角矩形')
                            drawRoundStrokeRect(Context, drawArrayItem)
                            break
                        case 'roundFillRect':
                            _app.log('绘制可控层级序列, 绘制填充圆角矩形')
                            drawRoundFillRect(Context, drawArrayItem)
                            break
                        default:
                            _app.log('未识别的类型')
                            break
                    }
                }
            }
            // _app.showLoading('绘制中')
            setTimeout(() => {
                _app.log('准备执行draw方法')
                _app.log('Context:' + Context)
                const fn = function () {
                    // _app.showLoading('正在输出图片');
                    let setObj = setCanvasToTempFilePath || {}
                    if (setObj && typeof setObj === 'function') {
                        setObj = setCanvasToTempFilePath(bgObj, type)
                    }
                    const data = {
                        x: 0,
                        y: 0,
                        width: Number(bgObj.width),
                        height: Number(bgObj.height),
                        destWidth: Number(bgObj.width), // 若H5使用这里请不要乘以二
                        destHeight: Number(bgObj.height), // 若H5使用这里请不要乘以二
                        quality: 0.8,
                        fileType: 'jpg',
                        ...setObj
                    }
                    const canvasToTempFilePathFn = function () {
                        const toTempFilePathObj = {
                            // 输出为图片
                            ...data,
                            canvasId: posterCanvasId,
                            success(res) {
                                uni.hideLoading()
                                rs(res)
                            },
                            fail(err) {
                                uni.hideLoading()
                                rj('输出图片失败:' + JSON.stringify(err))
                            }
                        }
                        uni.canvasToTempFilePath(toTempFilePathObj, _this || null)
                    }
                    let delayTime = 0
                    if (qrCodeArray) {
                        qrCodeArray.forEach(item => {
                            if (item.text) {
                                delayTime += Number(item.text.length)
                            }
                        })
                    }
                    if (imagesArray) {
                        imagesArray.forEach(() => {
                            delayTime += delayTimeScale
                        })
                    }
                    if (textArray) {
                        textArray.forEach(() => {
                            delayTime += delayTimeScale
                        })
                    }
                    if (drawArray) {
                        drawArray.forEach(item => {
                            switch (item.type) {
                                case 'text':
                                    if (item.text) {
                                        delayTime += item.text.length
                                    }
                                    break
                                default:
                                    delayTime += delayTimeScale
                                    break
                            }
                        })
                    }
                    _app.log('延时系数:' + delayTimeScale)
                    _app.log('总计延时:' + delayTime)
                    setTimeout(canvasToTempFilePathFn, delayTime)
                }
                Context.draw(typeof reserve === 'boolean' ? reserve : false, fn)
            }, drawDelayTime)
        } catch (e) {
            // TODO handle the exception
            uni.hideLoading()
            rj(e)
        }
    })
}

// export
function drawFillRect(Context, drawArrayItem = {}) {
    // 填充矩形
    _app.log('进入绘制填充直角矩形方法, drawArrayItem:' + JSON.stringify(drawArrayItem))
    Context.setFillStyle(drawArrayItem.backgroundColor || 'black')
    Context.setGlobalAlpha(drawArrayItem.alpha || 1)
    Context.fillRect(drawArrayItem.dx || 0, drawArrayItem.dy || 0, drawArrayItem.width || 0, drawArrayItem.height || 0)
    Context.setGlobalAlpha(1)
}

// export
function drawStrokeRect(Context, drawArrayItem = {}) {
    // 线条矩形
    Context.setStrokeStyle(drawArrayItem.color || 'black')
    Context.setLineWidth(drawArrayItem.lineWidth || 1)
    Context.strokeRect(drawArrayItem.dx, drawArrayItem.dy, drawArrayItem.width, drawArrayItem.height)
}

// export
function drawRoundStrokeRect(Context, drawArrayItem = {}) {
    const { dx, dy, width, height, lineWidth, color, boxShadow = false } = drawArrayItem
    let { r } = drawArrayItem
    r = r || width * 0.1

    if (width < 2 * r) {
        r = width / 2
    }
    if (width < 2 * r) {
        r = width / 2
    }
    Context.beginPath()
    Context.moveTo(dx + r, dy)
    Context.arcTo(dx + width, dy, dx + width, dy + height, r)
    Context.arcTo(dx + width, dy + height, dx, dy + height, r)
    Context.arcTo(dx, dy + height, dx, dy, r)
    Context.arcTo(dx, dy, dx + width, dy, r)
    boxShadow && Context.setShadow(boxShadow.x, boxShadow.y, boxShadow.blur, boxShadow.color)
    Context.closePath()
    Context.setLineWidth(lineWidth || 1)
    Context.setStrokeStyle(color || 'black')
    Context.stroke()
}

// export
function drawRoundFillRect(Context, drawArrayItem = {}) {
    let { r } = drawArrayItem
    const { dx, dy, width, height, backgroundColor, linearGradient } = drawArrayItem
    r = r || width * 0.1
    let bg = backgroundColor;
    if (width < 2 * r) {
        r = width / 2
    }
    if (width < 2 * r) {
        r = width / 2
    }
    Context.beginPath()
    Context.moveTo(dx + r, dy)
    Context.arcTo(dx + width, dy, dx + width, dy + height, r)
    Context.arcTo(dx + width, dy + height, dx, dy + height, r)
    Context.arcTo(dx, dy + height, dx, dy, r)
    Context.arcTo(dx, dy, dx + width, dy, r)
    Context.closePath()
    if (linearGradient) {
        bg = Context.createLinearGradient(dx, dx, dx, dy + height)
        bg.addColorStop(0, linearGradient[0])
        bg.addColorStop(1, linearGradient[1])
    }
    Context.setFillStyle(bg)
    Context.fill()
}

// export
function setText(Context, texts) {
    // 设置文本数据
    _app.log('进入设置文字方法, texts:' + JSON.stringify(texts))
    if (texts && _app.isArray(texts)) {
        _app.log('texts是数组')
        if (texts.length > 0) {
            for (let i = 0; i < texts.length; i++) {
                _app.log('字符串信息-初始化之前:' + JSON.stringify(texts[i]))
                texts[i] = setTextFn(Context, texts[i])
            }
        }
    } else {
        _app.log('texts是对象')
        texts = setTextFn(Context, texts)
    }
    _app.log('返回texts:' + JSON.stringify(texts))
    return texts
}

function setTextFn(Context, textItem) {
    _app.log('进入设置文字方法, textItem:' + JSON.stringify(textItem))
    if (_app.isNotNull_string(textItem.text)) {
        textItem.text = String(textItem.text)
        textItem.alpha = textItem.alpha !== undefined ? Number(textItem.alpha) : 1
        textItem.color = textItem.color || 'black'
        textItem.size = textItem.size !== undefined ? Number(textItem.size) : 10
        textItem.textAlign = textItem.textAlign || 'left'
        textItem.textBaseline = textItem.textBaseline || 'middle'
        textItem.dx = Number(textItem.dx) || 0
        textItem.dy = Number(textItem.dy) || 0
        textItem.size = Math.ceil(Number(textItem.size))
        _app.log('字符串信息-初始化默认值后:' + JSON.stringify(textItem))
        const textLength = countTextLength(Context, {
            text: textItem.text,
            size: textItem.size
        })
        _app.log('字符串信息-初始化时的文本长度:' + textLength)
        let infoCallBackObj = {}
        if (textItem.infoCallBack && typeof textItem.infoCallBack === 'function') {
            infoCallBackObj = textItem.infoCallBack(textLength)
        }
        textItem = {
            ...textItem,
            textLength,
            ...infoCallBackObj
        }
        _app.log('字符串信息-infoCallBack后:' + JSON.stringify(textItem))
    }
    return textItem
}

function countTextLength(Context, obj) {
    _app.log('计算文字长度, obj:' + JSON.stringify(obj))
    const { text, size } = obj
    Context.setFontSize(size)
    let textLength
    try {
        textLength = Context.measureText(text) // 官方文档说 App端自定义组件编译模式暂时不可用measureText方法
    } catch (e) {
        // TODO handle the exception
        textLength = {}
    }
    textLength = {}
    _app.log('measureText计算文字长度, textLength:' + JSON.stringify(textLength))
    textLength = textLength && textLength.width ? textLength.width : 0
    if (!textLength) {
        let l = 0
        for (let j = 0; j < text.length; j++) {
            const t = text.substr(j, 1)
            const countL = countStrLength(t)
            _app.log('计算文字宽度系数:' + countL)
            l += countL
        }
        _app.log('文字宽度总系数:' + l)
        textLength = l * size
    }
    return textLength
}

// 计算字符长度系数
function countStrLength(t) {
    let l
    if (/a/.test(t)) {
        l = 0.552734375
    } else if (/b/.test(t)) {
        l = 0.638671875
    } else if (/c/.test(t)) {
        l = 0.50146484375
    } else if (/d/.test(t)) {
        l = 0.6396484375
    } else if (/e/.test(t)) {
        l = 0.5673828125
    } else if (/f/.test(t)) {
        l = 0.3466796875
    } else if (/g/.test(t)) {
        l = 0.6396484375
    } else if (/h/.test(t)) {
        l = 0.61572265625
    } else if (/i/.test(t)) {
        l = 0.26611328125
    } else if (/j/.test(t)) {
        l = 0.26708984375
    } else if (/k/.test(t)) {
        l = 0.54443359375
    } else if (/l/.test(t)) {
        l = 0.26611328125
    } else if (/m/.test(t)) {
        l = 0.93701171875
    } else if (/n/.test(t)) {
        l = 0.6162109375
    } else if (/o/.test(t)) {
        l = 0.6357421875
    } else if (/p/.test(t)) {
        l = 0.638671875
    } else if (/q/.test(t)) {
        l = 0.6396484375
    } else if (/r/.test(t)) {
        l = 0.3818359375
    } else if (/s/.test(t)) {
        l = 0.462890625
    } else if (/t/.test(t)) {
        l = 0.37255859375
    } else if (/u/.test(t)) {
        l = 0.6162109375
    } else if (/v/.test(t)) {
        l = 0.52490234375
    } else if (/w/.test(t)) {
        l = 0.78955078125
    } else if (/x/.test(t)) {
        l = 0.5068359375
    } else if (/y/.test(t)) {
        l = 0.529296875
    } else if (/z/.test(t)) {
        l = 0.49169921875
    } else if (/A/.test(t)) {
        l = 0.70361328125
    } else if (/B/.test(t)) {
        l = 0.62744140625
    } else if (/C/.test(t)) {
        l = 0.6689453125
    } else if (/D/.test(t)) {
        l = 0.76171875
    } else if (/E/.test(t)) {
        l = 0.5498046875
    } else if (/F/.test(t)) {
        l = 0.53125
    } else if (/G/.test(t)) {
        l = 0.74365234375
    } else if (/H/.test(t)) {
        l = 0.7734375
    } else if (/I/.test(t)) {
        l = 0.2939453125
    } else if (/J/.test(t)) {
        l = 0.39599609375
    } else if (/K/.test(t)) {
        l = 0.634765625
    } else if (/L/.test(t)) {
        l = 0.51318359375
    } else if (/M/.test(t)) {
        l = 0.97705078125
    } else if (/N/.test(t)) {
        l = 0.81298828125
    } else if (/O/.test(t)) {
        l = 0.81494140625
    } else if (/P/.test(t)) {
        l = 0.61181640625
    } else if (/Q/.test(t)) {
        l = 0.81494140625
    } else if (/R/.test(t)) {
        l = 0.65283203125
    } else if (/S/.test(t)) {
        l = 0.5771484375
    } else if (/T/.test(t)) {
        l = 0.5732421875
    } else if (/U/.test(t)) {
        l = 0.74658203125
    } else if (/V/.test(t)) {
        l = 0.67626953125
    } else if (/W/.test(t)) {
        l = 1.017578125
    } else if (/X/.test(t)) {
        l = 0.64501953125
    } else if (/Y/.test(t)) {
        l = 0.603515625
    } else if (/Z/.test(t)) {
        l = 0.6201171875
    } else if (/[0-9]/.test(t)) {
        l = 0.58642578125
    } else if (/[\u4e00-\u9fa5]/.test(t)) {
        l = 1
    } else if (/ /.test(t)) {
        l = 0.2958984375
    } else if (/\`/.test(t)) {
        l = 0.294921875
    } else if (/\~/.test(t)) {
        l = 0.74169921875
    } else if (/\!/.test(t)) {
        l = 0.3125
    } else if (/\@/.test(t)) {
        l = 1.03125
    } else if (/\#/.test(t)) {
        l = 0.63818359375
    } else if (/\$/.test(t)) {
        l = 0.58642578125
    } else if (/\%/.test(t)) {
        l = 0.8896484375
    } else if (/\^/.test(t)) {
        l = 0.74169921875
    } else if (/\&/.test(t)) {
        l = 0.8701171875
    } else if (/\*/.test(t)) {
        l = 0.455078125
    } else if (/\(/.test(t)) {
        l = 0.333984375
    } else if (/\)/.test(t)) {
        l = 0.333984375
    } else if (/\_/.test(t)) {
        l = 0.4482421875
    } else if (/\-/.test(t)) {
        l = 0.4326171875
    } else if (/\+/.test(t)) {
        l = 0.74169921875
    } else if (/\=/.test(t)) {
        l = 0.74169921875
    } else if (/\|/.test(t)) {
        l = 0.26904296875
    } else if (/\\/.test(t)) {
        l = 0.416015625
    } else if (/\[/.test(t)) {
        l = 0.333984375
    } else if (/\]/.test(t)) {
        l = 0.333984375
    } else if (/\;/.test(t)) {
        l = 0.24072265625
    } else if (/\'/.test(t)) {
        l = 0.25634765625
    } else if (/\,/.test(t)) {
        l = 0.24072265625
    } else if (/\./.test(t)) {
        l = 0.24072265625
    } else if (/\//.test(t)) {
        l = 0.42724609375
    } else if (/\{/.test(t)) {
        l = 0.333984375
    } else if (/\}/.test(t)) {
        l = 0.333984375
    } else if (/\:/.test(t)) {
        l = 0.24072265625
    } else if (/\"/.test(t)) {
        l = 0.435546875
    } else if (/\</.test(t)) {
        l = 0.74169921875
    } else if (/\>/.test(t)) {
        l = 0.74169921875
    } else if (/\?/.test(t)) {
        l = 0.48291015625
    } else {
        l = 1
    }
    return l
}

// export
function setImage(images) {
    // 设置图片数据
    _app.log('进入设置图片数据方法')
    return new Promise(async (resolve, rejcet) => {
        try {
            if (images && _app.isArray(images)) {
                _app.log('images是一个数组')
                for (let i = 0; i < images.length; i++) {
                    _app.log('设置图片数据循环中:' + i)
                    images[i] = await setImageFn(images[i])
                }
            } else {
                _app.log('images是一个对象')
                images = await setImageFn(images)
            }
            resolve(images)
        } catch (e) {
            // TODO handle the exception
            rejcet(e)
        }
    })
}

function base64ToPathFn(path) {
    var reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i
    if (!reg.test(path)) {
        return Promise.resolve(path)
    }
    return base64ToPath(path)
}

function setImageFn(image) {
    return new Promise(async (resolve, reject) => {
        if (image.url) {
            image.url = await base64ToPathFn(image.url)
            let imgUrl = image.url
            imgUrl = await _app.downloadFile_PromiseFc(imgUrl)
            image.url = imgUrl
            const hasinfoCallBack = image.infoCallBack && typeof image.infoCallBack === 'function'
            let imageInfo = {}
            try {
                imageInfo = await _app.getImageInfo_PromiseFc(imgUrl)
            } catch (e) {
                // TODO handle the exception
                reject('获取图片失败')
                return
            }
            if (hasinfoCallBack) {
                image = {
                    ...image,
                    ...image.infoCallBack(imageInfo)
                }
            }
            image.dx = Number(image.dx) || 0
            image.dy = Number(image.dy) || 0
            image.dWidth = Number(image.dWidth || imageInfo.width)
            image.dHeight = Number(image.dHeight || imageInfo.height)
            image = {
                ...image,
                imageInfo
            }
        }
        resolve(image)
    })
}

// export
function drawText(Context, textArray, bgObj) {
    // 先遍历换行再绘制
    if (!_app.isArray(textArray)) {
        _app.log('遍历文本方法, 不是数组')
        textArray = [textArray]
    } else {
        _app.log('遍历文本方法, 是数组')
    }
    _app.log('遍历文本方法, textArray:' + JSON.stringify(textArray))
    const newArr = []
    if (textArray && textArray.length > 0) {
        for (let j = 0; j < textArray.length; j++) {
            const textItem = textArray[j]
            if (textItem.text && textItem.lineFeed) {
                let lineNum = -1
                let maxWidth = bgObj.width
                let lineHeight = textItem.size
                let dx = textItem.dx
                if (_app.isObject(textItem.lineFeed)) {
                    const lineFeed = textItem.lineFeed
                    lineNum = lineFeed.lineNum !== undefined && typeof lineFeed.lineNum === 'number' && lineFeed.lineNum >= 0 ? lineFeed.lineNum : lineNum
                    maxWidth = lineFeed.maxWidth !== undefined && typeof lineFeed.maxWidth === 'number' ? lineFeed.maxWidth : maxWidth
                    lineHeight = lineFeed.lineHeight !== undefined && typeof lineFeed.lineHeight === 'number' ? lineFeed.lineHeight : lineHeight
                    dx = lineFeed.dx !== undefined && typeof lineFeed.dx === 'number' ? lineFeed.dx : dx
                }
                const splitChars = textItem.text.split('\\n')
                const row = []
                // 循环出几行文字组成数组
                for (let sa = 0, slen = splitChars.length; sa < slen; sa++) {
                    const chr = Array.from(splitChars[sa]).filter(v => v !== '🏽');
                    let temp = ''
                    for (let a = 0, len = chr.length; a < len; a++) {
                        if (
                            countTextLength(Context, {
                                text: temp,
                                size: textItem.size
                            }) <= maxWidth &&
                            countTextLength(Context, {
                                text: temp + chr[a],
                                size: textItem.size
                            }) <= maxWidth
                        ) {
                            temp += chr[a]
                            if (a === chr.length - 1) {
                                row.push(temp)
                            }
                        } else {
                            row.push(temp)
                            temp = chr[a]
                            if (a === len - 1) {
                                row.push(temp)
                            }
                        }
                    }
                }
                // 只显示几行 变量间距lineHeight  变量行数lineNum
                const allNum = lineNum >= 0 && lineNum < row.length ? lineNum : row.length

                //换行回调
                if (textItem.lineFeed.lineFeedback && row.length > 1) {
                    textItem.lineFeed.lineFeedback(textItem, row.length);
                }
                //意外换行
                if (allNum > 1 && (textItem.size * 2 > textItem.height) && textItem.lineFeed.accidentLineFeed) {
                    textItem.lineFeed.accidentLineFeed(textItem, row.length);
                }

                for (let i = 0; i < allNum; i++) {
                    let str = row[i]
                    if (i === allNum - 1 && allNum < row.length) {
                        str = str.substring(0, str.length - 1) + '...'
                    }
                    const obj = {
                        ...textItem,
                        text: str,
                        dx: i === 0 ? textItem.dx : dx >= 0 ? dx : textItem.dx,
                        dy: textItem.dy + i * lineHeight,
                        textLength: countTextLength(Context, {
                            text: str,
                            size: textItem.size
                        })
                    }
                    _app.log('重新组成的文本对象:' + JSON.stringify(obj))
                    newArr.push(obj)
                }
            } else {
                newArr.push(textItem)
            }
        }
    }
    _app.log('绘制文本新数组:' + JSON.stringify(newArr))
    drawTexts(Context, newArr)
}

function setFont(textItem = {}) {
    if (textItem.font && typeof textItem.font === 'string') {
        _app.log(textItem.font)
        return textItem.font
    } else {
        let fontStyle = 'normal'
        let fontVariant = 'normal'
        let fontWeight = 'normal'
        let fontSize = textItem.size || 10
        let fontFamily = 'sans-serif'
        fontSize = Math.ceil(Number(fontSize))
        if (textItem.fontStyle && typeof textItem.fontStyle === 'string') {
            fontStyle = textItem.fontStyle.trim()
        }
        if (textItem.fontVariant && typeof textItem.fontVariant === 'string') {
            fontVariant = textItem.fontVariant.trim()
        }
        if (textItem.fontWeight && (typeof textItem.fontWeight === 'string' || typeof textItem.fontWeight === 'number')) {
            fontWeight = textItem.fontWeight.trim()
        }
        if (textItem.fontFamily && typeof textItem.fontFamily === 'string') {
            fontFamily = textItem.fontFamily.trim()
        }
        return fontStyle + ' ' + fontVariant + ' ' + fontWeight + ' ' + fontSize + 'px' + ' ' + fontFamily
    }
}

function drawTexts(Context, texts) {
    // 绘制文本
    _app.log('准备绘制文本方法, texts:' + JSON.stringify(texts))
    if (texts && _app.isArray(texts)) {
        _app.log('准备绘制文本方法, 是数组')
        if (texts.length > 0) {
            for (let i = 0; i < texts.length; i++) {
                drawTextFn(Context, texts[i])
            }
        }
    } else {
        _app.log('准备绘制文本方法, 不是数组')
        drawTextFn(Context, texts)
    }
}

function drawTextFn(Context, textItem) {
    _app.log('进入绘制文本方法, textItem:' + JSON.stringify(textItem))
    if (textItem && _app.isObject(textItem) && textItem.text) {
        Context.font = setFont(textItem)
        Context.setFillStyle(textItem.color)
        Context.setGlobalAlpha(textItem.alpha)
        Context.setTextAlign(textItem.textAlign)
        Context.setTextBaseline(textItem.textBaseline)
        Context.fillText(textItem.text, textItem.dx, textItem.dy)
        if (textItem.lineThrough && _app.isObject(textItem.lineThrough)) {
            _app.log('有删除线')
            const lineThrough = textItem.lineThrough
            lineThrough.alpha = lineThrough.alpha !== undefined ? lineThrough.alpha : textItem.alpha
            lineThrough.style = lineThrough.style || textItem.color
            lineThrough.width = lineThrough.width !== undefined ? lineThrough.width : textItem.size / 10
            lineThrough.cap = lineThrough.cap !== undefined ? lineThrough.cap : 'butt'
            _app.log('删除线对象:' + JSON.stringify(lineThrough))
            Context.setGlobalAlpha(lineThrough.alpha)
            Context.setStrokeStyle(lineThrough.style)
            Context.setLineWidth(lineThrough.width)
            Context.setLineCap(lineThrough.cap)
            let mx, my
            switch (textItem.textAlign) {
                case 'left':
                    mx = textItem.dx
                    break
                case 'center':
                    mx = textItem.dx - textItem.textLength / 2
                    break
                default:
                    mx = textItem.dx - textItem.textLength
                    break
            }
            switch (textItem.textBaseline) {
                case 'top':
                    my = textItem.dy + textItem.size * 0.5
                    break
                case 'middle':
                    my = textItem.dy
                    break
                default:
                    my = textItem.dy - textItem.size * 0.5
                    break
            }
            Context.beginPath()
            Context.moveTo(mx, my)
            Context.lineTo(mx + textItem.textLength, my)
            Context.stroke()
            Context.closePath()
            _app.log('删除线完毕')
        }
        Context.setGlobalAlpha(1)
        Context.font = '10px sans-serif'
    }
}
// export
function drawImage(Context, images) {
    // 绘制图片
    _app.log('判断图片数据类型:' + JSON.stringify(images))
    if (images && _app.isArray(images)) {
        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                readyDrawImageFn(Context, images[i])
            }
        }
    } else {
        readyDrawImageFn(Context, images)
    }
}

function readyDrawImageFn(Context, img) {
    _app.log('判断绘制图片形状, img:' + JSON.stringify(img))
    if (img.url) {
        if (img.circleSet) {
            drawCircleImage(Context, img)
        } else if (img.roundRectSet) {
            drawRoundRectImage(Context, img)
        } else {
            drawImageFn(Context, img)
        }
    }
}

const drawImageModes = {
    scaleToFill(Context, img) {
        _app.log('准备绘制mode为scaleToFill的图片')
        Context.drawImage(img.url, Number(img.dx || 0), Number(img.dy || 0), Number(img.dWidth) || false, Number(img.dHeight) || false)
        _app.log('mode为scaleToFill的图片绘制完毕')
    },
    aspectFit(Context, img) {
        _app.log('准备绘制mode为aspectFit的图片')
        const { imageInfo, dWidth, dHeight } = img
        const { height, width } = imageInfo
        let drawWidth = dWidth
        let drawHeight = (height / width) * drawWidth
        if (drawHeight < dHeight) {
            const diffHeight = Number(dHeight) - Number(drawHeight)
            img.dy = Number(img.dy) + diffHeight / 2
        } else {
            drawHeight = dHeight
            drawWidth = (width / height) * drawHeight
            const diffWidth = Number(dWidth) - Number(drawWidth)
            img.dx = Number(img.dx) + diffWidth / 2
        }
        Context.drawImage(img.url, 0, 0, width, height, img.dx, img.dy, drawWidth, drawHeight)
        _app.log('mode为aspectFit的图片绘制完毕')
    },
    aspectFill(Context, img) {
        _app.log('准备绘制mode为aspectFill的图片')
        const { imageInfo, dWidth, dHeight } = img
        const { height, width } = imageInfo
        let sx = 0
        let sy = 0
        let sWidth = width
        let sHeight = height
        let drawWidth = dWidth
        let drawHeight = (height / width) * drawWidth
        if (drawHeight < dHeight) {
            _app.log('绘制高度 小于 预定高度')
            drawHeight = dHeight
            drawWidth = (width / height) * drawHeight
            const diffWidth = ((Number(drawWidth) - Number(dWidth)) / Number(drawWidth)) * width
            sx = diffWidth / 2
            sWidth = width - diffWidth
        } else {
            const diffHeight = ((Number(drawHeight) - Number(dHeight)) / Number(drawHeight)) * height
            sy = diffHeight / 2
            sHeight = height - diffHeight
        }
        _app.log(`aspectFill 最终绘制: sx: ${sx}, sy: ${sy}, sWidth: ${sWidth}, sHeight: ${sHeight}, dx: ${img.dx}, dy: ${img.dy}, dWidth: ${dWidth}, dHeight: ${dHeight}`)
        Context.drawImage(img.url, sx, sy, sWidth, sHeight, img.dx, img.dy, dWidth, dHeight)
        _app.log('mode为aspectFill的图片绘制完毕')
    }
}

function drawImageFn(Context, img) {
    _app.log('进入绘制默认图片方法, img:' + JSON.stringify(img))
    if (img.url) {
        const hasAlpha = !_app.isUndef(img.alpha)
        img.alpha = Number(!_app.isUndef(img.alpha) ? img.alpha : 1)
        Context.setGlobalAlpha(img.alpha)
        _app.log('绘制默认图片方法, 有url')
        if (img.dHeight === undefined) img.dHeight = img.imageInfo.height
        if (img.dWidth === undefined) img.dWidth = img.imageInfo.width
        const fn = drawImageModes[img.mode || 'scaleToFill']
        if (fn) {
            fn(Context, img)
        } else {
            if (img.dWidth && img.dHeight && img.sx && img.sy && img.sWidth && img.sHeight) {
                _app.log('绘制默认图片方法, 绘制第一种方案')
                Context.drawImage(
                    img.url,
                    Number(img.sx) || false,
                    Number(img.sy) || false,
                    Number(img.sWidth) || false,
                    Number(img.sHeight) || false,
                    Number(img.dx || 0),
                    Number(img.dy || 0),
                    Number(img.dWidth) || false,
                    Number(img.dHeight) || false
                )
            } else if (img.dWidth && img.dHeight) {
                _app.log('绘制默认图片方法, 绘制第二种方案')
                Context.drawImage(img.url, Number(img.dx || 0), Number(img.dy || 0), Number(img.dWidth) || false, Number(img.dHeight) || false)
            } else {
                _app.log('绘制默认图片方法, 绘制第三种方案')
                Context.drawImage(img.url, Number(img.dx || 0), Number(img.dy || 0))
            }
        }
        if (hasAlpha) {
            Context.setGlobalAlpha(1)
        }
    }
    _app.log('绘制默认图片方法, 绘制完毕')
}

function drawCircleImage(Context, obj) {
    _app.log('进入绘制圆形图片方法, obj:' + JSON.stringify(obj))
    const { dx, dy, dWidth, dHeight, circleSet } = obj
    let x, y, r
    if (typeof circleSet === 'object') {
        x = circleSet.x
        y = circleSet.y
        r = circleSet.r
    }
    if (!r) {
        const d = dWidth > dHeight ? dHeight : dWidth
        r = d / 2
    }

    x = x ? dx + x : (dx || 0) + r
    y = y ? dy + y : (dy || 0) + r
    Context.save()
    Context.beginPath()
    Context.arc(x, y, r, 0, 2 * Math.PI, false)
    Context.closePath()
    Context.setGlobalAlpha(0)
    Context.fillStyle = '#FFFFFF'
    Context.fill()
    Context.setGlobalAlpha(1)
    Context.clip()
    drawImageFn(Context, obj)
    _app.log('默认图片绘制完毕')
    Context.restore()
}

function drawRoundRectImage(Context, obj) {
    // 绘制矩形
    _app.log('进入绘制矩形图片方法, obj:' + JSON.stringify(obj))
    Context.save()
    const { dx, dy, dWidth, dHeight, roundRectSet } = obj
    let r
    if (typeof roundRectSet === 'object') {
        r = roundRectSet.r
    }
    const br = checkRadius(typeof r !== 'number' ? r : new Array(4).fill(r), dWidth, dHeight)
    console.log('呵呵哈哈哈哈哈', br)
    Context.beginPath()
    Context.moveTo(dx + br[1], dy)
    Context.arcTo(dx + dWidth, dy, dx + dWidth, dy + dHeight, br[1])
    Context.arcTo(dx + dWidth, dy + dHeight, dx, dy + dHeight, br[2])
    Context.arcTo(dx, dy + dHeight, dx, dy, br[3])
    Context.arcTo(dx, dy, dx + dWidth, dy, br[0])
    Context.closePath()
    Context.setGlobalAlpha(0)
    Context.fillStyle = '#FFFFFF'
    Context.fill()
    Context.setGlobalAlpha(1)
    Context.clip()
    drawImageFn(Context, obj)
    Context.restore()
    _app.log('进入绘制矩形图片方法, 绘制完毕')
}

// 二开
function checkRadius(radiusArr, dWidth, dHeight) {
    return radiusArr.map(r => {
        r = parseInt(r)
        if (isNaN(r)) {
            r = 0
        }
        if (dWidth < 2 * r) {
            r = dWidth / 2
        }
        if (dHeight < 2 * r) {
            r = dHeight / 2
        }
        return Math.ceil(r <= 1 ? 0.1 : r)
    })
}

// export
function drawQrCode(Context, qrCodeObj) {
    // 生成二维码方法， 参考了 诗小柒 的二维码生成器代码
    _app.log('进入绘制二维码方法')
    // _app.showLoading('正在生成二维码');
    const qrcodeAlgObjCache = []
    const options = {
        text: String(qrCodeObj.text || '') || '', // 生成内容
        size: Number(qrCodeObj.size || 0) || 200, // 二维码大小
        background: String(qrCodeObj.background || '') || '#ffffff', // 背景色
        foreground: String(qrCodeObj.foreground || '') || '#000000', // 前景色
        pdground: String(qrCodeObj.pdground || '') || '#000000', // 定位角点颜色
        correctLevel: Number(qrCodeObj.correctLevel || 0) || 3, // 容错级别
        image: String(qrCodeObj.image || '') || '', // 二维码图标
        imageSize: Number(qrCodeObj.imageSize || 0) || 40, // 二维码图标大小
        dx: Number(qrCodeObj.dx || 0) || 0, // x轴距离
        dy: Number(qrCodeObj.dy || 0) || 0 // y轴距离
    }
    let qrCodeAlg = null
    let d = 0
    for (var i = 0, l = qrcodeAlgObjCache.length; i < l; i++) {
        d = i
        if (qrcodeAlgObjCache[i].text === options.text && qrcodeAlgObjCache[i].text.correctLevel === options.correctLevel) {
            qrCodeAlg = qrcodeAlgObjCache[i].obj
            break
        }
    }
    if (d === l) {
        qrCodeAlg = new QRCodeAlg(options.text, options.correctLevel)
        qrcodeAlgObjCache.push({
            text: options.text,
            correctLevel: options.correctLevel,
            obj: qrCodeAlg
        })
    }
    const getForeGround = function (config) {
        const options = config.options
        if (
            options.pdground &&
            ((config.row > 1 && config.row < 5 && config.col > 1 && config.col < 5) ||
                (config.row > config.count - 6 && config.row < config.count - 2 && config.col > 1 && config.col < 5) ||
                (config.row > 1 && config.row < 5 && config.col > config.count - 6 && config.col < config.count - 2))
        ) {
            return options.pdground
        }
        return options.foreground
    }
    const count = qrCodeAlg.getModuleCount()
    const ratioSize = options.size
    const ratioImgSize = options.imageSize
    // 计算每个点的长宽
    const tileW = (ratioSize / count).toPrecision(4)
    const tileH = (ratioSize / count).toPrecision(4)
    // 绘制
    for (let row = 0; row < count; row++) {
        for (let col = 0; col < count; col++) {
            const w = Math.ceil((col + 1) * tileW) - Math.floor(col * tileW)
            const h = Math.ceil((row + 1) * tileW) - Math.floor(row * tileW)
            const foreground = getForeGround({
                row: row,
                col: col,
                count: count,
                options: options
            })
            Context.setFillStyle(qrCodeAlg.modules[row][col] ? foreground : options.background)
            Context.fillRect(options.dx + Math.round(col * tileW), options.dy + Math.round(row * tileH), w, h)
        }
    }
    if (options.image) {
        const x = options.dx + Number(((ratioSize - ratioImgSize) / 2).toFixed(2))
        const y = options.dy + Number(((ratioSize - ratioImgSize) / 2).toFixed(2))
        drawRoundedRect(options, Context, x, y, ratioImgSize, ratioImgSize, 2, 6, true, true)
        Context.drawImage(options.image, x, y, ratioImgSize, ratioImgSize)
    }
    _app.log('进入绘制二维码方法完毕')
    _app.hideLoading()
}

// 画圆角矩形
function drawRoundedRect(options, ctxi, x, y, width, height, r, lineWidth, fill, stroke) {
    ctxi.setLineWidth(lineWidth)
    ctxi.setFillStyle(options.background)
    ctxi.setStrokeStyle(options.background)
    ctxi.beginPath() // draw top and top right corner
    ctxi.moveTo(x + r, y)
    ctxi.arcTo(x + width, y, x + width, y + r, r) // draw right side and bottom right corner
    ctxi.arcTo(x + width, y + height, x + width - r, y + height, r) // draw bottom and bottom left corner
    ctxi.arcTo(x, y + height, x, y + height - r, r) // draw left and top left corner
    ctxi.arcTo(x, y, x + r, y, r)
    ctxi.closePath()
    if (fill) {
        ctxi.fill()
    }
    if (stroke) {
        ctxi.stroke()
    }
}

function getShreUserPosterBackground(objs) {
    // 检查背景图是否存在于本地， 若存在直接返回， 否则调用getShreUserPosterBackgroundFc方法
    return new Promise(async (resolve, reject) => {
        try {
            _app.log('正在获取海报背景图')
            const savedFilePath = await getShreUserPosterBackgroundFc(objs)
            _app.hideLoading()
            resolve(savedFilePath)
        } catch (e) {
            _app.hideLoading()
            _app.log('获取分享用户背景图失败:' + JSON.stringify(e))
            _app.log(JSON.stringify(e))
            reject(e)
        }
    })
}

function setPosterStorage(type, data) {
    _app.setStorage(getStorageKey(type), data)
}

function getStorageKey(type) {
    return ShreUserPosterBackgroundKey + (type || 'default')
}

function drawAbort(state = true) {
    _app.abort = state
    _app.hideLoading()
    // _app.showLoading = () => {
    //     return
    // }
}

function getShreUserPosterBackgroundFc(objs, upimage) {
    // 下载并保存背景图方法
    const { backgroundImage, type, formData = {} } = objs
    _app.log('获取分享背景图, 尝试清空本地数据')
    return new Promise(async (resolve, reject) => {
        try {
            // _app.showLoading('正在下载海报背景图');
            _app.log('没有从后端获取的背景图片路径, 尝试从后端获取背景图片路径')
            let image = backgroundImage || (await _app.getPosterUrl(objs))
            image = await base64ToPathFn(image)
            _app.log('尝试下载并保存背景图:' + image)
            const savedFilePath = await _app.downLoadAndSaveFile_PromiseFc(image)
            if (savedFilePath) {
                _app.log('下载并保存背景图成功:' + savedFilePath)
                const imageObj = await _app.getImageInfo_PromiseFc(savedFilePath)
                _app.log('获取图片信息成功')
                const returnObj = {
                    path: savedFilePath,
                    width: formData.width || imageObj.width,
                    height: formData.height || imageObj.height,
                    name: _app.fileNameInPath(image)
                }
                _app.log('拼接背景图信息对象成功:' + JSON.stringify(returnObj))

                // #ifndef H5
                setPosterStorage(type, {
                    ...returnObj
                })
                // #endif

                _app.hideLoading()
                _app.log('返回背景图信息对象')
                resolve({
                    ...returnObj
                })
            } else {
                _app.hideLoading()
                reject('not find savedFilePath')
            }
        } catch (e) {
            // TODO handle the exception
            reject(e)
        }
    })
}

module.exports = {
    getSharePoster,
    setText,
    setImage,
    drawText,
    drawImage,
    drawQrCode,
    drawFillRect,
    drawStrokeRect,
    drawRoundStrokeRect,
    drawRoundFillRect,
    drawAbort
}
