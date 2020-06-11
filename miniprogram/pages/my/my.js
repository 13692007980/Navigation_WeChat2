import util from '../../js/util.js'

Page({
  data: {
    userInfo:{},
    loginBool: false,

    model: '',
    system:'',
    version: ''
  },
  onLoad: function (options) {
    var _this = this
    wx.showLoading({
      title: '加载中',
    })
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          model: res.model,
          system: res.system,
          version: res.version
        })
      }
    })
    setTimeout(function(){
      wx.hideLoading()

      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                _this.setData({
                  userInfo: res.userInfo,
                })
              },
              fail(err) {
                console.log(err)
              }
            })
          }
        }
      })
    },1000)
  },
  LoginBtn: function(){
    var _this = this
    wx.showLoading({
      title: '加载中',
    })
    

    setTimeout(function () {
      wx.hideLoading()

      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                _this.setData({
                  userInfo: res.userInfo,
                  loginBool: true
                })
              },
              fail(err) {
                // console.log(err)
              }
            })
          }
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                _this.setData({
                  userInfo: res.userInfo,
                  loginBool: true
                })
              },
              fail(err) {
                // console.log(err)
              }
            })
          }
        }
      })
      _this.setData({
        loginBool: true
      })
    }, 2000)
  },
  CloseLogin: function(){
    var _this = this
    wx.showLoading({
      title: '注销中',
    })
    setTimeout(function(){
      wx.hideLoading()
      wx.showToast({
        title: '已退出！',
      })
      _this.setData({
        loginBool: false
      })
    },1000)
  }
})