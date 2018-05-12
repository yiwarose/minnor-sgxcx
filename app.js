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
    wx.showLoading({
      title: '数据加载中...',
    })
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
    openId:''
  },
  getMiniAppUser: function () {
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
        //console.log(res.data);
        var app = getApp();
        if (res.data.code == 0) {
          //wx.setStorageSync("sessionTime", Date.now());
          app.globalData.phone = res.data.message.phone;
          app.globalData.hasPermission = res.data.message.hasPermission;
          app.globalData.openId=res.data.message.openId;

          var userData={};

          userData['phone']=app.globalData.phone;
          userData['hasPermission'] = app.globalData.hasPermission;
          userData['token'] = app.globalData.hasPermission;

          wx.setStorageSync('userData', userData);

          console.log('Get user info done');
        } else {
          app.showModal('验证用户信息失败:'+res.data.message);
        }
      },
      fail: function (res) {
        app.showModal('验证用户信息失败:' + res);
      },
      complete: function (res) {
        wx.hideLoading();
        //console.log('app done');
      }
    });
  },
  showModal(error) {
    wx.showModal({
      content: error,
      showCancel: false,
    })
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