import request from '../../../util/request';
import communication from "../../../util/communication";

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		day: "",
		month: "",
		musicList: [],
		index: 0
	},

	// 获取当前日期
	getDate() {
		let date = new Date();
		this.setData({
			day: date.getDate(),
			month: date.getMonth() + 1
		})
	},

	// 获取每日推荐歌曲
	async getRecommendSong() {
		wx.showLoading({
			title: '努力加载中...'
		})
		let data = await request('/recommend/songs', {}, 'GET', {
			cookie: wx.getStorageSync('cookie') ? wx.getStorageSync('cookie').join('') : ''
		});
		this.setData({
			musicList: data.recommend
		})
		wx.hideLoading();
	},

	// 跳转到音乐播放页面
	toSongDetail(event) {
		let id = event.currentTarget.id;
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
		// 判断用户是否登录，如果没有登录就跳转到登录界面
		let userInfo = wx.getStorageSync('userinfo');
		if (!userInfo) {
			wx.redirectTo({
				url: '/pages/login/login'
			})
		}
		this.getDate();
		this.getRecommendSong();

		// 订阅来自songDetail页面发布的数据
		let that = this;
		communication(that);
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