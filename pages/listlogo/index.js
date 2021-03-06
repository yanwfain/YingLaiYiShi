import IMController from '../../controller/im.js'
import { connect } from '../../redux/index.js'
let app = getApp()
let store = app.store
let pageConfig = {
  data: {
    // account: 'duoka2021',// 用户输入账号
    // password: '123456'//用户输入密码
    // account: '355',// 用户输入账号
    // password: 'c1e5040333054a630d0c76ec4038da16',//用户输入密码
    account: '2',// 用户输入账号
    password: '123456'//用户输入密码
  },
  // 测试使用
  onLoad() {
    this.resetStore()
    this.doLogin()
    console.log( this.doLogin())
  },
  onShow() {
    this.resetStore()

  },
  onUnload: function () {
  
  },
  onShareAppMessage() {
    // return {
    //   title: '网易云信DEMO',
    //   path: '/pages/login/login'
    // }
  },
  /**
   * 重置store数据
   */
  resetStore: function () {
    store.dispatch({
      type: 'Reset_All_State'
    })
  },
  /**
   * 用户输入事件：dataset区分输入框类别
   */
  inputHandler: function (e) {
    let temp = {}
    temp[e.currentTarget.dataset.type] = e.detail.value
    this.setData(temp)
  },
  /**
   * 单击注册:跳转注册页
   */
  registerTap: function () {
    wx.navigateTo({
      url: '../register/register',
    })
  },
  /**
   * 执行登录逻辑
   */
  doLogin: function () {
    new IMController({
      token: this.data.password,
      account: this.data.account
    })
  }
}
let mapStateToData = (state) => {
  return {
    isLogin: state.isLogin || store.getState().isLogin
  }
}
const mapDispatchToPage = (dispatch) => ({
  loginClick: function() {
    this.doLogin()
    return
  }
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)

Page(connectedPageConfig)
