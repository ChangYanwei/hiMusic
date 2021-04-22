import request from '../../util/request';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		navList: [],
		navId: 0,
		videoList: [],
		noData:false
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
				noData:res.datas.length === 0
			}, () => {
				wx.hideLoading()
			});

			if(res.datas.length === 0) {
				wx.showModal({
				  title:'温馨提示',
				  content:'暂无视频推荐，请稍后再试',
				  showCancel:false
				});
			}
		})
	},

	// 切换导航标签
	changeNav(event) {
		let navId = event.target.dataset.id;
		this.setData({
			navId,
			videoList:[]
		});
		this.getVideoList(navId);

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