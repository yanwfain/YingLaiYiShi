var app = getApp();
var Promise = require("es6-promise.auto.js");
// var timeFormatUtils = require("timeFormatUtils.js")
var modelInfo = {};
/**
 * 传进微信小程序封装好的api,例如:wx.request,wx.login
 */
function httpPromise(fn){
  return function(obj = {}){
    return new Promise((resolve,reject)=>{
        obj.success=function(res){
          resolve(res);
        },
        obj.fail=function(res){
          //失败
          reject(res);
        }
        fn(obj);
    })
  }
}
function httpRequestPromise(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        // console.log(res);
        if (res.data.head.errCode != 10000){
          // console.log('这是返回的错误的信息');
          resolve(res);
          return;
        }
        // console.log('这是返回的正确的信息');
        resolve(res);
      },
        obj.fail = function (res) {
          //失败
          reject(res);
        }
      fn(obj);
    })
  }
}
/**
 * 封装网络请求
 */
function postRequest(url,data){
  var postRequest = httpRequestPromise(wx.request);
  let tokens = '';
  let nicknames = "";
  let operators = '';
  let model = '';
  let system = '';
  let platform = '';
  let dates = timeFormatUtils.getDateFormat(new Date().getTime(), "yyyy-MM-dd hh-mm-ss");
  // wx.showLoading({
  //   title: '加载中',
  // })
  // console.log(data);
  var obj = {
    "body":data,
    "head":{
      "digest": dates,
      "operatorType": "CUSTOMER_LOGIN",
      "operator": operators,
      "operatorLevel": "CUSTOMER",
      "appVersion": 8,
      "appType": "XIAOCHENGXU_Client_PHONE",
      "token": tokens,
      "modelInfo": modelInfo,
      "nicknames": nicknames,
      "token": app.globalData.token
    }
  }
  return postRequest({
    url: url,
    header: {
      'content-type': "",
      "token": app.globalData.token,
      "operator": operators,
      "modelInfo": modelInfo,
      "model": model,
      "appVersion": '8',
      "source": "",
      "shopCode": "",
      "companyCode": "",
      "os": "",
      "version": "",
      "deviceCode": '',
      "appType": ""
    },
    method:'POST',
    data: obj
  });
}

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
/**
 * 获取wx登录的code
 */
function wxLogin(){
  var wxLogin  = httpPromise(wx.login);
  return wxLogin;
}

function httpRequest(obj) {
  // console.log(obj.url);
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 10000,
    mask: true
  })
  let tokens = '';
  let operators = '';
  let model = '';
  let system = '';
  let platform = '';
  let dates = timeFormatUtils.getDateFormat(new Date().getTime(),"yyyy-MM-dd hh-mm-ss");
  wx.getSystemInfo({
    success: function (res) {
      model = res.model;
      platform = res.platform;
      system = res.system;
      if (system.indexOf(" ") >= 0) {
        var infos = system.split(" ");
        if (infos.length > 1) {
          platform = infos[0].toLocaleUpperCase();
          system = infos[1];
        }
      }
      if (model.indexOf("<") >= 0) {
        model = model.substring(model.indexOf("<") + 1, model.length - 1);
      }
      console.log(model)
      console.log(system)
      console.log(res.version)
      console.log(platform)
    }
  })
 
  obj.method = 'POST';
  obj.data = {
    "body": obj.body,
    "head": {
      "digest": dates,
      "operatorType": "CUSTOMER_LOGIN", 
      "operator": operators,
      "operatorLevel": "CUSTOMER",
       "appVersion": 8,
      "appType": "XIAOCHENGXU_Client_PHONE", 
      "token": tokens,
      "modelInfo": modelInfo
    }
  };

  return new Promise(function (resove, reject) {
    obj.success = function (res) {
      if (res.data.head.errCode == 10000) {
        res.code = 1;
        res.errMsg = "数据请求成功";
        res.data = res.data.body;
      } else {
        res.code = -1;
        res.errMsg = res.data.body.errMsg;
        if (res.data.head.errCode == 10001) {
          wx.setStorage({
            key: "isAutoLogin",
            data: false,
          });
          return;
        } else {
          wx.showModal({
            title: '提示',
            content: res.errMsg || '未知错误,请重试',
            showCancel: false,
            success: function (res) {
              console.log(res+ "===000")

            }
          })
        }
      }
      resove(res);
      setTimeout(function () {
        wx.hideToast()
      }, 500)
    };
    obj.fail = function (error) {
      wx.showModal({
        title: '提示',
        content: "请检查网络",
        showCancel: false
      })
      reject(error);
    }
    wx.request(obj);
  })
}

module.exports = {
  postRequest: postRequest,
  httpPromise: httpPromise,
  wxLogin:wxLogin,
  httpRequest: httpRequest
}



// 获取手机部分信息
wx.getSystemInfo({
  success: function (res) {
    // console.log(res);
    // 手机品牌
    modelInfo.brand = res.brand;
    // 手机型号
    modelInfo.model = res.model;
  }
})
// console.log(modelInfo);

// module.exports={
//   modelInfo: modelInfo
// }