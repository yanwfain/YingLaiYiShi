// pages/melist/index.js
const app = getApp()
let store = app.store
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,//获取导航高度

    movieList:[],
    page:1,
    pageSize:15,
    times:false,
    nianl:false,
    orderBy:[],
    campLabels:[],
    txtbiao:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMore()
    this.data.orderBy[0] ='u.camp_time'
    this.data.orderBy[1] ='ca.age desc'
    this.setData({
      orderBy:this.data.orderBy,
      total:app.globalData.allPatientsNum 
    })
    console.log(app.globalData.allPatientsNum )
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
            id:e.currentTarget.dataset.id,
            status:3
          }
          app.wxRequest('POST', url, data, (res) => {
            console.log(res)
            wx.hideLoading()
            if (res.success) {
              var movieList = that.data.movieList
              for(var index in movieList){
                if(e.currentTarget.dataset.id==movieList[index].userId){
                  movieList[index].status = 3
                }
              }
              that.setData({
                movieList:movieList,
              })
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
  biaosub:function(e){
    wx.showLoading({
      title: '加载中',
    })
    var txtbiao = this.data.txtbiao.join(',')
    var that = this
    var url = app.globalData.url + '/api/doctor/updatePatientLabel'; 
    var data = {
      userId:this.data.listid,
      campLabels:this.data.campLabels?this.data.campLabels:''
    }
    app.wxRequest('POST', url, data, (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.success) {
        var movieList = this.data.movieList
        for(var index in movieList){
          if(that.data.listid==movieList[index].userId){
            movieList[index].campLabelsName = txtbiao
          }
        }
        that.setData({
          isbiao:false,
          movieList:movieList,
          txtbiao:[]
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
  guanzbi:function(e){
    this.setData({
      isbiao:false
    })
  },
  clickbiao:function(e){
    this.setData({
      tid:e.currentTarget.dataset.id
    })
    var liaobiao = this.data.liaobiao
    var campLabels = this.data.campLabels
    var txtbiao = this.data.txtbiao
    for(var index in liaobiao){
      if(e.currentTarget.dataset.id==liaobiao[index].id){
        if(!e.currentTarget.dataset.chenk){
          liaobiao[index].chenk = true
          campLabels.push( liaobiao[index].id)
          txtbiao.push(liaobiao[index].name)
        }
        if(e.currentTarget.dataset.chenk){
          liaobiao[index].chenk = false
          for(var ite in campLabels){
            if(e.currentTarget.dataset.id==campLabels[ite]){
              campLabels.splice(ite,1)
              txtbiao.splice(ite,1)

            }
          }
        }
      }
    }
    this.setData({
      liaobiao:liaobiao,
      campLabels:campLabels,
      txtbiao:txtbiao
    })
    console.log(campLabels)
    console.log(liaobiao)
  },
  bindconfirm:function(e){
    var that = this;
    var discountName = e.detail.value['search - input'] ? e.detail.value['search - input'] : e.detail.value
    console.log('内容为', discountName)
    this.setData({
      keyword: discountName,
      movieList:[],
      page:1,
      pageSize:15,
    })
    this.getMore()
  },
  switchToChating(e) {
    let account = e.currentTarget.dataset.userid;
    let session = 'p2p-'+e.currentTarget.dataset.userid
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
  nianl:function(e){
    this.setData({
      nianl:this.data.nianl?false:true,

    })
    if(this.data.nianl){
      this.data.orderBy[1] = 'ca.age asc'
      this.setData({
        orderBy:this.data.orderBy
      })
    }
    if(!this.data.nianl){
      this.data.orderBy[1] = 'ca.age desc'
      this.setData({
        orderBy:this.data.orderBy
      })
    }
    this.setData({
      orderBy:this.data.orderBy,
      movieList:[],
      page:1,
      pageSize:15,
    })
    this.getMore()
  },
  times:function(e){
    this.setData({
      times:this.data.times?false:true
    })
    if(this.data.times){
      this.data.orderBy[0] = 'u.camp_time asc'
      this.setData({
        orderBy:this.data.orderBy
      })
    }
    if(!this.data.times){
      this.data.orderBy[0] = 'u.camp_time desc'
      this.setData({
        orderBy:this.data.orderBy

      })
    }
    this.setData({
      orderBy:this.data.orderBy,
      movieList:[],
      page:1,
      pageSize:15,
    })
   
    this.getMore()
  },

  getMore: function (page) {
		wx.showLoading({
			title: '加载中',
		})
    var that = this;
    var url = app.globalData.url + '/api/doctor/selectPatientByDoctorId';

    var data = {
      doctorId:app.globalData.user_id,
      pageNum:this.data.page,
      pageSize:this.data.pageSize,
      // realName:this.data.keyword?this.data.keyword:'',
    }
    if(this.data.keyword){
      data.realName=this.data.keyword
    }
    if( this.data.orderBy.length>0){
       var arr = this.data.orderBy.join(',')
      console.log(arr)
      data.orderBy=arr
    }
		console.log(page)
		console.log(url)
    app.wxRequest('GET', url, data, (res) => {
			console.log(res)
			wx.hideLoading()
      if (res.success) {
        if (that.data.page > 1) {
          var movieLists = that.data.movieList;
          that.setData({
            movieList: movieLists.concat(res.data.list),
            page: that.data.page + 1,
        
          })
        } else {
          that.setData({
            movieList: res.data.list,
            page:  that.data.page  + 1,
    
          })
        }
      } else {
        wx.showToast({
          title: '没有更多数据了！',
          icon: 'none'
        })
      }
    }, (err) => {
      wx.showToast({
        title: '提交失败',
      })
    })
  },
  notiro: function (e) {
    wx.navigateBack({
      delta: 1,//返回的页面数，如果 delta 大于现有页面数，则返回到首页。
      success: function () { }
    })
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  pickerProChangef1: function (e) {
    this.setData({ countryIndex1: e.detail.value });
    console.log(this.data.countryIndex1)
  },
  clckFn:function(e){
    this.setData({
      campLabels:[]
    })
    var liaobiao = this.data.liaobiao
    for(var index in liaobiao){
      liaobiao[index].chenk = false
    }
    this.setData({
      isbiao:true,
      listid:e.currentTarget.dataset.id,
      liaobiao:liaobiao
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
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var url = app.globalData.url + '/api/doctor/selectLabelList';
    var data = {
      userId:app.globalData.user_id,
    }
    app.wxRequest('get', url, data, (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.success) {
        for(var index in res.data){
          res.data[index].chenk = false
        }
    
        that.setData({
          liaobiao:res.data
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
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
		that.getMore(that.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})