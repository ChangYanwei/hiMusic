import request from '../../util/request';

// pages/personal/personal.js
let startY = 0;
let currentY = 0;
let distanceY = 0;

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		transformY: "translateY(0)",
		transition: "",
		userinfo: {},
		isLogin: false,
		recordSong:[],
		hasRecord:false
	},

	handleTouchStart(event) {
		this.setData({
			transition: ""
		});
		startY = event.changedTouches[0].clientY;
	},

	handleTouchMove(event) {
		currentY = event.changedTouches[0].clientY;
		distanceY = currentY - startY;
		if (distanceY > 0 && distanceY <= 100) {
			this.setData({
				transformY: `translateY(${distanceY}rpx)`
			})
		}
	},

	handleTouchEnd(event) {
		this.setData({
			transformY: `translateY(0)`,
			transition: 'transform 1s'
		})
	},

	// 跳转到登录界面
	toLogin() {
		wx.navigateTo({
			url: '../login/login',
		})
	},

	// 获取用户的播放记录
	getUserRecord(uid) {
		request('/user/record', {
			uid,
			type: 0
		}).then(res => {
			console.log('播放记录：',res);
			let index = 0;
			let recordSong = res.allData.slice(0,10).map(item => {
				item.id = index++;
				return item;
			})
			this.setData({
				recordSong,
				hasRecord:true
			})
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let userinfo = wx.getStorageSync('userinfo');

		if (userinfo) {
			userinfo = JSON.parse(userinfo);
			this.setData({
				userinfo,
				isLogin: true
			});
			
			this.getUserRecord(userinfo.uid);
		}

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