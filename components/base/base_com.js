class BasePanel {
    constructor() {
        let pages = getCurrentPages()
        let curPage = pages[pages.length - 1]
        //组件中调用页面
        this.curPage = curPage
    }
    setData(data) {
        this.curPage.setData(data)
    }
}

export { BasePanel }