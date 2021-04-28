import PubSub from 'pubsub-js';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		day: "",
		month: "",
		musicList: [],
		index:[]
	},

	// 获取当前日期
	getDate() {
		let date = new Date();
		this.setData({
			day: date.getDate(),
			month: date.getMonth() + 1
		})
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

		let collectionMuisc = wx.getStorageSync('like');
		this.setData({
			musicList: collectionMuisc
		});
		this.getDate();

		// 订阅来自songDetail页面发布的数据
		PubSub.subscribe('switchType', (msg, type) => {
			let {
				index,
				musicList
			} = this.data;

			if (type === 'pre') {
				// 如果当前是第一首，点击上一首，要转到最后一首
				index = index === 0 ? musicList.length - 1 : --index;
			} else if (type === 'next') {
				// 如果当前是最后一首，点击下一首，要转到第一首
				index = index === musicList.length - 1 ? 0 : ++index;
			} else if(type === 'random') {
				// 随机播放
				while(true) {
					let newIndex = Math.floor(Math.random() * musicList.length);
					if(newIndex !== index) {
						index = newIndex;
						break;
					}
				}
			} 

			this.setData({
				index
			})
			let id = musicList[index].id;
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