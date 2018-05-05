//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        this.globalData.resCode=res.code;
        //console.log('login');
        //this.globalData.encryptedData = res.encryptedData;
        //console.log(res);
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
              this.globalData.encryptedData = res.encryptedData;
              this.globalData.iv = res.iv;
              this.checkRegistered();
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          })
        }else{
          //no action..
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    serverURL:'https://sgxcx.minnor.cn/index.php/sgminiapps/',
    resCode:'',
    encryptedData:'',
    iv:''
  },
  checkRegistered: function () {
    wx.request({ //判断微信用户是否已经绑定了手机号
      url: this.globalData.serverURL + 'getunionid',
      method: 'POST',
      data: {
        code: this.globalData.resCode,
        data: this.globalData.encryptedData,
        iv: this.globalData.iv
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 0) {
        } else if (res.data.code == 1) {
        } else {
        }
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
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
        console.log("set title as "+txt);
      }  
    }); 
  },
})