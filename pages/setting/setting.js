const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'设置',
    userData:'',
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
    wx.getStorage({
      key: 'userData',
      success: function(res) {
        _this.setData({
          userData:res.data
        });
      },
    })
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        _this.setData({
          userInfo: res.data,
          hasUserInfo: true
        });
        wx.removeStorage({
          key: 'userInfo',
          success: function(res) {},
        })
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
  ,getUserInfo: function (e) {
    console.log(e.detail);
    if(e.detail.errMsg.indexOf('ok')>=0){
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickName:e.detail.userInfo.nickName,
      });
      var userInfo = {};
      userInfo['avatarUrl'] = this.data.avatarUrl;
      userInfo['nickName'] = this.data.nickName;
      wx.setStorageSync('userInfo', userInfo);
      this.setData({
        hasUserInfo: true
      });

    }else{
      wx.showToast({
        title: '获取用户信息失败:'+e.detail.errMsg,
        icon:'none'
      })
    }
  }
})