import { config } from 'config.js'
import { post2get } from '../utils/util.js'
var B = {
    baseURL: config.server,
    AppID: config.AppID,
    AppSecret: config.AppSecret
}
/** 
* 弹出提示框
* (标题, 延迟时间, 成功回调, 失败回调)
* icon:"success" || "loading"
* 默认延时：1500ms
* 默认显示透明蒙层, 防止触摸穿透
*/
B.toast = function (title, toast_type, duration, success, fail) {
    // toast_type: sucess or fail
    let _type = toast_type || 'success';
    let toast = {
        title: title,
        icon: 'success',
        duration: duration || 1500,
        mask: true,
        success: success,
        fail: fail
    }
    if (toast_type == 'fail') {
        toast.image = '/img/fail.png' || '';
    }
    wx.showToast(toast)
}

/**
* 隐藏提示框
*/
B.hideToast = function () {
    wx.hideToast()
}

/**
* 弹出正在加载提示框
*/
B.loading = function (title, success, fail) {
    wx.showLoading({
        title: title || '正在加载...',
        mask: true,
        success: success,
        fail: fail
    })
}

/**
 * 隐藏加载提示框
 */
B.done = function () {
    wx.hideLoading()
}

/**
 * 弹出doing提示框
*/
B.doing = function (title, success, fail) {
    B.loading('正在操作...', success, fail)
    setTimeout(function () {
        B.done();
    }, 1000)
}

/**
 * 弹出确认对话框
 */
B.confirm = function (title, content, success, fail) {
    wx.showModal({
        title: title || '提示',
        content: content || '确定本次操作吗？',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: success,
        fail: fail
    })
}

/**
 * 底部弹出ActionSheet
 */
B.pop = function (list, success) {
    if (!(list instanceof Array)) return;
    wx.showActionSheet({
        itemList: list || [],
        itemColor: '#000000',
        success: success
    })
}

/**
 * 设置导航栏：标题、是否显示加载动画、字体颜色、背景色
 */
B.setNavBar = function (title, loading = false, frontColor, backColor) {
    wx.setNavigationBarTitle(title)
    if (loading) {
        wx.showNavigationBarLoading();
    } else {
        wx.hideNavigationBarLoading();
    }
    if (frontColor) {
        wx.setNavigationBarColor({
            frontColor: frontColor,
        })
    }
    if (backColor) {
        wx.setNavigationBarColor({
            backColor: backColor,
        })
    }
}

/**
 * 返回页面
 * num：返回的页面数，如果大于现有页面栈数量，返回首页
 */
B.back = function (num) {
    wx.navigateBack({
        delta: num || 1
    })
}

/**
 * 跳转到其他页面,当前页面入栈
 */
B.navTo = function (url) {
    if (!url) return;
    wx.navigateTo({
        url: url,
    })
}

/**
 * 跳转到指定页面，关闭当前页面
 */
B.goto = function (url) {
    if (!url) return;
    wx.redirectTo({
        url: url,
    })
}

/**
 * 关闭所有页面，打开到某个页面
 */
B.relaunch = function (url) {
    if (!url) return;
    wx.reLaunch({
        url: url,
    })
}


/**
 * 切换tab
 */
B.switchTab = function (tab) {
    if (!tab) return;
    wx.switchTab({
        url: tab,
    })
}


/**
 * 上传文件
 */
B.upload = function (filepath, success) {
    if (!filepath) {
        B.toast('文件路径不能为空!', '', '/img/fail.png');
        return;
    }
    var promise = new Promise(function (resolve, reject) {
        B.callapi('getUploadToken', {}, function (res) {
            if (res && res.data) {
                resolve(res.data);
            } else {
                B.toast('获取上传令牌失败!', 'fail');
            }
        })
    })
    promise.then(function (data) {
        wx.uploadFile({
            url: data.action,
            filePath: filepath,
            name: 'file',
            formData: { 'token': data.token },
            success: function (res) {
                let url = String(JSON.parse(res.data)[0].url)
                if (!url.startsWith('http://') || !url.startsWith('https://')) {
                    url = B.baseURL + url
                }
                success(url)
            },
            fail: function () {
                B.toast('上传失败!', 'fail')
            }
        })
    })
},

    /**
     * 下载文件
     */
    B.download = function (url, success) {
        B.loading('正在下载...');
        wx.downloadFile({
            url: url,
            success: function (res) {
                B.done();
                if (res) {
                    success(res.tempFilePath)   //返回文件的临时路径，如需持久保存，调用wx.saveFile
                }
            }
        })
    },

    /**
     * 预览图片
     */
    B.previewImage = function (urls) {
        var _urls = []
        if (typeof urls == 'string') {
            _urls = [urls]
        }
        if (urls instanceof Array) {
            _urls = urls
        }
        wx.previewImage({
            urls: _urls,
            fail: function () {
                B.toast('预览图片失败!', 'fail')
            }
        })
    }

/**
 * 上传图片
 * count 最多可以选择的图片个数，默认9
 */
B.chooseImage = function (count, success) {
    wx.chooseImage({
        count: count || 9,
        success: success
    })
}

/**
* 调用API接口
* B.callapi(方法名, 数据, 成功回调函数, 失败回调函数)
*/
B.callapi = function (name, data, success, fail) {
    let url = null
    if(name.includes('/'))
        url = B.baseURL + name
    else
        url = B.baseURL + '/wxa/' + name

    if (!data)
        data = {};

    data['_token'] = getApp().globalData.token;
    data['_platform'] = 'wxa';

    wx.request({
        url: url,
        data: post2get(data),
        header: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        dataType: 'json',
        method: 'POST',
        success: function (res) {
            if (res.data.code == 0)
                success(res.data);
            else if (res.data.code == 2001) {
                //跳转到用户绑定
                B.navTo('/pages/me/bind')
            }else if(fail){
                B.toast('请求失败', 'fail')
            }else{
                B.toast('请求失败','fail')
            }
        },
        fail: function (res) {
            B.done()
            if (fail)
                fail('请求失败');
            else
                B.toast('请求失败','fail');
        }
    });
};


/**
 * 获取当前的地理位置
 * type:默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
 */
B.getLocation = function (type, success) {
    if (typeof type == 'function') {
        success = type
    } else {
        let _type = ['wgs84', 'gcj02'];
        if (!_type.includes(type)) {
            B.toast('类型错误! wgs84 || gcj02', 'fail');
        }
    }
    B.doing()
    wx.getLocation({
        type: type || 'wgs84',
        success: function (res) {
            B.done();
            let position = {};
            position.latitude = res.latitude;
            position.longitude = res.longitude;
            position.speed = res.speed;
            success(position)
        }
    })
}

/**
 * B.getAccessToken
 * 获取access_token
 * @param {String} appid
 * @param {String} appsecret
 * @param {Function} success
 * @return {String} access_token 
 */
B.getAccessToken = function (appid, appsecret, success) {
    wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/token',
        data: {
            grant_type: 'client_credential',
            appid: appid,
            secret: appsecret
        },
        success: function (res) {
            success(res.data.access_token)
        }
    })
}

/**
 * B.getwxaCode
 * 获取小程序码
 * @param {String} access_token
 * @param {String} path 页面路径，可带参数
 * @return {String} image/jpeg 二进制图片
 */
B.getwxaCode = function (access_token, path, success) {
    wx.request({
        url: 'https://api.weixin.qq.com/wxa/getwxacode?access_token=' + this.data.access_token,
        method: 'POST',
        data: {
            path: path
        },
        success: function (res) {
           success(res.data)
        }
    })
}

module.exports = {
    B: B
}

export { B }