// pages/yuyuedelit/index.js
import { connect } from '../../redux/index.js'
import { showToast, calcTimeHeader, clickLogoJumpToCard } from '../../utils/util.js'
import { iconNoMessage } from '../../utils/imageBase64.js'
let app = getApp()
let store = app.store
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
      day:options.day,
      clock:options.clock
    })
    var that = this
    wx.showLoading({
      title:'加载中'
    })
    var url = app.globalData.url + '/api/getUserInfo';
    var data = {
      userId:options.id
    }
    app.wxRequest('get', url, data, (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.success) {
        that.setData({
          list:res.data.userData,
        })
        
      } else {
        wx.showToast({
          title: res.msg,
        })
      }
    }, (err) => {
      wx.showToast({
        title: '提交失败',
      })
      console.log(err.errMsg)
    })
  },
  users:function(e){
    var that = this
    wx.showLoading({
      title:'加载中'
    })
    var url = app.globalData.url + '/api/getUserInfo';
    var data = {
      userId:this.data.id
    }
    app.wxRequest('get', url, data, (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.success) {
        that.setData({
          list:res.data.userData,
        })
        
      } else {
        wx.showToast({
          title: res.msg,
        })
      }
    }, (err) => {
      wx.showToast({
        title: '提交失败',
      })
      console.log(err.errMsg)
    })
  },
  videoWan:function(e){
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认该患者问诊完成',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          var url = app.globalData.url + '/login/updateUserStatus';
          var data = {
            id:that.data.list.id,
            status:3
          }
          app.wxRequest('POST', url, data, (res) => {
            console.log(res)
            wx.hideLoading()
            if (res.success) {
            that.users()
            } else {
              wx.showToast({
                title: res.error_message,
                icon: 'none'
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
  // imlist:function(e){
  //   wx.navigateTo({
  //     url: '/pages/imuserdelit/index',
  //   })
  // },
  switchToChating(e) {
    let account = this.data.id
    let session = 'p2p-'+this.data.id
    // 更新会话对象
    store.dispatch({
      type: 'CurrentChatTo_Change',
      payload: session
    })
    let typeAndAccount = session.split('-')
    var chatType
    if (typeAndAccount[0] === 'team') {
      let card = this.data.groupList[typeAndAccount[1]] || {}
      chatType = card.type || 'team'
      store.dispatch({
        type: 'Set_Current_Group',
        payload: account
      })
    } else {
      chatType = 'p2p'
    }
    // 告知服务器，标记会话已读
    app.globalData.nim.resetSessionUnread(session)
    // 跳转
    wx.navigateTo({
      url: `../../partials/chating/chating?chatTo=${account}&type=${chatType}`,
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