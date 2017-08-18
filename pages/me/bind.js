// pages/me/bind.js
import { B } from '../../base/base.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
    data: {
        phone: null,
        verify: null
    },
    getPhone:function(e){
        this.setData({
            phone:e.detail.value
        })
    },
    getVerify:function(e){
        this.setData({
            verify: e.detail.value
        })
    },
    sendVerify: function(){
        B.callapi('sendVerifyPhone',{'phone':this.data.phone, 'usetype':'bind'},function(res){
            if(res.data)
                B.toast('验证码已发送，请注意查收!')
        })
    },
    formSubmit:function(event){
        var that = this
        var promise = new Promise(function(resolve,reject){
            app.getUserInfo(function (res) {
                if(res){
                    resolve(res)
                }else{
                    B.toast('获取用户信息失败!')
                }
            })
        })
        promise.then(function(userInfo){
            var data = {
                'phone': event.detail.value.phone,
                'phoneverify': event.detail.value.phoneverify,
                'name': userInfo.nickName,
                'icon': userInfo.avatarUrl,
                'gender': userInfo.gender,
                'province': userInfo.province,
                'city': userInfo.city,
                'country': userInfo.country
            }

            B.callapi('bindUser', data, function (res) {
                if (res && res.data) {
                    app.globalData.user = res.data;
                    B.back()
                }else{
                    B.toast(res.msg, 'fail');
                }
            })
        })
    }
})