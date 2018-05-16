// pages/pumpstatic/pumpStatic.js
var util = require('../../utils/util.js');  
var wxCharts = require('../../utils/wxcharts.js');
const app=getApp();
var columnChart = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title:'启停次数、运行时长',
    siteTitle:'',
    siteNo:false,
    endDate:'',
    siteIndex:'',
    startDate:'',
    endDate:'',
    limitDate:'',
    categories: ['一号泵', '二号泵'],
    pump1:[],
    pump2:[],
    noResult:'无数据'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatTime(new Date());
    this.setData({
      startDate: time.substring(0,10),
      endDate: time.substring(0, 10),
      limitDate: time.substring(0, 10)
    }); 
    app.setTitle(this.data.title);
    var sites=new Array();
    if(app.globalData.sites.length!=undefined){
      app.globalData.sites.forEach(function(e){
        sites.push(e.fd_name);
      });
      this.setData({
        sites:sites,
        siteIndex:0
      });
    }else{
      this.getSites();
    }
  },
  getSites: function () {
    wx.hideLoading();
    wx.showLoading({
      title: '加载站点...',
    });
    var _this = this;
    wx.request({
      url: app.globalData.serverUrl + 'sites',
      method: 'POST',
      data: {
        phone: app.globalData.phone,
        token: app.globalData.hasPermission,
        sitetype: 'all'
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data);
        if (res.data.code == 0) {
          wx.hideLoading();
            app.globalData.sites = res.data.message;
            var sites = new Array();
            app.globalData.sites.forEach(function (e) {
              sites.push(e.fd_name);
            });
            _this.setData({
              sites: sites,
              siteIndex: 0
            });
        } else if (res.data.code == -2) {
          wx.showToast({
            title: '参数异常，请登录后重试',
            duration: 5000,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '加载失败,下拉页面重新加载',
            duration: 2000,
            icon: 'none'
          })
        }
        //console.log(res.data);
      },
      fail: function (res) {
        wx.showToast({
          title: '加载失败,请重试',
          duration: 2000,
          icon: 'none'
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
  bindSiteChange:function(e){
    console.log(e);
    this.setData({siteIndex:e.detail.value});
    this.getData();
  }
  , bindStartChange: function (e) {
    this.setData({startDate: e.detail.value });
    console.log(e.detail.value);
    this.getData();
  }
  , bindEndChange: function (e) {
    this.setData({ endDate: e.detail.value });
    this.getData();
  },
  initChart: function () {
    var _this = this;
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      //console.log(windowWidth);
    } catch (e) {
      console.log('getSystemInfoSync failed!');
    }
    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: _this.data.categories,
      series: [{
        name: '启停次数',
        data: _this.data.pump1,
        format: function (val, name) {
          return val+'次';
        }
      }, {
        name: '抽水时长',
        data: _this.data.pump2,
        format: function (val, name) {
          return val+'分钟';
        }
      }],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0
      },
      xAxis: {
        disableGrid: false,
        //type: 'calibration'
      },
      extra: {
        column: {
          width: 20
        }
      },
      width: windowWidth,
      height: 200,
    });
  },
  getData: function () {
    wx.showLoading({
      title: '数据加载中...',
    })
    var _this = this;
    //console.log(_this.data.startDate);
    wx.request({
      url: app.globalData.serverUrl + 'pumpstatic',
      method: 'POST',
      data: {
        phone: app.globalData.phone,
        token: app.globalData.hasPermission,
        site: app.globalData.sites[_this.data.siteIndex].fd_siteno,
        start: _this.data.startDate,
        end: _this.data.endDate
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.code == 0) {
          console.log(res.data.message.length);
          if(res.data.message.length>0){
          var pump1=new Array();
          var pump2= new Array();
          res.data.message.forEach(function(e){
            pump2.push(e.totalminutes);
            pump1.push(e.times);
          });
          _this.setData({
            pump1:pump1,
            pump2:pump2
          });
          _this.initChart();
          }
        } else if (res.data.code == -2) {
          wx.showToast({
            title: '参数异常，请登录后重试',
            duration: 5000,
            icon: 'none'
          })
        } else {
          
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '加载失败,下拉页面重新加载',
          duration: 2000,
          icon: 'none'
        })
      },
      complete: function (res) {

      }
    });
  },
  
})