// pages/logo/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tishow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if( wx.getStorageSync('inpvale')){
      this.setData({
        inpvale:wx.getStorageSync('inpvale'),
        inpvalePasd:wx.getStorageSync('inpvalePasd'),
      })
    }

  },
  logoFn:function(e){
    if(!this.data.inpvale){
      wx.showToast({
        title: '请输入手机号或用户名',
        icon:'none'
      })
      return
    }
    if(!this.data.inpvalePasd){
      wx.showToast({
        title: '请输入密码',
        icon:'none'
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var url = app.globalData.url + '/api/doctor/login';
    var data = {
      phone:this.data.inpvale,
      password:this.data.inpvalePasd,
    }
    app.wxRequest('POST', url, data, (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.success) {
        wx.setStorageSync('inpvale',that.data.inpvale)
        wx.setStorageSync('inpvalePasd',that.data.inpvalePasd)

        app.globalData.openId = res.data.openid
        app.globalData.user_id = res.data.id
        app.globalData.headimg = res.data.headimg
        app.globalData.phone = that.data.inpvale
        app.globalData.password = that.data.inpvalePasd
        app.globalData.token = res.data.yxToken
        app.globalData.account = res.data.id
        // token: this.data.password,
        // account: this.data.account
        wx.reLaunch({
          url: '../index/index',
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
  clickFn:function(e){
    this.setData({
      tishow:this.data.tishow?false:true
    })
  },
  inpvale:function(e){
    this.setData({
      inpvale:e.detail.value
    })
  },
  inpvalePasd:function(e){
    this.setData({
      inpvalePasd:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})