import WxValidate from '../../utils/WxValidate';
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
    code:'',
    disableCode:false,
    note:'此应用仅供授权用户使用',
    noPermission:'暂无授权',
    registered:false,
    registeredNoPermission:'您已注册成功\r\n\r\n请等待管理员为您授权',
    userInfoReady:false
  },
  onLoad: function () {
    this.initValidate();
    var _this=this;
    app.setTitle('铭朗监控');
    _this.callUserInfo();
  },
  callUserInfo:function(){
    var _this=this;
    let time = setInterval(() => {
      console.log(app.globalData.userInfoReady);
      if(app.globalData.userInfoReady){
        clearInterval(time);
        _this.goAhead();
      }
    }, 1000);

  },
  goAhead:function(){
    var _this=this;
    if(app.globalData.userInfoReady){
      _this.setData({
        phone: app.globalData.phone,
        hasPermission: app.globalData.hasPermission,
        userInfoReady:true
      });
    }
    if (_this.data.hasPermission) {
      _this.goHome();
    }
  },
  onReady:function(){
    console.log('ready');
    this.goAhead();
    //wx.hideLoading();
  },
  countDown: function () {
    let timing = 60
    let time = setInterval(() => {
      timing--;
      this.setData({
        getCode:  timing,
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
    this.setData({
      disableCode:true
    });
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
          console.log(res.data);
          if (res.data.code == 0) {
            wx.showToast({
              title: '发送验证码成功',
              icon: 'success',
              duration: 2000
            })
            _this.countDown();
          } else {
            wx.showToast({
              title: '发送验证码失败',
              icon: 'none',
              duration: 2000
            });
            this.setData({
              disableCode: false
            });
          }
        },
        error: function (res) {
          wx.showToast({
            title: '发送验证码失败',
            icon: 'none',
            duration: 2000
          });
          this.setData({
            disableCode: false
          });
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
      });
      this.setData({
        disableCode: false
      });
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
  goHome:function(){
    wx.switchTab({
      url: '../home/home',
    })
  },
  initValidate: function () {
    const rules = {
      phone: {
        required: true,
        tel: true,
      },
      code: {
        required: true,
        digits: true,
        min: 6,
      }
    }
    const messages = {
      phone: {
        required: '请输入正确的手机号',
        tel: '请输入正确的手机号',
      },
      code: {
        required: '请输入验证码',
        digits: '验证码必须是数字',
        min: '验证码有6个数字',
      }
    }
    this.WxValidate = new WxValidate(rules, messages);
  },
  checkUser:function(e){
    var _this=this;
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      app.showModal(error.msg)
      return false
    }
    wx.showLoading();
    wx.request({
      url: app.globalData.serverUrl + 'checkuser',
      method: 'POST',
      data: {
        'phone': _this.data.inputPhone,
        'code':_this.data.code,
        'openId':app.globalData.openId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 0) {
          app.globalData.hasPermission=res.data.message;
          app.globalData.phone=_this.data.inputPhone;
          wx.hideLoading();
          wx.switchTab({
            url: '../home/home',
          })
        }else if(res.data.code==1){
          app.setTitle('等待授权');
          wx.hideLoading();
          _this.setData({
            registered: true
          });
        } else if(res.data.code==-2){
          wx.showToast({
            title: '验证码错误',
            image:'../../images/error.png',
            duration: 2000
          });
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }
      },
      error: function (res) {
        wx.showToast({
          title: '发送验证码失败',
          icon: 'none',
          duration: 2000
        });
        this.setData({
          disableCode: false
        });
      },
      complete: function (res) {
        
      }
    });
  }
})
