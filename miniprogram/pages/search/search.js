var QQMapWX = require('../api/qqmap-wx.js');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'BULBZ-TL3LP-E4BDW-VNKYF-SQIPS-JMBEX'
});

var app = getApp()

Page({
  data:{
    lat:{},
    lon:{},
  },
  onReady:function(){
    console.log(app.globalData.lat_ask + "+" + app.globalData.lon_ask);
  },
  //触发表单提交事件，调用接口
  formSubmit(e) {
    var _this = this;
    //调用地址解析接口
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: e.detail.value.geocoder,//地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        //根据地址解析在地图上标记解析地址位置
        _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          markers: [{
            id: 0,
            title: res.title,
            latitude: latitude,
            longitude: longitude,
            iconPath: '/images/placeholder.png',//图标路径
            width: 20,
            height: 20,
            callout: { //可根据需求是否展示经纬度
              content: latitude + ',' + longitude,
              color: '#000',
              display: 'ALWAYS'
            }
          }],
          poi: { //根据自己data数据设置相应的地图中心坐标变量名称
            latitude: latitude,
            longitude: longitude
          },
          lon:longitude,
          lat:latitude,
          
        });
        // 绑定全局变量
        getApp().globalData.lat_ask = _this.data.lat
        getApp().globalData.lon_ask = _this.data.lon
        console.log(app.globalData.lat_ask + "+" + app.globalData.lon_ask);
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
    // 跳转到me界面（防止跳转异常）
    wx.reLaunch({
      url: '/pages/me/me',
      success: function (e) {
        let pages = getCurrentPages()
        if (pages.length === 0) return

        let curPage = pages[pages.length - 1];
        curPage.onShow();
      },
      fail: function (res) {
        console.log('失败')
      }
    })
  },
  ////给搜索框用的，先删去
  // showInput: function () {
  //   this.setData({
  //     inputShowed: true
  //   });
  // },
  // hideInput: function () {
  //   this.setData({
  //     address_value: "",
  //     inputShowed: false
  //   });
  // },
  // clearInput: function () {
  //   this.setData({
  //     address_value: ""
  //   });
  // },
  // inputTyping: function (e) {
  //   this.setData({
  //     address_value: e.detail.value
  //   });
  // },
  //
  //跳转me
  openAlert: function () {
    wx.showModal({
      content: '查询成功，请选择您要查询的内容，更多功能请参看本页面。',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('确定')
        }
      }
    })}
});