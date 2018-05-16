const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'消息详情',
    alarmId:null,
    message:{},
    transaction:{},
    userData:{},
    deviceListTxt:'报警发生时设备工况'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle(this.data.title);
    this.setData({
      alarmId: options.id
    });
    this.getDetail();
    

  },
  ackAlarm:function(){
    var _this = this;
    wx.request({
      url: app.globalData.serverUrl + 'ackalarm',
      method: 'POST',
      data: {
        phone: app.globalData.phone,
        token: app.globalData.hasPermission,
        id: _this.data.alarmId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {

      },
      complete: function (res) {
        //wx.hideLoading();
      }
    });
  },
  getDetail: function () {
    wx.showLoading({
      title: '数据加载中...',
    })
    var _this = this;
    wx.request({
      url: app.globalData.serverUrl + 'alarmdetail',
      method: 'POST',
      data: {
        phone: app.globalData.phone,
        token: app.globalData.hasPermission,
        id: _this.data.alarmId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data);
        _this.ackAlarm();
        if (res.data.code == 0) {
          wx.hideLoading();
          _this.setData({
            message: res.data.message[0],
            transaction:res.data.message[1]
          });
        } else if (res.data.code == -2) {
          app.showModal('登录失败，请重新登录', '../check/check');
        } else {
          app.showModal('数据加载失败，请下拉刷新重试');
        }
        console.log(res.data);

      },
      fail: function (res) {
        console.log(res);
        app.showModal('数据加载失败，请下拉刷新重试');
      },
      complete: function (res) {
        //wx.hideLoading();
      }
    });
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
    var _this=this;
    _this.getDetail();
    wx.stopPullDownRefresh();
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
})