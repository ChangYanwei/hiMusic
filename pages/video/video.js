import request from '../../util/request';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		navList: [],
		navId: 0,
		videoList: [],
		noData: false,
		videoId: "",
		videoUpdateList: [],
		refreshTrigger: false,
		timer:null
	},

	// 获取导航标签列表
	getNavList() {
		request('/video/group/list').then(res => {
			console.log('标签列表：', res);
			this.setData({
				navList: res.data.slice(0, 10),
				navId: res.data[0].id
			}, function () {
				this.getVideoList(res.data[0].id);
			})
		})
	},

	// 获取视频列表
	getVideoList(id) {
		wx.showLoading({
			title: '努力加载中'
		});

		// 获取视频列表需要携带cookie信息
		request('/video/group', {
			id
		}, 'GET', {
			cookie: wx.getStorageSync('cookie') ? wx.getStorageSync('cookie').join('') : ""
		}).then(res => {
			console.log('视频数据：', res);
			let index = 0;
			this.setData({
				videoList: res.datas.map(item => {
					item.id = index++;
					return item;
				}),
				noData: res.datas.length === 0,
				refreshTrigger: false // 关闭下拉刷新
			}, () => {
				wx.hideLoading();
			});

			if (res.datas.length === 0) {
				wx.showModal({
					title: '温馨提示',
					content: '暂无视频推荐，请稍后再试',
					showCancel: false
				});
			}
		})
	},

	// 切换导航标签
	changeNav(event) {
		let navId = event.target.dataset.id;
		this.setData({
			navId,
			videoList: []
		});
		this.getVideoList(navId);

	},

	/**
	 * 点击播放、继续播放触发的回调
	 * 
	 * 需求
	 * 1.在点击播放的事件中需要找到上一个播放的视频
	 * 2.在播放新的视频之前关闭上一个正在播放的视频
	 * */
	handlePlay(event) {
		let vid = event.target.id;
		this.setData({
			videoId: vid
		});

		// 判断点击播放的视频和正在播放的视频是不是同一个，如果是同一个则什么都不做
		// if(this.vid === vid) return;
		// 不是同一个视频，就停掉正在播放的视频
		// if (this.videoContext && this.vid !== vid) {
		// 	this.videoContext.stop();
		// }
		// this.vid = vid;
		this.videoContext = wx.createVideoContext(vid);

		let videoUpdateList = this.data.videoUpdateList;
		let currentVideo = videoUpdateList.find(item => item.vid === vid);
		if (currentVideo) {
			this.videoContext.seek(currentVideo.currentTime);
		}
		// this.videoContext.play();

	},

	// 视频播放结束，将视频对应的对象删除
	handleVideoEnd(event) {
		let vid = event.target.id;
		let videoUpdateList = this.data.videoUpdateList;
		let index = videoUpdateList.findIndex(item => item.vid === vid);
		videoUpdateList.splice(index, 1);
		this.setData({
			videoUpdateList
		})
	},

	// 获取视频当前播放的时间
	updateTime(event) {
		let videoUpdateList = this.data.videoUpdateList;
		let vid = event.target.id;
		let currentTime = event.detail.currentTime;
		let videoItem = {
			vid,
			currentTime
		};
		// 如果满足条件会返回数组中的一个元素，一个对象，该对象和数组中的那个对象指向同一个内存地址
		let video = videoUpdateList.find(item => item.vid === vid);
		if (video) {
			video.currentTime = currentTime;
		} else {
			videoUpdateList.push(videoItem);
		}

		this.setData({
			videoUpdateList
		})

	},

	// 下拉刷新
	handleRefresh(event) {
		// 防抖处理
		if(this.data.timer) clearTimeout(this.data.timer);
		this.data.timer = setTimeout(() => {
			this.getVideoList(this.data.navId);
		},1000);
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getNavList();
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