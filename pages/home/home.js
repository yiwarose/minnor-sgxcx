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
    app.setTitle('站点');
    this.getStorage();
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
    this.formSubmit();
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
    this.getSites(this.data.userData.phone,this.data.userData.token);
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
    //console.log(searchTxt);
    if (searchTxt=='')searchTxt='all';
    this.setData({
      siteType: searchTxt,
    });
    this.getSites(this.data.userData.phone, this.data.userData.token);
  },
  getStorage:function(){
    var _this=this;
    wx.showLoading({
      title: '数据加载中...',
    })
    wx.getStorage({
      key: 'userData',
      success: function(res) {
        _this.setData({
          userData:res.data,
        });
        wx.hideLoading();
        _this.getSites(_this.data.userData.phone,_this.data.userData.token);
      },
      fail:function(res){
        wx.hideLoading();
        wx.showToast({
          title: '本地数据错误:'+res.data,
          duration:5000,
          icon: 'none'
        })
      },
      complete:function(){
        //wx.hideLoading();
        
      }
    })
  },
  formSubmit:function(e){
    console.log(e);
  },
  getSites:function(phone,token){
    wx.showLoading({
      title: '加载站点...',
    })
    var _this=this;
    wx.request({
      url: app.globalData.serverUrl + 'sites',
      method: 'POST',
      data: {
        phone:phone,
        token:token,
        sitetype:_this.data.siteType
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.code==0){
          wx.hideLoading();
          _this.setData({
            sites: res.data.message
          });
        }else if(res.data.code==-2){
          wx.showToast({
            title: '参数异常，请登录后重试',
            duration:5000,
            icon: 'none'
          })
        }else{
          wx.showToast({
            title: '加载失败,下拉页面重新加载',
            duration: 2000,
            icon:'none'
          })
        }
        //console.log(res.data);
      },
      fail: function (res) {
        console.log(res);
        wx.showToast({
          title: '加载失败,下拉页面重新加载',
          duration: 2000,
          icon: 'none'
        })
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