//index.js
//获取应用实例
import { B } from '../../base/base'
import { LoginPanel } from '../../components/wxLogin/wxLogin'
var WxParse = require('../../lib/wxParse/wxParse')
var app = getApp()
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        __login__:{
            phone: '182****7535',
            password: 123456,
            isHide:true
        }
    },
    onLoad: function () {
        this.setData({
            userInfo: app.globalData.userInfo
        })
        app.getUser()
        this.__login__ = new LoginPanel();
    },
    show:function(){
        this.__login__.show()
    },
    hide:function(){
        this.__login__.hide()
    },
    ok:function(){
        this.__login__.ok()
    },
    cancel:function(){
        this.__login__.cancel()
    }
})
