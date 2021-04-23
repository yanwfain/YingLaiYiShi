// pages/userdelit/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:app.globalData.statusBarHeight,
    region:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.user()
  },
  backlisfn:function(e){
    this.setData({
      xuiishiw:true
    })
  }, 
  backlisfns:function(e){
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    var url = app.globalData.url + '/api/doctor/updateDoctorContact';
    var data={
      userId:app.globalData.user_id,
      contactPhone:this.data.userlist.contactPhone,
      city:this.data.userlist.city,
      address:this.data.userlist.address,
    }
    data.phone =  app.globalData.phone
    data.password =  app.globalData.password 
    app.wxRequest('POST', url, data, (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.success) {
        that.setData({
        
          xuiishiw:false
        })
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
   
  },
  contactPhone:function(e){
    this.setData({
      'userlist.contactPhone':e.detail.value
    })
  },
  address:function(e){
    this.setData({
      'userlist.address':e.detail.value
    })
  },
  user:function(e){
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    var url = app.globalData.url + '/api/doctor/login';
    var data={}
    data.phone =  app.globalData.phone
    data.password =  app.globalData.password 
    app.wxRequest('POST', url, data, (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.success) {
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
  deleFns:function(e){
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要退出登录么',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '加载中',
          })
          wx.reLaunch({
            url: '/pages/logo/index',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  
  },
  notiro: function (e) {
    wx.navigateBack({
      delta: 1,//返回的页面数，如果 delta 大于现有页面数，则返回到首页。
      success: function () { }
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      'userlist.city': e.detail.value[0] + '/' + e.detail.value[1]  +'/'+ e.detail.value[2] 
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
    app.globalData.nim.destroy({
      done: function () {
        console.log('destroy nim done !!!')
        // wx.clearStorage()
        wx.hideLoading()
        // wx.reLaunch({
        //   url: '../login/login',
        // })
      }
    })
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