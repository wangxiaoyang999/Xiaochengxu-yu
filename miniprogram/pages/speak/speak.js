var msg, token, IMEI, filePath

Page({

  /** 

  * 页面的初始数据 

  */

  data: {
    msg:''
  },

  /** 

  * 生命周期函数--监听页面加载 

  */

  onLoad: function (options) {

    var that = this

    wx.getSystemInfo({

      success: function (res) {

        console.log(res)

        IMEI = res.SDKVersion

        console.log(IMEI)

      }

    }),

      //建立连接

      wx.connectSocket({

        url: "ws://123.207.167.163:9010/ajaxchattest",

        success: function (res) {

          console.log(res)

        }

      })
  },
  sendMessage: function (e) {

    msg = "成都市，晴，32摄氏度，北转南风2-3级，";

    var data = {

      msg: msg

    }

  },

  tts: function (e) {

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

        var text = '月丢';

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

            innerAudioContext.src = filePath

            innerAudioContext.onPlay(() => {

              console.log('开始播放')

            })

            innerAudioContext.onError((res) => {

              console.log(res.errMsg)

              console.log(res.errCode)

            })

          }

        })

      }

    })
    

  },

  // 合成

  cancel: function (e) {

    

  },

  //播放

  play: function (e) {

    

  },

})