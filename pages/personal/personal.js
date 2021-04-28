import request from '../../util/request';
import PubSub from 'pubsub-js';

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
		recordSong: [],
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
			let recordSong = [];
			if (res.allData) {
				recordSong = res.allData.slice(0, 10).map(item => {
					item.id = index++;
					return item;
				})
			}

			this.setData({
				recordSong,
				hasRecord: true
			})
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

		// 订阅来自songDetail页面发布的数据
		PubSub.subscribe('switchType', (msg, type) => {
			let {
				index,
				recordSong
			} = this.data;

			if (type === 'pre') {
				// 如果当前是第一首，点击上一首，要转到最后一首
				index = index === 0 ? recordSong.length - 1 : --index;
			} else if (type === 'next') {
				// 如果当前是最后一首，点击下一首，要转到第一首
				index = index === recordSong.length - 1 ? 0 : ++index;
			} else if(type === 'random') {
				// 随机播放
				while(true) {
					let newIndex = Math.floor(Math.random() * recordSong.length);
					if(newIndex !== index) {
						index = newIndex;
						break;
					}
				}
			} 

			this.setData({
				index
			})
			let id = recordSong[index].song.id;
			// 将音乐的id发送给songDetail页面
			PubSub.publish('musicId', id);
		})

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