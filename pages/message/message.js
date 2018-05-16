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
    noResult: '没搜索到相关消息'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle('消息');
    //this.getStorage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getMessage();
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
    this.getMessage();
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
    this.setData({
      searchTxt: searchTxt,
    });
    this.getMessage();
  }
  ,
  getMessage: function () {
    wx.showLoading({
      title: '数据加载中...',
    })
    var _this = this;
    wx.request({
      url: app.globalData.serverUrl + 'alarms',
      method: 'POST',
      data: {
        phone: app.globalData.phone,
        token: app.globalData.hasPermission,
        searchtxt:_this.data.searchTxt,
        index:0,
        count:50
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        if(res.data.code==0){
          _this.setData({
            message: res.data.message
          });
        }else if (res.data.code == -2) {
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
        
      }
    });
  }
})