import { BasePanel } from '../base/base_com'
class LoginPanel extends BasePanel{
    ok(){
        console.log('OK')
        this.hide()
    }

    cancel(){
        console.log('Cancel')
        this.hide()
    }

    show(){
        this.setData({ '__login__.isHide': false })
    }

    hide(){
        this.setData({ '__login__.isHide': true })
    }
}

export { LoginPanel }