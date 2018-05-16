// pages/home/home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData:{},
    siteType:'all',
    sites:{},
    searchPlaceHolder:'根据关键字搜索站点',
    noResult:'没搜索到相关站点'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中...',
    })
    app.setTitle('站点');
    this.getSites();
    //this.getStorage();
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
    //this.formSubmit();
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
    console.log('pull down');
    //wx.showNavigationBarLoading();
    this.getSites();
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
  
  },
  searchConfirm:function(event){
    var searchTxt=event.detail.value;
    searchTxt=searchTxt.replace("'","");
    if (searchTxt=='')searchTxt='all';
    this.setData({
      siteType: searchTxt,
    });
    this.getSites();
  },
  getSites:function(){
    var _this=this;
    wx.request({
      url: app.globalData.serverUrl + 'sites',
      method: 'POST',
      data: {
        phone:app.globalData.phone,
        token:app.globalData.hasPermission,
        sitetype:_this.data.siteType
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if(res.data.code==0){
          wx.hideLoading();
          _this.setData({
            sites: res.data.message
          });
          if(_this.data.siteType=='all'){
            app.globalData.sites=res.data.message;
          }
        }else if(res.data.code==-2){
          app.showModal('登录失败，请重新登录','../check/check');
        }else{
          app.showModal('数据加载失败，请下拉刷新重试');
        }
      },
      fail: function (res) {
        console.log(res);
        app.showModal('数据加载失败，请下拉刷新重试');
      },
      complete: function (res) {
        //wx.hideLoading();
      }
    });
  }
  ,goToSiteDetail:function(e){
    //console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../siteDetail/siteDetail?siteNo='+e.currentTarget.dataset.siteno+'&siteName='+e.currentTarget.dataset.sitename,
    })
  }
})