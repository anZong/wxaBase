// pages/news/news.js
import { B } from '../../base/base.js'
import { wxList } from '../../components/wxList/wxList'
Page({
    data: {},
    onLoad() {
        var that = this
        this._list = new wxList()
        this._list.initList({
            bindName:'_listData',
            apiname:'/api/getNewsList',
            param:{id:99}
        })
    },
    onReachBottom(){
        this._list.loadMore()
    },
    onPullDownRefresh(){
        this._list.refresh()
    }
})