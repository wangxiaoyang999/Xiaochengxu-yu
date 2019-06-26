//index.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
  },

  onLoad: function() {
    var me = this;
    wx.getLocation({
      type:'wgs84',
      altitude:true,
      success:function(res){
        console.log("wx.getLocation.......");
        console.log(res);
        if(res&&res.latitude&&res.longitude){
          var longitude = res.longitude, latitude = res.latitude;
          me.loadCity(longitude,latitude);
        }else {
          me.setData({
            city:'获取失败'
          });
        }
      },
      fail:function(res){
        me.setData({
          city:'获取失败'
        });
      },
      complete:function(res){},
    })
  },
  
      
  loadCity: function(longitude,latitude){
    var me = this;
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=1G4Ln9myGQPH95kRxeMi70C4X0zIZ2Z3&location=' + latitude + ',' + longitude + '&output=json',
      data:{},
      header:{
        'Content-Type':'application/json'
      },
      success: function(res){
        if(res && res.data){
          var city = res.data.result.addressComponent.city;
          console.log("res..................");
          console.log(res);
          me.setData({
            city:city.indexOf('市') > -1 ? city.substr(0,city.indexOf('市')) :city
          });
        }else{
          me.setData({
            city:'获取失败'
          });
        }
      }
    })
  },
  
  
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  }

  
})
