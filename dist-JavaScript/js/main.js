
window.onload = function() {
    // *** 定义全局变量 ***
    // 全局需要的元素
    window.workArea = document.querySelector('#workArea');
    window.avatorImg = document.querySelector('#avatorImg');
    window.imageShow = document.querySelector('#imageShow');
    // 鼠标初始位置坐标数值
    window.mouseStartX = 0;
    window.mouseStartY = 0;
    // 图片初始化后的尺寸记录
    window.initLength = {
        width: 0,
        height: 0
    };
    // 图片原始尺寸记录
    window.primitiveLength = {
        width: 0,
        height: 0
    };
    // 图片放大缩小的数值
    window.resizeValue = 0;
    // 图片呈现高度&宽度，需要根据HTML以及CSS部分的overlayInner的高宽度一致
    window.showSide = document.querySelector('#overlayInner').clientWidth;
    // 裁剪的图片类型
    window.croppedImageType = 'image/png';
}

/**
 * 对图片进行裁剪
 */
function crop() {
    if (!avatorImg.src) return;
    let _cropCanvas = document.createElement('canvas');
    let _side = (showSide / avatorImg.offsetWidth) * primitiveLength.width;
    _cropCanvas.width = _side;
    _cropCanvas.height = _side;

    let _sy = (100 - avatorImg.offsetTop) / avatorImg.offsetHeight * primitiveLength.height;
    let _sx = (100 - avatorImg.offsetLeft) / avatorImg.offsetWidth * primitiveLength.width;
    _cropCanvas.getContext('2d').drawImage(avatorImg, _sx, _sy, _side, _side, 0, 0, _side, _side);
    let _lastImageData = _cropCanvas.toDataURL(croppedImageType);

    imageShow.src = _lastImageData;
    imageShow.style.width = showSide + 'px';
    imageShow.style.height = showSide + 'px';
}

/**
 * 图片选择元素的值发生变化后，重置图片裁剪区的样式
 * @param {Object} e input数值变化事件
 */
function ImageInputChanged(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        avatorImg.src = event.target.result;
        avatorImg.style.width = 'auto';
        avatorImg.style.height = 'auto';
        avatorImg.style.top = 'auto';
        avatorImg.style.left = 'auto';
    }

    reader.readAsDataURL(file);
}

/**
 * 图片展示元素数据变动，初始化图片高宽度，位置
 */
function avatorImgChanged() {
    if (avatorImg.offsetWidth >= avatorImg.offsetHeight) {
        avatorImg.style.top = '100px';
        initLength.width = showSide * avatorImg.offsetWidth / avatorImg.offsetHeight
        initLength.height = showSide;
    } else {
        avatorImg.style.left = '100px';
        initLength.height = showSide * avatorImg.offsetWidth / avatorImg.offsetWidth;
        initLength.width = showSide;
    }

    primitiveLength = {
        width: avatorImg.offsetWidth,
        height: avatorImg.offsetHeight
    };
    avatorImg.style.width = primitiveLength.width + 'px';
    avatorImg.style.height = primitiveLength.height + 'px';
}

/**
 * 监测鼠标点击，开始拖拽
 * @param {Object} e 鼠标点击事件
 */
function startDrag(e) {
    e.preventDefault();
    if (avatorImg.src) {
        // 记录鼠标初始位置
        window.mouseStartX = e.clientX;
        window.mouseStartY = e.clientY;
        // 添加鼠标移动以及鼠标点击松开事件监听
        workArea.addEventListener('mousemove', window.dragging, false);
        workArea.addEventListener('mouseup', window.clearDragEvent, false);
    }
}

/**
 * 处理拖拽
 * @param {Object} e 鼠标移动事件
 */
function dragging(e) {
    // *** 图片不存在 ***
    if (!avatorImg.src) return;

    // *** 图片存在 ***
    // X轴
    let _moveX = avatorImg.offsetLeft + e.clientX - mouseStartX;
    if (_moveX >= 100) {
        avatorImg.style.left = '100px';
        mouseStartX = e.clientX;
        return;
    } else if (_moveX <= 400 - avatorImg.offsetWidth) {
        _moveX = 400 - avatorImg.offsetWidth;
    }

    avatorImg.style.left = _moveX + 'px';
    mouseStartX = e.clientX;

    // Y轴
    let _moveY = avatorImg.offsetTop + e.clientY - mouseStartY;
    if (_moveY >= 100) {
        avatorImg.style.top = '100px';
        mouseStartY = e.clientY;
        return;
    } else if (_moveY <= 400 - avatorImg.offsetHeight) {
        _moveY = 400 - avatorImg.offsetHeight;
    }
    avatorImg.style.top = _moveY + 'px';
    mouseStartY = e.clientY;
}

/**
 * 图片放大
 */
function resizeUp() {
    resizeValue += 10;
    resize();
}

/**
 * 图片缩小
 */
function resizeDown() {
    resizeValue -= 10;
    resize();
}

/**
 * 修改图片比例大小
 */
function resize() {
    avatorImg.style.width = (resizeValue + 100) / 100 * initLength.width + 'px';
    avatorImg.style.height = (resizeValue + 100) / 100 * initLength.height + 'px';
}

/**
 * 清除鼠标事件
 */
function clearDragEvent() {
    workArea.removeEventListener('mousemove', window.dragging, false);
    workArea.removeEventListener('mouseup', window.clearDragEvent, false);
}
