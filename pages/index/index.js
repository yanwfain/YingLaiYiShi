// index.js
// 获取应用实例
import IMController from '../../controller/im.js'
import { connect } from '../../redux/index.js'
let app = getApp()
let store = app.store
var httpUtils = require('../../js/httpUtils.js');
let pageConfig = {
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    statusBarHeight:app.globalData.statusBarHeight,
    // account: '355',// 用户输入账号
    // password: '123456'//用户输入密码
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
  
    this.resetStore()
    console.log(app.globalData.ENVIRONMENT_CONFIG.appkey)
    this.setData({
      phone: wx.getStorageSync('inpvale'),
      password: wx.getStorageSync('inpvalePasd'),
    })
    if (wx.getUserProfile) {
      console.log(wx.getUserProfile)
      this.setData({
        canIUseGetUserProfile: true
      })
      console.log(this.data.canIUseGetUserProfile)
    }
    
    
  },
  liaolist:function(e){
    wx.navigateTo({
      url: '../messageList/index',
    })
  },
  userdelitFn:function(e){
    wx.navigateTo({
      url: '../userdelit/index',
    })
  },
  woyuyueFn:function(e){
    wx.navigateTo({
      url: '../woyuyueFn/index',
    })
  },
  listuserFn:function(e){
    wx.navigateTo({
      url: '../listuserzi/index',
    })
    // wx.navigateTo({
    //   url: '../listlogo/index',
    // })
  },
  melist:function(e){
    wx.navigateTo({
      url: '/pages/melist/index',
    })
  },
  // getUserProfile(e) {
  //   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  //   wx.getUserProfile({
  //     desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //     success: (res) => {
  //       console.log(res)
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   })
  // },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getUserProfile(e) {

    console.log("ok")
    var that = this;
    wx.getUserProfile({
      desc: '展示用户信息',
      success: function (res) {
        console.log(res)
        app.globalData.userInfo = res.userInfo
        that.setData({
          encryptedData: res.encryptedData,
          iv: res.iv,
          rawData: res.rawData,
          wxuser: res.userInfo,
          signature: res.signature,
          hasUserInfo: true,
          canIUse: true,
          isUser: true,
          isSiuser: false,
          headimg: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
     
        })
        that.getOpenid(that,res.userInfo)
        // getOpenid(that, res.userInfo)
      },
      fail: function (res) {console.log(res) },

    })

  },
  ggopfn: function (e) {
    this.setData({
      hasUserInfo: true
    })
  },
  binyijFn:function(e){
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要休息么',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '加载中',
          })
      
          var url = app.globalData.url + '/api/doctor/updateDoctorStatus';
          var data = {
            userId: app.globalData.user_id,
            online: e.currentTarget.dataset.id,
          }
          app.wxRequest('POST', url, data, (res) => {
            console.log(res)
            wx.hideLoading()
            if (res.success) {
              that.user()
            } else {
              wx.showToast({
                title: res.error_message,
                icon:'none'
              })
            }
          }, (err) => {
            wx.showToast({
              title: '提交失败',
            })
            console.log(err.errMsg)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  binyijFns:function(e){
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定立即上线么',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
      
          var url = app.globalData.url + '/api/doctor/updateDoctorStatus';
          var data = {
            userId: app.globalData.user_id,
            online: e.currentTarget.dataset.id,
          }
          app.wxRequest('POST', url, data, (res) => {
            console.log(res)
            wx.hideLoading()
            if (res.success) {
              that.user()
            } else {
              wx.showToast({
                title: res.error_message,
                icon:'none'
              })
            }
          }, (err) => {
            wx.showToast({
              title: '提交失败',
            })
            console.log(err.errMsg)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  user:function(e){
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var url = app.globalData.url + '/api/doctor/login';
    var params={}
    params.phone = that.data.phone
    params.password = that.data.password
    app.wxRequest('POST', url, params, (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.success) {
        app.globalData.allPatientsNum = res.data.allPatientsNum
        that.setData({
          userlist:res.data
        })
      } else {
        wx.showToast({
          title: res.error_message,
          icon:'none'
        })
      }
    }, (err) => {
      wx.showToast({
        title: '提交失败',
      })
      console.log(err.errMsg)
  })
  },
  onShow:function(){

    var that = this
    this.resetStore()

    that.getOpenid(that)
  },
  getOpenid:function (that, userdelit) {
    if(app.globalData.openId){
      console.log('1')
      that.setData({
        hasUserInfo: true,
      })
      wx.showLoading({
        title: '加载中',
      })
      var url = app.globalData.url + '/api/doctor/login';
      var params={}
      params.phone = that.data.phone
      params.password = that.data.password
      app.wxRequest('POST', url, params, (res) => {
        console.log(res)
        wx.hideLoading()
        if (res.success) {
          app.globalData.allPatientsNum = res.data.allPatientsNum
          that.setData({
            userlist:res.data,
            hasUserInfo: true,
            account:res.data.id,// 用户输入账号
            password: res.data.yxToken//用户输入密码
          })
          that.doLogin()
          that.resetStore()
        } else {
          wx.showToast({
            title: res.error_message,
            icon:'none'
          })
        }
      }, (err) => {
        wx.showToast({
          title: '提交失败',
        })
        console.log(err.errMsg)
    })
    }
 else{
    that.setData({
      hasUserInfo: false,
    })
    wx.showLoading({
      title: '加载中',
    })
    var url = app.globalData.url + '/api/doctor/getOpenid';
    var url1 = app.globalData.url + '/api/doctor/updateDoctorUserInfo';
    var url2 = app.globalData.url + '/api/doctor/login';
    var params = {};
    var wxlogin = httpUtils.httpPromise(wx.login);
    wxlogin().then(function (res) {
      params.code = res.code;
      app.wxRequest('POST', url, params, (res) => {
        console.log(res)
        wx.hideLoading()
        if (res.success) {
          params.openid = res.data.openid;
          params.phone = that.data.phone;
          params.headUrl = that.data.headimg? that.data.headimg:'';
          params.userName = that.data.nickName? that.data.nickName:'';
          app.wxRequest('POST', url1, params, (res) => {
            console.log(res)
            wx.hideLoading()
            if (res.success) {
            params.password = that.data.password;

              app.wxRequest('POST', url2, params, (res) => {
                console.log(res)
                wx.hideLoading()
                if (res.success) {
                  if(res.data.openid&&res.data.headimg){
                    that.setData({
                      hasUserInfo: true,
                    })
                  }
                  app.globalData.allPatientsNum = res.data.allPatientsNum
                  that.setData({
                    userlist:res.data,
                    account:res.data.id,// 用户输入账号
                    password: res.data.yxToken//用户输入密码
                  })
                  that.doLogin()
          
                  that.resetStore()

                } else {
                  wx.showToast({
                    title: res.error_message,
                    icon:'none'
                  })
                }
              }, (err) => {
                wx.showToast({
                  title: '提交失败',
                })
                console.log(err.errMsg)
            })
            } else {
              wx.showToast({
                title: res.error_message,
                icon:'none'
              })
            }
          }, (err) => {
            wx.showToast({
              title: '提交失败',
            })
            console.log(err.errMsg)
        })
        } else {
          wx.showToast({
            title: res.error_message,
            icon:'none'
          })
        }
      }, (err) => {
        wx.showToast({
          title: '提交失败',
        })
        console.log(err.errMsg)
      })
    })
  }
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
      token: app.globalData.token ,
      account: app.globalData.account 
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
console.log(mapDispatchToPage)
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)

Page(connectedPageConfig)

