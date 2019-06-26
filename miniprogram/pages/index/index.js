//index.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
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
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
