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
    this.getStorage();
    

  },
  ackAlarm:function(){
    var _this = this;
    wx.request({
      url: app.globalData.serverUrl + 'ackalarm',
      method: 'POST',
      data: {
        phone: _this.data.userData.phone,
        token: _this.data.userData.token,
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
  getStorage: function () {
    var _this = this;
    wx.showLoading({
      title: '数据加载中...',
    })
    wx.getStorage({
      key: 'userData',
      success: function (res) {
        _this.setData({
          userData: res.data,
        });
        //wx.hideLoading();
        _this.getDetail(_this.data.userData.phone, _this.data.userData.token);
      },
      fail: function (res) {
        // wx.hideLoading();
        wx.showToast({
          title: '本地数据错误:' + res.data,
          duration: 5000
        })
      },
      complete: function () {
        //wx.hideLoading();
      }
    })
  },
  getDetail: function (phone, token) {
    wx.showLoading({
      title: '信息加载中...',
    })
    var _this = this;
    wx.request({
      url: app.globalData.serverUrl + 'alarmdetail',
      method: 'POST',
      data: {
        phone: phone,
        token: token,
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
          wx.showToast({
            title: '参数异常，请登录后重试',
            duration: 5000
          })
        } else {
          wx.showToast({
            title: '加载失败,下拉页面重新加载',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '加载失败,下拉页面重新加载',
          duration: 2000
        })
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
    _this.getDetail(_this.data.userData.phone, _this.data.userData.token);
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