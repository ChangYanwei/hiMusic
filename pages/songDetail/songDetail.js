import request from '../../util/request';
import PubSub from 'pubsub-js';
import moment from 'moment';

let appInstance = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isPlay: false,
		songDetail: {},
		songUrl: "",
		currentTime: "00:00", //实时播放时间
		durationTime: "", // 总时长
		currentWidth: 0,
		sliderMax: 0,
		nowTimeSecond: 0, // 当前播放时间的秒数

	},

	async getSongDetail(id) {
		let songInfo = await request('/song/detail', {
			ids: id
		});
		let song = songInfo.songs[0];
		// let dt = son
		let durationTime = moment(song.dt).format("mm:ss");
		console.log(durationTime);
		let songDetail = {
			name: song.name,
			picUrl: song.al.picUrl,
			author: song.ar[0].name
		};
		wx.setNavigationBarTitle({
			title: song.name
		})
		this.setData({
			songDetail,
			musicId: id,
			durationTime,
			sliderMax: song.dt / 1000
		})
		console.log(songDetail);
	},

	handleMusicPlay() {
		this.setData({
			isPlay: !this.data.isPlay
		});
		let {
			musicId,
			songUrl
		} = this.data;
		this.musicControl(this.data.isPlay, musicId, songUrl);
	},

	// 控制音乐播放、暂停的功能函数
	async musicControl(isPlay, musicId, songUrl) {
		// 当对同一首音乐多次点击播放和暂停的时候，只发送一个请求
		// 音乐链接存在this.data中，进行性能优化
		if (!songUrl) {
			let songUrl = await request('/song/url', {
				id: musicId
			});
			this.setData({
				songUrl: songUrl.data[0].url
			});
		}

		let backgroundAudioManager = this.backgroundAudioManager;
		if (isPlay) {
			backgroundAudioManager.src = this.data.songUrl;
			backgroundAudioManager.title = this.data.songDetail.name;
			backgroundAudioManager.seek(this.data.nowTimeSecond);
		} else {
			backgroundAudioManager.pause()
		}
	},

	// 修改播放状态的函数
	changePlayState(isPlay) {
		this.setData({
			isPlay
		});
		appInstance.globalData.isMusicPlay = isPlay;
	},

	// 切换歌曲
	handleSwitch(event) {
		let type = event.currentTarget.id;

		// 如果用户的网速比较慢，那么当前音乐依然在播放，此时下一首音乐的资源还没有到来
		// 此时关闭当前音乐，体验会更好
		this.backgroundAudioManager.pause();

		// 订阅来自recommeSong页面发回的musicId
		PubSub.subscribe('musicId', (msg, musicId) => {
			console.log('musicId：', musicId);
			// 获取音乐详情
			this.getSongDetail(musicId);
			// 音乐自动播放
			this.musicControl(true, musicId);
			PubSub.unsubscribe('musicId');

		})

		// 发布消息（切换的类型）给recommeSong页面
		PubSub.publish('switchType', type);

	},

	// 调整音乐当前的播放时间
	changeCurrentTime(event) {
		let value = event.detail.value;
		console.log(value);
		this.backgroundAudioManager.seek(value);
		this.setData({
			nowTimeSecond: value
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 原生小程序对路由传参的参数长度有限制，超过限制的内容会被截掉
		let id = JSON.parse(options.id);
		this.getSongDetail(id);
		let musicId = id;

		if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === id) {
			this.setData({
				isPlay: true
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

		// 监听音乐的实时播放进度
		this.backgroundAudioManager.onTimeUpdate(() => {
			let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format("mm:ss");

			this.setData({
				currentTime,
				nowTimeSecond: this.backgroundAudioManager.currentTime
			})
		});

		// 监听音乐自然播放结束
		this.backgroundAudioManager.onEnded(() => {
			// 订阅来自recommeSong页面发回的musicId
			PubSub.subscribe('musicId', (msg, musicId) => {
				console.log('musicId：', musicId);
				// 获取音乐详情
				this.getSongDetail(musicId);
				// 音乐自动播放
				this.musicControl(true, musicId);
				PubSub.unsubscribe('musicId');

			})
			PubSub.publish('switchType', 'next');
			console.log('音乐播放结束：');
			this.setData({
				sliderValue:0,
				currentTime: "00:00"
			})
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