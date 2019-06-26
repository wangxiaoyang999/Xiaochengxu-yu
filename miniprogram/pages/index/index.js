//index.js
//获取应用实例
var util_weather = require('../api/util.js')
var formatLocation = util_weather.formatLocation
const app = getApp()

Page({
  data: {
    weatherInfo: {},
    newLocation: {},
    lifeInfo: {},
    nowInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onReady: function () {
    //初始化加载数据
    var self = this
    //获取定位信息 经纬度
    wx.getLocation({
      success: function (res) {
        //初始化【北京】经纬度  location=39.93:116.40（格式是 纬度:经度，英文冒号分隔） 
        var newLocation = '39.93:116.40';
        if (res) { newLocation = res.latitude + ":" + res.longitude }
        self.setData({
          newLocation: newLocation
        })
        if (!self.data.nowInfo.now) {
          //初始化获取 当前的天气状况
          wx.request({
            url: 'https://api.seniverse.com/v3/weather/now.json?key=fdw9qkun1btvenxt&location=' + newLocation + '&language=zh-Hans&unit=c',
            success: function (result) {
              self.setData({
                nowInfo: result.data.results[0]
              })
            },
            fail: function ({ errMsg }) {
              console.log('request fail', errMsg)
            }
          })
        }
