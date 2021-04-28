import request from '../../util/request';
import communication from "../../util/communication";

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
		musicList: [],
		hasRecord: false
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

	// 跳转到收藏界面
	toCollection() {
		wx.navigateTo({
			url: './collection/collection',
		})
	},

	// 获取用户的播放记录
	getUserRecord(uid) {
		request('/user/record', {
			uid,
			type: 0
		}).then(res => {
			console.log('播放记录：', res);
			let index = 0;
			let musicList = [];
			if (res.allData) {
				musicList = res.allData.slice(0, 10).map(item => {
					item.songKey = index++;
					return item;
				})
			}

			this.setData({
				musicList,
				hasRecord: true
			});

			// 因为获取播放记录的数据有时候可能请求不到，先判断一下，有数据的时候再监听
			if (musicList.length > 0) {
				// 订阅来自songDetail页面发布的数据
				let that = this;
				communication(that);
			}

		})
	},

	// 点击播放记录，跳转到音乐播放页面
	toSongDetail(event) {
		let id = event.currentTarget.dataset.id;
		let index = event.currentTarget.dataset.index;
		this.setData({
			index
		});
		wx.navigateTo({
			url: '/songPackage/pages/songDetail/songDetail?id=' + JSON.stringify(id),
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