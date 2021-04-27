// pages/index/index.js

import request from '../../util/request.js';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		banner: [],
		recommend: [],
		rankingData:[]
	},

	// 跳转到每日推荐
	toRecommend(){
		wx.navigateTo({
		  url: '/songPackage/pages/recommendSong/recommendSong'
		})
	},

	// 获取热歌榜
	async getRankingData() {
			let rankingData = []
			let promises = [];
			for(let i = 0;i < 5;i++) {
				promises.push(request('/top/list',{idx:i}));
			}
			Promise.all(promises).then(data => {	
				for(let i = 0;i < data.length;i++) {
					let obj = {};
					let playlist = data[i].playlist;
					
					obj.name = playlist.name;
					obj.id = playlist.id;
					obj.list = playlist.tracks.slice(0,5);
					rankingData.push(obj);

					// 用户体验较好，每次得到一个请求的数据就渲染一次页面
					this.setData({
						rankingData
					})
				}
			})
			
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 轮播图数据
		request('/banner').then(res => {
			this.setData({
				banner: res.banners
			})
		});

		// 推荐歌曲
		request('/personalized',{limit:10}).then(res => {
			this.setData({
				recommend: res.result
			})
		});

		// 排行榜
		this.getRankingData();
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