// pages/api/api.js
import { B } from '../../base/base.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content: null
    },
    onLoad: function () {
    },
    getLocation: function () {
        var that = this;
        B.getLocation(function (res) {
            that.setData({
                content: JSON.stringify(res)
            })
        })
    }
})