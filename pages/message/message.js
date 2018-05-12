// pages/message/message.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: {},
    message: {},
    searchPlaceHolder:'信息筛选',
    searchTxt:'',
    noResult: '没搜索到相关信息'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle('消息');
    this.getStorage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  goToMessageDetail:function (e) {
    //console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../messageDetail/messageDetail?id=' + e.currentTarget.dataset.id,
    })
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
    this.getMessage(this.data.userData.phone, this.data.userData.token);
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
  ,searchConfirm: function (event) {
    var searchTxt = event.detail.value;
    //console.log(searchTxt);
    //if (searchTxt == '') searchTxt = 'all';
    this.setData({
      searchTxt: searchTxt,
    });
    this.getMessage(this.data.userData.phone, this.data.userData.token);
  }
  ,getStorage: function () {
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
        wx.hideLoading();
        _this.getMessage(_this.data.userData.phone, _this.data.userData.token);
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '本地数据错误:' + res.data,
          duration: 5000,
          icon: 'none'
        })
      },
      complete: function () {
        //wx.hideLoading();
      }
    })
  },
  getMessage: function (phone, token) {
    wx.showLoading({
      title: '加载消息...',
    })
    var _this = this;
    wx.request({
      url: app.globalData.serverUrl + 'alarms',
      method: 'POST',
      data: {
        phone: phone,
        token: token,
        searchtxt:_this.data.searchTxt,
        index:0,
        count:50
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.code==0){
          _this.setData({
            message: res.data.message
          });
        } else if (res.data.code == -1) {
          wx.showToast({
            title: '发送失败:' + res.data.message,
            duration: 5000,
            icon: 'none'
          })
        } else if (res.data.code == -2) {
          wx.showToast({
            title: '发现另外一台设备登录，请重新登录',
            duration: 5000,
            icon: 'none'
          })
        }
        console.log(res.data);
        wx.hideLoading();
      },
      fail: function (res) {
        wx.showToast({
          title: 'error:' + res,
          duration: 5000,
          icon: 'none'
        })
      },
      complete: function (res) {
        
      }
    });
  }
})