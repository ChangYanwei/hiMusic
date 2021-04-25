import request from '../../util/request';
let appInstance = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isPlay: false,
		songDetail:{}
	},

	async getSongDetail(id){
		let songInfo = await request('/song/detail',{ids:id});
		let songUrl = await request('/song/url',{id});
		let song = songInfo.songs[0];
		let songDetail = {
			name:song.name,
			picUrl:song.al.picUrl,
			url:songUrl.data[0].url,
			author:song.ar[0].name
		};
		wx.setNavigationBarTitle({
			title:song.name
		})
		console.log(songDetail);
		this.setData({
			songDetail
		})
	},

	// 控制音乐播放、暂停的功能函数
	musicControl(){
		this.setData({
			isPlay: !this.data.isPlay
		});
		let isPlay = this.data.isPlay;
		let backgroundAudioManager = this.backgroundAudioManager;
		if(isPlay) {
			backgroundAudioManager.src = this.data.songDetail.url;
			backgroundAudioManager.title = this.data.songDetail.name;
		} else {
			backgroundAudioManager.pause()
		}
	},

	// 修改播放状态的函数
	changePlayState(isPlay){
		this.setData({
			isPlay
		});
		appInstance.globalData.isMusicPlay = isPlay;
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 原生小程序对路由传参的参数长度有限制，超过限制的内容会被截掉
		let id = JSON.parse(options.id);
		this.getSongDetail(id);
		let musicId = id;

		if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === id) {
			this.setData({
				isPlay:true
			})
		}

		// 监视音乐的播放和暂停
		this.backgroundAudioManager = wx.getBackgroundAudioManager();
		this.backgroundAudioManager.onPlay(() => {
			console.log('play');
			this.changePlayState(true);

			appInstance.globalData.musicId = musicId;
		});
		this.backgroundAudioManager.onPause(() => {
			console.log('pause');
			this.changePlayState(false);
		});
		this.backgroundAudioManager.onStop(() => {
			console.log('stop');
			this.changePlayState(false);
		});
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