import request from '../../../util/request';
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
		musicId: "",
		songUrl: "",
		currentTime: "00:00", //实时播放时间
		durationTime: "", // 总时长
		sliderMax: 0,
		nowTimeSecond: 0, // 当前播放时间的秒数
		isLike: false, // 当前音乐是否被收藏
		isSame: false, // 当前播放的背景音乐和页面展示的信息是否一致
	},

	// 获取音乐详情信息
	async getSongDetail(id) {
		let songInfo = await request('/song/detail', {
			ids: id
		});
		let song = songInfo.songs[0];
		let durationTime = moment(song.dt).format("mm:ss");
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
		// console.log('---',appInstance.globalData.musicId);
		// console.log('---',id);
		// console.log('---',appInstance.globalData.musicId === id);
	},

	// 点击中间播放或暂停按钮
	handleMusicPlay() {
		this.setData({
			isPlay: !this.data.isPlay,
			isSame: true // 点击播放时肯定需要展示进度条
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

		// 如果当前正在播放的和即将要播放的不是同一首，将当前的音乐进度设置为0
		if (appInstance.globalData.musicId !== musicId) {
			this.setData({
				nowTimeSecond: 0
			})
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

	// 切换歌曲，点击上一首，下一首，随机播放按钮触发的函数
	handleSwitch(event) {
		let type = event.currentTarget.id;

		// 如果用户的网速比较慢，那么当前音乐依然在播放，此时下一首音乐的资源还没有到来
		// 此时关闭当前音乐，体验会更好
		this.backgroundAudioManager.stop();

		// 订阅来自recommeSong或者search页面发回的musicId
		PubSub.subscribe('musicId', (msg, musicId) => {
			console.log('发回的musicId：', musicId);
			appInstance.globalData.musicId = musicId;
			console.log("globalData",appInstance.globalData);
			this.setData({
				nowTimeSecond: 0,
				musicId
			})
			// 获取音乐详情
			this.getSongDetail(musicId);
			// 音乐自动播放
			this.musicControl(true, musicId);
			PubSub.unsubscribe('musicId');

			// 判断音乐是否被收藏
			this.isLike(musicId);
		})

		// 发布消息（切换的类型）给recommeSong页面
		PubSub.publish('switchType', type);
	},

	// 使用slider调整音乐当前的播放时间
	changeCurrentTime(event) {
		let value = event.detail.value;
		this.backgroundAudioManager.seek(value);
		this.setData({
			nowTimeSecond: value
		})
	},

	// 点击收藏按钮收藏歌曲
	likeThis() {
		let id = this.data.musicId;
		let songDetail = this.data.songDetail;
		songDetail.id = id;
		console.log("like:", id);
		let collectionMusic = wx.getStorageSync('like') || [];

		this.setData({
			isLike: !this.data.isLike
		});
		if (this.data.isLike) {
			collectionMusic.push(songDetail);
			wx.showToast({
				title: '收藏成功',
				icon: "none"
			})
		} else {
			let index = collectionMusic.findIndex(item => {
				return item.id === id;
			});
			collectionMusic.splice(index, 1);
			wx.showToast({
				title: '取消收藏',
				icon: "none"
			})
		}

		wx.setStorageSync('like', collectionMusic);
	},

	// 判断当前音乐是否被收藏
	isLike(id) {
		let collectionMusic = wx.getStorageSync('like');
		let index = collectionMusic.findIndex(item => item.id == id);
		let isLike = index === -1 ? false : true;
		this.setData({
			isLike
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 原生小程序对路由传参的参数长度有限制，超过限制的内容会被截掉
		let id = parseInt(JSON.parse(options.id));
		this.getSongDetail(id);

		console.log("onload()",appInstance.globalData, id,typeof id);
		if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId == id) {
			this.setData({
				isPlay: true,
				// 判断当前正在播放的和页面上展示的是不是同一首
				isSame: appInstance.globalData.musicId === id
			})
		}

		// 判断当前音乐是否被收藏
		this.isLike(id);

		// 监视音乐的播放和暂停
		this.backgroundAudioManager = wx.getBackgroundAudioManager();
		this.backgroundAudioManager.onPlay(() => {
			this.changePlayState(true);
			console.log("play()", this.data.musicId);
			appInstance.globalData.musicId = this.data.musicId;
		});
		this.backgroundAudioManager.onPause(() => {
			this.changePlayState(false);
		});
		this.backgroundAudioManager.onStop(() => {
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
			console.log('音乐播放结束');
			this.setData({
				sliderValue: 0,
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