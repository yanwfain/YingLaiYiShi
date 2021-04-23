//app.js
import WeAppRedux from './redux/index.js';
import createStore from './redux/createStore.js';
import reducer from './store/reducer.js';

import ENVIRONMENT_CONFIG from './config/envConfig.js'
import PAGE_CONFIG from './config/pageConfig.js'

const {Provider} = WeAppRedux;
const store = createStore(reducer) // redux store
const updateManager = wx.getUpdateManager()

updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  console.log(res.hasUpdate)
})
updateManager.onUpdateReady(function () {
  wx.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success(res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    }
  })
})
updateManager.onUpdateFailed(function () {
  // 新版本下载失败
})
App( Provider(store)({
  
  onLaunch: function () {
  
    // this.ICDeviceManager.setBleStateCallback(function (bleState) {
    //   console.log(bleState)
    //  })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var data = {
          code:res.code
        }
        getApp().globalData.code =res.code
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.loadFontFace({
      family: 'SourceHanSansCN',
      source: 'url("http://47.94.16.158:8001/SourceHanSansCN Medium.ttf")',
      global:true,
      success:function(res){
        console.log(res.status)
      },
      fail: function(res) {
        console.log(res.status)
      },
      complete: function(res) {
        console.log(res.status)
      }
    })
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }
    let systemInfo = wx.getSystemInfoSync()
    this.globalData.videoContainerSize = {
      width: systemInfo.windowWidth,
      height: systemInfo.windowHeight
    }
    this.globalData.isPushBeCallPage = false
  },
  onShow: function(e) {
    if (e.scene == 1007 || e.scene == 1008) {
      try{
        this.globalData.netcall && this.globalData.netcall.destroy()
        this.globalData.nim && this.globalData.nim.destroy({
          done: function () {
          }
        })
      }catch(e) {
      }
    }
  },
  globalData: {
    userInfo: null,
    url:'https://wxapi.dilighthealth.com',
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    openId:'',
    user_id:'',
    weightData:'',
    emitter: null,
    netcallController: null,
    ENVIRONMENT_CONFIG,
    PAGE_CONFIG
  },
  //   * 封装wx.request请求
//  * method： 请求方式
//  * url: 请求地址
//  * data： 要传递的参数
//  * callback： 请求成功回调函数
//  * errFun： 请求失败回调函数
//  ** /
wxRequest(method, url, data, callback, errFun) {
  wx.request({
    url: url,
    method: method,
    data: data,
    header: {
      'content-type': method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    dataType: 'json',
    success: function (res) {
      callback(res.data);
    },
    fail: function (err) {
      errFun(err);
    }
  })
},


}))