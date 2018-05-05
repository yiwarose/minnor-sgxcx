//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    //motto: '',
    //userInfo: {},
    //hasUserInfo: false,
    //canIUse: wx.canIUse('button.open-type.getUserInfo')
    phone:false,
    hasPermission:false,
    getCode:'获取验证码',
    inputPhone:'',
    code:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var _this=this;
    app.setTitle('铭朗监控');
    wx.getStorage({
      key: 'phone',
      success: function(res) {
        _this.setData({
          phone:res.data
        });
      },
    });
    /*if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }*/
  },
  countDown: function () {
    let timing = 60
    let time = setInterval(() => {
      timing--;
      this.setData({
        getCode:  timing+'s',
        disableCode: true
      });
      if (timing == 0) {
        clearInterval(time);
        this.setData({
          getCode: "获取验证码",
          disableCode: false
        });
      }
    }, 1000);
  },
  requestCode: function (e) {
    let _this = this;
    if (this.data.inputPhone.length == 11) {
      wx.showLoading();
      wx.request({
        url: app.globalData.serverUrl + 'xcode',
        method: 'POST',
        data: {
          'phone': _this.data.inputPhone,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: '发送验证码成功',
              icon: 'success',
              duration: 2000
            })
            _this.countDown();
          } else if (res.data.code == 2) {
            app.showModal(res.data.message);
          } else {
            wx.showToast({
              title: '发送验证码失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
        error: function (res) {
          wx.showToast({
            title: '发送验证码失败',
            icon: 'none',
            duration: 2000
          })
        },
        complete: function (res) {
          wx.hideLoading();
        }
      });
    } else {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 2000
      })
    }
  },
  getInput: function (e) {
    if (e.target.id == 'phone') {
      this.setData({
        inputPhone: e.detail.value
      })
    }
    if (e.target.id == 'code') {
      this.setData({
        code: e.detail.value
      })
    }
  },
  /*
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }*/
})
