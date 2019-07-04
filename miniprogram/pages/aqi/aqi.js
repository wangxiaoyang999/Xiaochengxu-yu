//aqi.js
//获取应用实例
var token, IMEI, filePath
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
        if (1) {
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
            })
        }
      }
    })
    }
    else{
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
        })
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
  },
    readinfo: function () {
    wx.showLoading({
      title: '正在读天气',
      mask: true
    });
    var that = this;
    var grant_type = "client_credentials";

    var appKey = "X230lr6YX2g7hrGgvGgz16kb";

    var appSecret = "UEP0d5CgDrcOPmulfEG6cu44fL7xULzA";

    // var url = "https://openapi.baidu.com/oauth/2.0/token" + "grant_type=" + grant_type + "&client_id=" + appKey + "&client_secret=" + appSecret

    var url = "https://openapi.baidu.com/oauth/2.0/token"

    wx.request({

      url: url,

      data: {

        grant_type: grant_type,

        client_id: appKey,

        client_secret: appSecret

      },

      method: "GET",

      header: {

        'content-type': 'application/json' // 默认值

      },

      success: function (res) {

        console.log(res.data)

        token = res.data.access_token

        var text = that.data.aqi.city.name + ',空气质量指数' + that.data.aqi.aqi.value + ',其中，PM2.5的污染指数为：' + that.data.aqi.aqi.pm25 + '。PM十的污染指数为' + that.data.aqi.aqi.pm10 + '。二氧化氮的污染指数为' + that.data.aqi.aqi.no2;

        var tex = encodeURI(text);//转换编码url_encode UTF8编码

        var tok = token;

        var cuid = IMEI;

        var ctp = 1;

        var lan = "zh";    // zh表示中文

        // 字符编码

        var spd = 5;  // 表示朗读的语速，9代表最快，1是最慢（撩妹请用2，绕口令请用9）

        var url = "https://tsn.baidu.com/text2audio?tex=" + tex + "&lan=" + lan + "&cuid=" + cuid + "&ctp=" + ctp + "&tok=" + tok + "&spd=" + spd

        wx.downloadFile({

          url: url,

          success: function (res) {

            console.log(res)

            filePath = res.tempFilePath;

            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容

            if (res.statusCode === 200) {

              wx.playVoice({

                filePath: res.tempFilePath

              })

            }
            const innerAudioContext = wx.createInnerAudioContext()

            innerAudioContext.autoplay = true

            innerAudioContext.src = encodeURI(filePath)

            innerAudioContext.onPlay(() => {

              console.log('开始播放')

            })

            innerAudioContext.onError((res) => {

              console.log(res.errMsg)

              console.log(res.errCode)

            })
            innerAudioContext.onEnded(() => {

              console.log('结束播放')
              wx.hideLoading()

            })

          }

        })

      }

    })
  }
  })