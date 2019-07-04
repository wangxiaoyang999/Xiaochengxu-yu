const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alert:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    //初始化加载数据
    var self = this
    //获取定位信息 经纬度
    if (app.globalData.lat_ask == '') {
      wx.getLocation({
        success: function (res) {
          //初始化【北京】经纬度  location=39.93:116.40（格式是 纬度:经度，英文冒号分隔） 
          if (1) {
            wx.request({
              url: 'https://xurongrong.com:443/alert',
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
                    alert: res.data.data
                  })
              }
            })
          }
        }
      })
    }
    else {
      wx.request({
        url: 'https://xurongrong.com:443/alert',
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
            alert: res.data.data
            })
        }
      })
    }
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