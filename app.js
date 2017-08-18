//app.js
import { B } from 'base/base.js'
import { gen_uuid } from 'utils/util'

App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var uuid = wx.getStorageSync('uuid') || null;
        if (!uuid) {
            uuid = gen_uuid()
            wx.setStorageSync('uuid', uuid)
        }
        this.globalData.token = uuid;
    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            B.loading();
            wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                    B.done();
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
        }
    },
    getUser: function (cb, flag) {
        /**
         * flag: true or false
         * true: 强制刷新
         */
        var flag = flag || false;
        var that = this;
        if (this.globalData.user && !flag) {
            typeof cb == "function" && cb(that.globalData.user);
        } else {
            B.loading();
            B.callapi('getUserInfo', {}, function (res) {
                B.done();
                that.globalData.user = res.data
                typeof cb == "function" && cb(that.globalData.user)
            })
        }
    },
    globalData: {
        userInfo: null, //微信用户信息
        user: null,  //平台用户信息
        token:null
    }
})
