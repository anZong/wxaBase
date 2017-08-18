import { B } from '../../base/base'
import { BasePanel } from '../base/base_com'
/**
 * @wxListData:[{img:'',title:'',intro:'',created:{date:''}},{}]
 * @api:return 
 * {
 *  items:{},
 *  total:Number,
 *  curpage:Number,
 *  size:Number
 * }
 */
class wxList extends BasePanel {

    initList({ bindName, data = null, apiname = null, param = null }) {
        /**
         * @param bindName {String} the data key
         * @param data {Object}
         */
        this._param = {
            bindName: bindName,
            data: data,
            apiname: apiname,
            param: param
        }
        var that = this
        if (data) {
            that.loadData(data)
        } else if (apiname) {
            B.doing()
            B.callapi(apiname, param, function (res) {
                if (res && res.data) {
                    B.done()
                    if (that.isRefresh){
                        // 停止刷新
                        that.isRefresh = false
                        wx.stopPullDownRefresh()
                    }

                    that.loadData(res.data.items)
                    that._data = res.data
                    that._data['len'] = res.data.items.length
                }
            })
        }
    }

    loadData(data) {
        let bindData = {}
        bindData[this._param.bindName] = data
        this.setData(bindData)
    }

    refresh() {
        this.isRefresh = true
        this.initList({
            bindName: this._param.bindName,
            data: this._param.data,
            apiname: this._param.apiname,
            param: this._param.param
        })
    }

    loadMore() {
        let len = this._data.len
        let hasMore = true
        let total = this._data.total || 0
        if (len >= total) {
            hasMore = false
        }
        if (hasMore) {
            let [param, that] = [{}, this]
            let curpage = Number.parseInt(that._data.curpage) || 1
            let size = Number.parseInt(that._data.size) || 10
            param.page = curpage + 1
            that._data.curpage = param.page
            param.size = size
            B.callapi(that._param.apiname, param, function (res) {
                if (res && res.data) {
                    B.done();
                    let data = that._data.items.concat(res.data.items)
                    that.loadData(data)
                    that._data.items = data
                    that._data['len'] = data.length
                }
            })
        }
        this.setData({ 'hasMore': hasMore })
    }
}

export { wxList }