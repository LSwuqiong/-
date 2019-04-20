var content = document.getElementsByClassName('content')[0];
var timer = null;
var moveWidth = content.children[0].offsetWidth;
var num = content.children.length - 1;
var leftBtn = document.getElementsByClassName('btn-left')[0];
var rightBtn = document.getElementsByClassName('btn-right')[0];
var span = document.getElementsByClassName('AN')[0].getElementsByTagName('span');
var lock = true;
var index = 0;

leftBtn.onclick = function() {
    autoMove('right->left');

}
rightBtn.onclick = function() {
        autoMove('left->right');
    }
    //点击小圆按钮对应到相应的图片上
for (var i = 0; i < span.length; i++) {
    (function(mypram) {
        span[i].onclick = function() {
            lock = false;
            clearTimeout(timer);
            index = mypram;
            startMove(content, { left: -index * moveWidth }, function() {
                lock = true;
                changeIndex(index);
                timer = setTimeout(autoMove, 1000);

            })
        }
    })(i)
}

//获取传入元素的样式
function getStyle(ele, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(ele, null)[prop];
    } else {
        return ele.currentStyle[prop];
    }
}
//多物体运动的方法
function startMove(ele, propObj, callback) {
    clearInterval(ele.timer) //首先清除每个元素的timer
    var icur = null, //当前样式的值
        ispeed = null;
    ele.timer = setInterval(function() {
        var key = true;
        for (var prop in propObj) {
            if (prop == "opacity") {
                icur = parseFloat(getStyle(ele, prop)) * 100;
            } //获取运动对象属性为透明属性的样式并且扩大100倍
            else {
                icur = parseInt(getStyle(ele, prop))
            }
            ispeed = (propObj[prop] - icur) / 7; //设置一个速度
            ispeed = ispeed > 0 ? Math.ceil(ispeed) : Math.floor(ispeed); //判断速度正负
            if (prop == "opacity") {
                ele.style.opacity = (icur + ispeed) / 100;
            } else {
                ele.style[prop] = icur + ispeed + 'px';
            } //获得运动的距离或者透明度的值
        }
        if (icur !== propObj[prop]) {
            key = false;
        } //判断运动距离或者透明度的值不等于传入对象相应属性的值就停止
        if (key) {
            clearInterval(ele.timer);
            typeof callback == 'function' && callback(); //传入一个回调函数
        }
    }, 30)
}


//默认轮播的方向 从右向左 因此定义参数direction left->right;
//点击方向 right->left
function autoMove(direction) {
    if (lock) {
        lock = false;
        clearTimeout(timer)
        if (!direction || direction == 'left->right') {
            index++;
            startMove(content, { left: content.offsetLeft - moveWidth }, function() {
                    if (content.offsetLeft == -num * moveWidth) {
                        index = 0;
                        content.style.left = "0px";
                    }
                    timer = setTimeout(autoMove, 1500);
                    lock = true;
                    changeIndex(index);
                }) //从左向右运动，lock是为了防止快速压按钮的时候产生图片填充不完全的情况，因此需要每一次轮播时，让上一次图片加载完之后在轮播下一站图片；

        } else if (!direction || direction == 'right->left') {
            if (content.offsetLeft == 0) {
                content.style.left = -num * moveWidth + 'px';
                index = num;
            }
            index--;
            startMove(content, { left: content.offsetLeft + moveWidth }, function() {
                timer = setTimeout(autoMove, 1500)
                lock = true;
                changeIndex(index);
            })
        }

    }
}
//改变小圆点的索引
function changeIndex(pram) {
    for (var i = 0; i < span.length; i++) {
        span[i].className = "";
    }
    span[pram].className = "active";


}
timer = setTimeout(autoMove, 1500);