const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'设置',
    phone:'',
    userInfo:{},
    getUserInfoBtn:'点击授权',
    userInfoTxt:'请允许我们使用您的微信用户信息\r\n便于向您推送实时报警信息',
    nickName:'',
    avatarUrl:'',
    hasUserInfo:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    app.setTitle(this.data.title);
    _this.setData({
      phone: app.globalData.phone
    });
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(res.data);
        _this.setData({
          userInfo: res.data,
          hasUserInfo: true
        });
        //wx.removeStorageSync('userInfo');
      },
      fail:function(res){
        console.log(res);
      }
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
  ,saveUserInfo:function(){
    console.log(this.data.userInfo);
    var _this=this;
    wx.request({
      url: app.globalData.serverUrl + 'saveuserinfo',
      method: 'POST',
      data: {
        phone: app.globalData.phone,
        token: app.globalData.hasPermission,
        userinfo:_this.data.userInfo
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
      }
    });
  }
  ,getUserInfo: function (e) {
    console.log(e.detail);
    var _this=this;
    if(e.detail.errMsg.indexOf('ok')>=0){
      _this.setData({
        userInfo:e.detail.userInfo,
        hasUserInfo:true
      });
      wx.setStorage({
        key: 'userInfo',
        data: _this.data.userInfo,
      });
      _this.saveUserInfo();
    }else{
      wx.showToast({
        title: '获取用户信息失败:'+e.detail.errMsg,
        icon:'none'
      })
    }
  }
  , showCompany:function(){
    wx.showModal({
      //title: '关于我们',
      content: '我们专注隧道、站房、市政设施的环境监控',
      showCancel:false
    })
  },
  quitUser:function(){
    var _this = this;
    wx.showModal({
      title: '退出',
      content: '确认退出登录?',
      success:function(res){
        if(res.confirm){
          wx.request({
            url: app.globalData.serverUrl + 'quit',
            method: 'POST',
            data: {
              phone: app.globalData.phone,
              token: app.globalData.hasPermission,
              openid: app.globalData.openId
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              if(res.data.code==0){
                app.globalData.phone = false;
                app.globalData.hasPermission = false;
                wx.redirectTo({
                  url: '../check/check',
                })
              }else{
                app.showModal('退出登录失败，请重试','');
              }
              
            },
            fail: function (res) {
              app.showModal('退出登录失败:'+res.data);
              console.log(res);
            },
            complete: function (res) {
            }
          });
        }
      }
    })
    
  }
})