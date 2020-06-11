var bmap = require('../../libs/bmap-wx.js');
var wxMarkerData = []; 

Page({
  /**
   * 页面的初始数据
   */
  data: {
    Nalongitude: '',
    Nalatitude: '',
    longitude: '',
    latitude: '',
    markers:[{
      markers: [],
      id: 1,
      latitude: 0,
      longitude: 0,
    }],
    polyline: [{
      points: [{
        longitude: 0,
        latitude: 0
      }, {
        longitude: 0,
        latitude: 0
      }],
      color: "#FF0000DD",
      width: 4,
      dottedLine: true
    }],
    regAddress:{},
    inputValue:''
  },
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    var BMap = new bmap.BMapWX({
      ak: 'pHnR8t2C82uuesipVhYpVMvu67AjbsRs'
    }); 
    var fail = function (data) {
      // console.log(data)
    };
    var success = function (data) {
      // console.log(data)
      wxMarkerData = data.wxMarkerData;
      var str = wxMarkerData[0].address.slice(3,6)
      // console.log(str)
      _this.setData({
        markers: wxMarkerData,
        Nalatitude: wxMarkerData[0].latitude,
        latitude: wxMarkerData[0].latitude,
        Nalongitude: wxMarkerData[0].longitude,
        longitude: wxMarkerData[0].longitude,
        regAddress:{
          address: str
        }
      })
      wx.cloud.callFunction({
        name: 'add_locationCity',
        data: {
          _id: 'asd123456789',
          city: str,
          address: wxMarkerData[0].address
        },
        success: res => {
          // console.log(res)
        },
        fail: err => {
          // console.log(err)
        }
      })
    }
      BMap.regeocoding({
        fail: fail,
        success: success
      }); 

    wx.getLocation({
      success: function(res) {
        // console.log(res)
        _this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          markers:[{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude
          }]
        })
      },
    })
  },

  CitySearch: function(e){
    var _this = this
    this.setData({
      inputValue: e.detail.value
    })
  },

  CitySearchBtn: function(){
    var _this = this
    var BMap = new bmap.BMapWX({
      ak: 'pHnR8t2C82uuesipVhYpVMvu67AjbsRs'
    });
    var fail = function (data) {
      // console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      _this.setData({
        markers: wxMarkerData,
        latitude: wxMarkerData[0].latitude,
        longitude: wxMarkerData[0].longitude
      })
    }
    // 发起geocoding检索请求 
    BMap.geocoding({
      address: _this.data.inputValue,
      fail: fail,
      success: success
    }); 

    this.setData({
      regAddress:{
        address: _this.data.inputValue,
      }
    })
  },

  RouteBtn: function(){
    let plugin = requirePlugin('routePlan');
    let key = 'MQGBZ-Z2J3F-GZRJO-NVOK4-AW4J3-TAB5T';
    let referer = '城趣导航';
    let endPoint = JSON.stringify({  //终点
      'name': '吉野家(北京西站北口店)',
      'latitude': 39.89631551,
      'longitude': 116.323459711
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  }
})