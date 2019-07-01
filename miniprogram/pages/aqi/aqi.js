//index.js
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
      }
    })
  },
  onLoad: function () {
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      time: time
    });
  },

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