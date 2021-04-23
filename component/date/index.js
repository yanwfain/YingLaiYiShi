var util = require('../../utils/util.js');
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    dateList: [],
    hours: [],
    minutes: [],
    date: '',
    hour: {},
    minute: {},
    todayhour: "",
    todayminutes: "",
    showselect: false,
    isdate: true,
    tab_vie:0
  },

  ready: function () {
    let dateList = this.getDates(7);
    const date = new Date()
    const hours = []
    const minutes = ['00', '30']
    var todayMinutes = parseInt(date.getMinutes());
    console.log(todayMinutes)
    var todayhour = (todayMinutes >= 30 ? (date.getHours() + 1) : date.getHours());//当前时
    var todayhour = date.getHours();//当前时
    // var newtodayMinutes = todayMinutes < 30 ? '30' : '00';//当前分
    var newtodayMinutes = todayMinutes;//当前分
    for (let i = 1; i <= 23; i++) {
      hours.push(i)
    }
    this.setData({
      dateList: dateList,
      hours: hours,
      minutes: minutes,
      todayhour: todayhour,
      todayminutes: newtodayMinutes
    })
    wx.showLoading({
      title:'加载中'
    })
    var that = this
    that.setData({
      wuid:''
    })
    var url = app.globalData.url + '/api/doctor/selectReatmentSetByDoctorId';
    var data = {
      doctorId:app.globalData.user_id,
      day:dateList[0].year+'-'+dateList[0].dates,
    }
    app.wxRequest('GET', url, data, (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.success) {
        that.setData({
          listdataTime:res.data.morningList,
          afternoonList:res.data.afternoonList,
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
    var selected = dateList[0].year + "-" + dateList[0].newdates + "\t" + ((todayhour >= 10) ? todayhour : ("0" + todayhour)) + ":" + newtodayMinutes;
    // var myEventDetail = {
    //   selected: selected,
    // }
    // this.triggerEvent('bindSelect', myEventDetail);
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //触发日期选择弹出框
    showDate: function () {
      if (this.data.showselect) {
        var showselect = false
      } else {
        var showselect = true
      }
      this.setData({
        showselect: showselect
      })
    },
    clickFns:function(e){
      var myEventDetail = {
        selected:''
      }
      this.triggerEvent('bindSelect', myEventDetail);
      this.setData({
        date: this.data.dateList[e.currentTarget.dataset.index].dates,
        tab_vie:e.currentTarget.dataset.index,
        timeactive:'',
        hours:'',
        minutes:'',
      })
      var val = this.data.tab_vie
      var dates = this.data.dateList[val]
      console.log(dates.year)
      console.log(dates.newdates)
      wx.showLoading({
        title:'加载中'
      })
      var that = this
      that.setData({
        wuid:''
      })
      var url = app.globalData.url + '/api/doctor/selectReatmentSetByDoctorId';
      var data = {
        doctorId:app.globalData.user_id,
        day:dates.year + '-' + dates.newdates,
      }
      app.wxRequest('GET', url, data, (res) => {
        console.log(res)
        wx.hideLoading()
        if (res.success) {
          that.setData({
            listdataTime:res.data.morningList,
            afternoonList:res.data.afternoonList,
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
    clickTimes:function(e){
      wx.showToast({
        title: '该时间段已被预约',
        icon:'none'
      })
    },
    xiapageFn:function(e){
      this.setData({
        ischeknd:true
      })
      var list = []
      // var listdataTime = this.data.listdataTime
      // var afternoonList = this.data.afternoonList
      // for(var index in listdataTime){
      //   if(listdataTime[index].status==1){
      //     list.push(listdataTime[index].id)
      //   }
      // }
      // for(var index in afternoonList){
      //   if(afternoonList[index].status==1){
      //     list.push(afternoonList[index].id)
      //   }
      // }
      this.setData({
        list:list
      })
      console.log(list)
    },
    baocunsx:function(e){
      this.setData({
        ischeknd:false
      })
    },
    clickcheck:function(e){
      var listdataTime = this.data.listdataTime
      var afternoonList = this.data.afternoonList
      for(var index in listdataTime){
        if(e.currentTarget.dataset.id==listdataTime[index].id){
          listdataTime[index].status = e.currentTarget.dataset.status==1?0:1
        }  
      }
      for(var index in afternoonList){
        if(e.currentTarget.dataset.id==afternoonList[index].id){
          afternoonList[index].status = e.currentTarget.dataset.status==1?0:1
        }  
      }
      this.setData({
        listdataTime:listdataTime,
        afternoonList:afternoonList
      })
     
    },
    bukesubmit:function(e){
     
      var listdataTime = this.data.listdataTime
      var afternoonList = this.data.afternoonList
      var list = this.data.list

      for(var index in listdataTime){
        if(listdataTime[index].status==1){
          list.push(listdataTime[index].id)
        }  
      }
      for(var index in afternoonList){
        if(afternoonList[index].status==1){
          list.push(afternoonList[index].id)
        }  
      }
      var that = this
      var val = this.data.tab_vie
      var dates = this.data.dateList[val]
      wx.showModal({
        title: '提示',
        content: '确定要设为不可预约',
        success (res) {
          if (res.confirm) {
            wx.showLoading({
              title:'加载中'
            })
            var url = app.globalData.url + '/api/doctor/updateReatmentSet';
            var data = {
              doctorId:app.globalData.user_id,
              day:dates.year + '-' + dates.newdates,
              ids:list
            }
            app.wxRequest('POST', url, data, (res) => {
              console.log(res)
              wx.hideLoading()
              if (res.success) {
                that.setData({
                  list:list,
                  ischeknd:false
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
         
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    
      console.log(list)
    },
    clickTimeshui:function(e){
      wx.showToast({
        title: '当前时间为不可预约',
        icon:'none'
      })
    },
    clickTimedelit:function(e){
        if(e.currentTarget.dataset.isment==0){
          wx.showToast({
            title: '当前时间无人预约',
            icon:'none'
          })
          return
        }
        var val = this.data.tab_vie
        var dates = this.data.dateList[val]
        var day = dates.year + '-' + dates.newdates
        wx.navigateTo({
          url: '../yuyuedelit/index?id=' + e.currentTarget.dataset.user + '&day=' + day + '&clock=' + e.currentTarget.dataset.clock,
        })
    },
    clickTime:function(e){
      if(this.data.tab_vie==0){
        this.setData({
          date: this.data.dateList[0].dates,
          tab_vie:0,
          timeactive:'',
          hours:'',
          minutes:'',
        })
      }else{
        if(!this.data.date){
          wx.showToast({
            title: '请先选择日期',
            icon:'none'
          })
          return
      }
      }
    
      console.log(this.data.date)
      this.setData({
        hours:e.currentTarget.dataset.todayhour,
        minutes:e.currentTarget.dataset.todayminutes,
      })
      // console.log(this.data.todayhour)
      // console.log(this.data.todayminutes)
      // console.log(this.data.hours)
      // console.log(this.data.minutes)
      var val = this.data.tab_vie
      var dates = this.data.dateList[val]
      //时间比较
      var selected = dates.year + "-" + dates.newdates + "\t" + ((this.data.hours) < 10 ? ("0" + (this.data.hours)) : (this.data.hours)) + ":" + this.data.minutes//选择时间
      var todate = this.getCurrentMonthFirst() + "\t" + parseInt(this.data.todayhour)  + ":" + parseInt(this.data.todayminutes) ;
      // console.log(selected)
      // console.log(todate)
      this.setData({
        isdate: util.compareDate(selected, todate)
      })
      console.log(this.data.timeactive)
      if(!this.data.isdate){
        wx.showToast({
          title: '不能小于当前时间',
          icon:"none"
        })
        return
      }
      this.setData({
        timeactive:e.currentTarget.dataset.index,
      })
      var myEventDetail = {
        selected: dates.year+"-"+this.data.date+' '+this.data.hours+':'+this.data.minutes
      }
      this.triggerEvent('bindSelect', myEventDetail);
      // console.log(this.data.isdate)
      // console.log(this.data.timeactive)
      // console.log(this.data.todayhour)
      // console.log(this.data.todayminutes)
    },
    //选择值
    bindChange: function (e) {
      const val = e.detail.value;
      console.log(this.data.dateList)
      this.setData({
        date: this.data.dateList[val[0]],
        hour: this.data.hours[val[1]],
        minute: this.data.minutes[val[2]]
      })
      var dates = this.data.dateList[val[0]]
      //时间比较
      var selected = dates.year + "-" + dates.newdates + "\t" + ((this.data.hours[val[1]]) < 10 ? ("0" + (this.data.hours[val[1]])) : (this.data.hours[val[1]])) + ":" + this.data.minutes[val[2]]//选择时间
      var todate = this.getCurrentMonthFirst() + "\t" + this.data.todayhour + ":" + this.data.todayminutes;
      this.setData({
        isdate: util.compareDate(selected, todate)
      })
      var myEventDetail = {
        selected: this.data.dateList[val[0]]
      }
      this.triggerEvent('bindSelect', myEventDetail);
    },

    /**
     * 获取d当前时间多少天后的日期和对应星期
     * //todate默认参数是当前日期，可以传入对应时间
     */
    getDates: function (days, todate = this.getCurrentMonthFirst()) {
      var dateArry = [];
      for (var i = 0; i < days; i++) {
        var dateObj = util.dateLater(todate, i);
        dateArry.push(dateObj)
      }
      return dateArry;
    },

    //获取当前时间
    getCurrentMonthFirst: function () {
      var date = new Date();
      var todate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
      return todate;
    }
  }
})
