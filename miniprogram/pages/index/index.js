//index.js
//获取应用实例
var util_weather = require('../api/util.js')
var formatLocation = util_weather.formatLocation
var bmap = require('../../utils/bmap-wx.js');
var common = require('../../utils/common.js'); 
const app = getApp()
  

Page({
  data: {
    weatherInfo: {},
    newLocation: {},
    nowInfo:{},
    userInfo: {},
    animationW: {},
    animationM: {},
    theWeather: {
      weatherIcon: "/images/w/w01",
      date: 30,
      currentCity: "北京",
      weatherDesc: "多云",
      pm25: 67,
      temperature: "24 ~ 14",
      wind: " 无风 "
    },
    cityMenus: [],
    today: "2017-05-01",
    date:{}
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
  
  setAdd: function () {
    wx.navigateTo({
      url: '../add/add'
    })
  },
  
  menuTab: function (e) {
    wx.showLoading();
    var itemId = e.target.id;
    var that = this;
    if (itemId == "") {
      console.log("id 空着");
      return;
    }
    var theCity = common.getCity()[itemId];
    var BMap = new bmap.BMapWX({
      ak: '1G4Ln9myGQPH95kRxeMi70C4X0zIZ2Z3'
    });
    var fail = function (data) {
      console.log(data);
      wx.hideLoading();
      return null;
    };
    var success = function (data) {
      wx.hideLoading();
      var weatherData = data.currentWeather[0];
      weatherData.fullData = data.originalData.results[0];
      console.log(weatherData);
      var date = weatherData.date;
      date = date.substring(date.indexOf("：") + 1, date.indexOf("℃"))
      weatherData.date = date
      var days = weatherData.fullData.weather_data;
      for (var i = 0; i < days.length; i++) {
        if (i == 0) {
          var todayText = days[i].date;
          todayText = todayText.substring(todayText.indexOf("周"), todayText.indexOf("周") + 2);
          days[i].date = todayText;
        }
        days[i].weather = common.iconChanger(days[i].weather).icon;
      }
      weatherData.fullData.weather_data = days;
      weatherData.xy = theCity.xy;
      var tudayStatus = common.iconChanger(weatherData.weatherDesc);
      weatherData.weatherIcon = tudayStatus.icon;
      weatherData.weatherDesc = tudayStatus.status;
      weatherData.wind = common.windHelper(weatherData.wind);
      weatherData.pmpm = common.pmText(weatherData.pm25);
      that.setData({
        theWeather: weatherData,
        today: common.getToday(),
        wall: tudayStatus.wall
      });
      that.setMenuNatural();
    }
    // 发起weather请求 
    BMap.weather({
      location: theCity.xy,
      fail: fail,
      success: success
    });
  },
  onPullDownRefresh: function () {
    console.log("wakakakak"); // scroll上无效
    // wx.stopPullDownRefresh 是他的停止函数
  },
  onLoad: function (options) {
    wx.showLoading();
    common.init();
    var that = this;
    if (options.name == null) {
      var BMap = new bmap.BMapWX({
        ak: '1G4Ln9myGQPH95kRxeMi70C4X0zIZ2Z3'
      });
      var fail = function (data) {
        console.log(data);
        wx.hideLoading();
      };
      console.log("正在添加新城市");
      //调用应用实例的方法获取全局数据
      var success = function (data) {
        wx.hideLoading();
        var weatherData = data.currentWeather[0];
        weatherData.fullData = data.originalData.results[0];

        var date = weatherData.date;
        date = date.substring(date.indexOf("：") + 1, date.indexOf("℃"));
        weatherData.date = date;
        var days = weatherData.fullData.weather_data;
        for (var i = 0; i < days.length; i++) {
          if (i == 0) {
            var todayText = days[i].date;
            todayText = todayText.substring(todayText.indexOf("周"), todayText.indexOf("周") + 2);
            days[i].date = todayText;
          }
          days[i].weather = common.iconChanger(days[i].weather).icon;
        }
        weatherData.fullData.weather_data = days;
        weatherData.xy = options.location;
        var tudayStatus = common.iconChanger(weatherData.weatherDesc);
        weatherData.weatherIcon = tudayStatus.icon;
        weatherData.weatherDesc = tudayStatus.status;
        weatherData.wind = common.windHelper(weatherData.wind);
        weatherData.pmpm = common.pmText(weatherData.pm25);

        common.refreshCity(weatherData);
        that.setData({
          theWeather: weatherData,
          today: common.getToday(),
          wall: tudayStatus.wall
        });
      }
      // 发起weather请求 
      BMap.weather({
        fail: fail,
        success: success
      });
    } else {
      var BMap = new bmap.BMapWX({
        ak: '1G4Ln9myGQPH95kRxeMi70C4X0zIZ2Z3'
      });
      var fail = function (data) {
        console.log(data);
        wx.hideLoading();
      };
      console.log("正在添加新城市");
      //调用应用实例的方法获取全局数据
      var success = function (data) {
        wx.hideLoading();
        var weatherData = data.currentWeather[0];
        weatherData.fullData = data.originalData.results[0];
        //console.log(weatherData);
        var date = weatherData.date;
        date = date.substring(date.indexOf("：") + 1, date.indexOf("℃"));
        weatherData.date = date;
        var days = weatherData.fullData.weather_data;
        for (var i = 0; i < days.length; i++) {
          if (i == 0) {
            var todayText = days[i].date;
            todayText = todayText.substring(todayText.indexOf("周"), todayText.indexOf("周") + 2);
            days[i].date = todayText;
          }
          days[i].weather = common.iconChanger(days[i].weather).icon;
        }
        weatherData.fullData.weather_data = days;
        weatherData.xy = options.location;
        var tudayStatus = common.iconChanger(weatherData.weatherDesc);
        weatherData.weatherIcon = tudayStatus.icon;
        weatherData.weatherDesc = tudayStatus.status;
        weatherData.wind = common.windHelper(weatherData.wind);
        weatherData.pmpm = common.pmText(weatherData.pm25);
        common.addCity(weatherData);
        that.setData({
          theWeather: weatherData,
          today: common.getToday(),
          wall: tudayStatus.wall
        });
      }
      // 发起weather请求 
      BMap.weather({
        location: options.location,
        fail: fail,
        success: success
      });
    }
  }
})
