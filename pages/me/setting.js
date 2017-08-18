// pages/me/setting.js
import { B } from '../../base/base.js'
var app = getApp();
Page({
    data: {
        user:null
    },
    onLoad:function(flag){
        var that = this
        app.getUser(function(res){
            that.setData({
                user: res
            })
        },flag)
    },
    popSelect:function(event){
        var that = this
        B.pop(['查看', '修改'],function(res){
            if(res.tapIndex == 1){
                that.changeImage()
            }else if(res.tapIndex == 0){
                B.previewImage(event.currentTarget.dataset.url)
            }
        })
    },
    changeImage:function(){
        var that = this
        var promise =new Promise(function(resolve, reject){
            B.chooseImage(1,function (res) {
                resolve(res.tempFilePaths)
            })
        })
        
        var user = that.data.user
        promise.then(function(paths){
            paths.map(function(item){
                B.upload(item,function(url){
                    user.icon = url;
                    that.setData({
                        user:user
                    })
                })
            })
        })
    },
    submit:function(e){
        var that = this;
        B.callapi('saveUserInfo', e.detail.value, function(res){
            B.toast('保存成功!');
        })
    }
})