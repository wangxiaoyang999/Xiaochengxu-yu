//aqi.js
//获取应用实例
var util_weather = require('../api/util.js')
var formatLocation = util_weather.formatLocation
const app = getApp()

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [[year, month].map(formatNumber).join('年'), day].map(formatNumber).join('月')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

Page({
  data: {
    weatherInfo: {},
    newLocation: {},
    nowInfo: {},
    date: {}
  },
  onShow: function () {
    //初始化加载数据
    var self = this
    //获取定位信息 经纬度
    if (app.globalData.lat_ask == '') {
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
              console.log(result.data),
                self.setData({
                  nowInfo: result.data.results[0]
                })
            },
            fail: function ({ errMsg }) {
              console.log('request fail', errMsg)
            }
          },
            wx.request({
              url: 'https://xurongrong.com:443/aqi',
              method: 'POST',
              data: {
                lat: res.latitude,
                lon: res.longitude
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data.data),
                  self.setData({
                    aqi: res.data.data
                  })
              }
            }))
        }
      }
    })
    }
    else{
      var newLocation = '39.93:116.40';
      newLocation = app.globalData.lat_ask + ":" + app.globalData.lon_ask
      self.setData({
        newLocation: newLocation
      })
      wx.request({
        url: 'https://api.seniverse.com/v3/weather/now.json?key=fdw9qkun1btvenxt&location=' + newLocation + '&language=zh-Hans&unit=c',
        success: function (result) {
          console.log(result.data),
            self.setData({
              nowInfo: result.data.results[0]
            })
        },
        fail: function ({ errMsg }) {
          console.log('request fail', errMsg)
        }
      },
        wx.request({
          url: 'https://xurongrong.com:443/aqi',
          method: 'POST',
          data: {
            lat: app.globalData.lat_ask,
            lon: app.globalData.lon_ask
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data.data),
              self.setData({
                aqi: res.data.data
              })
          }
        }))
    }
  },
  onLoad: function () {
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      time: time
    })
  },
  GoToSearch: function (param) {
    wx.redirectTo({
      url: '/pages/search/search',
    })
  },
  GoToLocal: function () {
    app.globalData.lat_ask = ''
    app.globalData.lon_ask = ''
    wx.switchTab({
      url: '/pages/me/me',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    }),
    wx.showModal({
      content: '恢复定位成功，请选择您要查询的内容，更多功能请参看“我的”页面。',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('确定')
        }
      }
    })
  }})