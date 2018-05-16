var wxCharts = require('../../utils/wxcharts.js');
const app = getApp();
//const ctx = wx.createCanvasContext('lineCanvas', this);
//ctx.setLineWidth(1);
var lineChart = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    siteNo:null,
    siteName:'',
    userData: {},
    chartData:{},
    devices:{},
    reportTitle:'',
    timingTxt:'时间',
    dataTime:'',
    deviceListTxt:'设备列表'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getData: function () {
    wx.showLoading({
      title: '曲线加载中...',
    })
    var _this = this;
    wx.request({
      url: app.globalData.serverUrl + 'sitechart',
      method: 'POST',
      data: {
        phone: app.globalData.phone,
        token: app.globalData.hasPermission,
        type:'',
        site:this.data.siteNo
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
          if(res.data.code==0){
          var level=[];
          var categray=[];
          var highest=[];
          var lowest=[];
          res.data.message[1].forEach(function(element){
            level.push(element.fd_value);
            categray.push(element.fd_time.substring(11,16));
            highest.push(res.data.message[0].fd_highest);
            lowest.push(res.data.message[0].fd_lowest);
          });
          _this.initChart(level,categray,highest,lowest);
          //wx.hideLoading();
        }else if(res.data.code==-2){
            wx.showToast({
              title: '参数异常，请登录后重试',
              duration: 5000,
              icon: 'none'
            })
        }else{
          //wx.hideLoading();
          wx.showToast({
            title: '加载失败,下拉页面重新加载',
            duration:2000,
            icon: 'none'


          })
        }
        _this.setData({
          reportTitle:'24小时内水位曲线'
        });
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
  getDevice: function () {
    wx.showLoading({
      title: '设备加载中...',
    })
    var _this = this;
    wx.request({
      url: app.globalData.serverUrl + 'sitedevice',
      method: 'POST',
      data: {
        phone: app.globalData.phone,
        token: app.globalData.hasPermission,
        type: '',
        site: this.data.siteNo
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if(res.data.code==0){
          wx.hideLoading();
        _this.setData({
          devices:res.data.message,
          dataTime:res.data.message[0].fd_time
        });
        }else if(res.data.code==-2){
          wx.showToast({
            title: '参数异常，请登录后重试',
            duration: 5000,
            icon: 'none'
          })
        }else{
          wx.showToast({
            title: '加载失败,下拉页面重新加载',
            duration: 2000,
            icon: 'none'
          })
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
        //wx.hideLoading();
      }
    });
  },
  touchHandler: function (e) {
    //console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  switchDevice:function(e){
    console.log(e);
    var cmdStr='stop';
    var _this = this;
    cmdStr=e.detail.value?'start':'stop';
    var deviceId=e.target.dataset.deviceid;
    var deviceName = e.target.dataset.devicename.replace(/(^\s*)|(\s*$)/g,'');
    var action=e.detail.value?'启动':'停止';
    var confirmStr='确定'+action+_this.data.siteName+':'+deviceName+'吗?';

    wx.showModal({
      title: '远程控制',
      content: confirmStr,
      success:function(res){
        if(res.confirm){
          wx.showLoading({
            title: '命令发送中...',
          })
          wx.request({
            url: app.globalData.serverUrl + 'devicecontrol',
            method: 'POST',
            data: {
              phone: app.globalData.phone,
              token: app.globalData.hasPermission,
              cmd: cmdStr,
              site: _this.data.siteNo,
              device: deviceId
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              //wx.hideLoading();
              console.log(res.data);
              if(res.data.code==0){
                wx.showToast({
                title: '发送成功',
                icon:'success',
                duration:2000
              })
              }else if(res.data.code==-1){
                wx.showToast({
                  title: '发送失败:'+res.data.message,
                  duration:5000,
                  icon: 'none'
                })
              } else if (res.data.code == -2) {
                wx.showToast({
                  title: '发现另外一台设备登录，请重新登录',
                  duration: 5000,
                  icon: 'none'
                })
              }
            },
            fail: function (res) {
              
              wx.showToast({
                title: 'error:'+res,
                duration:5000,
                icon: 'none'
              })
            },
            complete: function (res) {
              
            }
          });
        }else{

        }
      }
    })
    
    
  },
  onLoad: function (options) {
    //console.log(options);
    this.setData({
      siteNo:options.siteNo,
      siteName:options.siteName
    });
    app.setTitle(this.data.siteName);
    //this.getStorage();
    this.getData();
    this.getDevice();
    //this.initChart();
  },
  initChart: function (level, categray,highest,lowest){
    var _this=this;
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      //console.log(windowWidth);
    } catch (e) {
      console.log('getSystemInfoSync failed!');
    }
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      enableScroll:false,
      type: 'line',
      categories: categray,
      animation: true,
      title: [{
        name: '24小时水位曲线'
      }],
      series: [
      {
        name: '警戒水位',
        data: highest,
        color:'red',
        format: function (val, name) {
          console.log(val);
          return val + 'cm';
        }
        }, {
        name: '实时水位',
        data: level,
        color:'green',
        format: function (val, name) {
          return val + 'cm';
        }
      },
      {
        name: '最低水位',
        data: lowest,
        color: 'orange',
        format: function (val, name) {
          return val + 'cm';
        }
      }],
      xAxis: {
        disableGrid: false,
        //type:'calibration',
        gridColor:'#eee',
        disabled:false
      },
      yAxis: {
        disableGrid:false,
        disabled:false,
        format: function (val) {
          return val;
        },
        min: lowest[0],
        //title:'水位高度'
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: false,
      legend: true,
       extra: {
        lineStyle: 'curve'
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
    
    //wx.hideLoading();
    //wx.stopPullDownRefresh();
  },
  refresh:function(){
    var _this = this;
    _this.getData(_this.data.userData.phone, _this.data.userData.token);
    _this.getDevice(_this.data.userData.phone, _this.data.userData.token);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //console.log('reach');
    //var _this=this;
    //_this.getDevice(_this.data.userData.phone, _this.data.userData.token);
    //wx.hideLoading();
   // wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})