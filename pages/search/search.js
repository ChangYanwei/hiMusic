import request from '../../util/request';
import PubSub from 'pubsub-js';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		defaultSearchKey: "",
		hotList: [],
		searchValue: "", // 用户输入的搜索内容
		searchResultList: [], // 搜索到的数据
		timer: null,
		historyList: [], // 搜索历史
		index: 0, // 点击某个搜索历史或排行榜的下标
	},

	// 获取默认搜索关键字
	getSearchDefault() {
		request('/search/default').then(res => {
			this.setData({
				defaultSearchKey: res.data.showKeyword
			})
		})
	},

	// 获取热搜榜数据
	getHotlist() {
		request("/search/hot/detail").then(res => {
			this.setData({
				hotList: res.data.map((item, index) => {
					item.id = index;
					return item;
				})
			})
		})
	},

	// 获取搜索结果并存储搜索记录
	getSearchResult(searchValue) {
		// 存储搜索结果
		let historyList = wx.getStorageSync('searchHistory') || [];
		historyList.unshift(searchValue)
		historyList = [...new Set(historyList)];
		wx.setStorageSync('searchHistory', historyList);

		request("/search", {
			keywords: searchValue,
			limit: 10
		}).then(res => {
			let songs = res.result ? res.result.songs : [];
			this.setData({
				searchResultList: songs,
				historyList
			})
		});
	},

	// 输入框input事件，这个函数返回的值将替换输入框的内容，默认会将event.detail.value返回
	handleSearchInput(event) {
		let searchValue = event.detail.value;
		this.setData({
			searchValue
		});


		// 防抖处理
		if (this.data.timer) {
			clearTimeout(this.data.timer);
		}
		this.data.timer = setTimeout(() => {
			// 当输入框为空的时候，就没有必要发送请求了
			if (searchValue) {
				this.getSearchResult(searchValue);
			} else {
				this.setData({
					searchResultList: []
				})
			}
		}, 300)

	},

	// 清空搜索框中的数据
	clearSearchContent() {
		this.setData({
			searchValue: "",
			searchResultList: []
		})
	},

	// 清空历史记录
	clearHistory() {
		wx.showModal({
			content: "是否要清除历史记录？",
			success: res => {
				console.log(res);
				if (res.confirm) {
					wx.removeStorageSync('searchHistory')
					this.setData({
						historyList: []
					})
				}
			}
		})
	},

	// 跳转到视频页
	toVideo() {
		wx.navigateBack();
	},

	// 点击搜索结果中的某一项，跳转到音乐播放界面
	toSongDetail(event) {
		let id = event.currentTarget.id;
		wx.navigateTo({
			url: '/songPackage/pages/songDetail/songDetail?id=' + id
		})
	},

	// 点击搜索历史或者热搜榜的某一项，自动进行搜索
	handleSearch(event) {
		let {
			searchValue,
			index
		} = event.currentTarget.dataset;
		this.getSearchResult(searchValue);
		this.setData({
			searchValue,
			index,
		})
	},

	/*
		因为可以从搜索界面跳转到音乐播放界面，所以需要订阅来自songDetail页面发布的状态（上/下一首） 
	 */
	nextAudio() {
		PubSub.subscribe('switchType', (msg, type) => {
			let {
				searchResultList,
				index
			} = this.data;

			if (type === 'pre') {
				// 如果当前是第一首，点击上一首，要转到最后一首
				index = index === 0 ? searchResultList.length - 1 : --index;
			} else if (type === 'next') {
				// 如果当前是最后一首，点击下一首，要转到第一首
				index = index === searchResultList.length - 1 ? 0 : ++index;
			} else if (type === 'random') {
				// 随机播放
				while (true) {
					let newIndex = Math.floor(Math.random() * searchResultList.length);
					if (newIndex !== index) {
						index = newIndex;
						break;
					}
				}
			}

			this.setData({
				index
			})
			let id = searchResultList[index].id;
			// 将音乐的id发送给songDetail页面
			PubSub.publish('musicId', id);
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getSearchDefault();
		this.getHotlist();

		let historyList = wx.getStorageSync('searchHistory') || [];
		this.setData({
			historyList
		});

		this.nextAudio();
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