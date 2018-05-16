//app.js
App({
  onLaunch: function () {
    this.wxLogIn();
    // 展示本地存储能力
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs);
    /*var sessionTime = wx.getStorageSync('sessionTime')||false;
    if(sessionTime==false){
      console.log('No Session');
      this.wxLogIn();
    }else{
      console.log('Has Session');
      var currentTime=Date.now();
      var diff=currentTime-sessionTime;
      diff = Math.floor(diff / (24 * 3600 * 1000));
      if(diff>=1){
        console.log('Login Again');
        this.wxLogIn();
      }else{
        this.wxLogIn();
        console.log('Unnecessary');
      }
    }*/

    // 登录
    /*wx.login({
      success: res => {
        this.globalData.resCode=res.code;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
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
                this.userInfoReadyCallback(res);
              }
            }
          })
        }else{
        }
      }
    })*/
  },
  wxLogIn:function(){
    wx.login({
      success: res => {
        this.globalData.resCode = res.code;
        this.getMiniAppUser();
        console.log(res);
      }
    })
  },
  globalData: {
    userInfo: null,
    serverUrl:'https://sgxcx.minnor.cn/index.php/sgminiapps/',
    resCode:'',
    phone:'',
    hasPermission:'',
    openId:'',
    sites:{},
    userInfoReady:false
  },
  getMiniAppUser: function () {
    var _this=this;
    wx.request({
      url: this.globalData.serverUrl + 'getuser',
      method: 'POST',
      data: {
        code: this.globalData.resCode
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //var app = getApp();
        if (res.data.code == 0) {
          //wx.hideLoading();
          //wx.setStorageSync("sessionTime", Date.now());
          _this.globalData.phone = res.data.message.phone;
          _this.globalData.hasPermission = res.data.message.hasPermission;
          _this.globalData.openId=res.data.message.openId;
          _this.globalData.userInfoReady=true;
          //var userData={};
          //userData['phone']=app.globalData.phone;
          //userData['hasPermission'] = app.globalData.hasPermission;
          //userData['token'] = app.globalData.hasPermission;
          //wx.removeStorageSync('userData');
          //wx.setStorageSync('userData', userData);
          console.log(res.data.message);
          console.log('Get user info done');
          if(_this.globalData.hasPermission){
            wx.switchTab({
              url: '../home/home',
            })
          }else{
            /*wx.redirectTo({
              url: '../check/check',
            })*/
          }
        } else {
          //wx.hideLoading();
          app.showModal('验证用户信息失败:'+res.data.message);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        _this.showModal('验证用户信息失败:' + res);
      },
      complete: function (res) {
        //wx.hideLoading();
      }
    });
  },
  showModal(error,url='') {
    var _this=this;
    wx.hideLoading();
    if(url!=''){
      wx.showModal({
        content: error,
        success:function(res){
          if(res.confirm){
            _this.globalData.hasPermission = false;
            _this.globalData.phone = false;
            wx.redirectTo({
              url: url,
            });
          }
        }
      })
    }else{
      wx.showModal({
        content: error,
        showCancel: false,
      });
    }
  },
  setTitle:function(txt){
    wx.setNavigationBarTitle({
      title: txt,
      success:function(){
        console.log("Set Title As "+txt);
      }  
    }); 
  },
})