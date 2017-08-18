// pages/me/me.js
import { B } from '../../base/base.js'
var app = getApp()
Page({
    data: {
        user:null
    },
    onLoad:function(){
        var that = this;
        app.getUser(function(res){
            that.setData({
                user:res
            })
        })
    },
    setUserInfo:function(){
        B.navTo('/pages/me/setting')
    },
    previewImage:function(event){
        B.previewImage(event.currentTarget.dataset.url)
    }
})