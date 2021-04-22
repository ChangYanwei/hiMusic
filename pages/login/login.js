import loginRequest from "../../util/loginRequest";

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		phone: "",
		password: ""
	},

	handleInput(event) {
		let type = event.target.id;
		let value = event.detail.value;
		this.setData({
			[type]: value
		});
	},

	login() {

		// 前端验证
		let {
			phone,
			password
		} = this.data;
		if (!phone) {
			wx.showToast({
				title: '手机号不能为空',
				icon: "none"
			});
			return;
		}

		let regx = /^1\d{10}$/;
		if (!regx.test(phone)) {
			wx.showToast({
				title: "手机号格式错误",
				icon: "none"
			});
			return;
		}

		if (password.length < 6) {
			wx.showToast({
				title: '密码长度不能少于6位',
				icon: "none"
			});
			return;
		}

		// 后端验证
		loginRequest('/login/cellphone', {
			phone,
			password
		}).then(res => {
			if (res.code === 200) {
				wx.showToast({
					title: '登录成功'
				});

				let userData = {
					nickname: res.profile.nickname,
					avatarUrl: res.profile.avatarUrl,
					uid: res.profile.userId
				};

				wx.setStorageSync('userinfo', JSON.stringify(userData));

				wx.reLaunch({
					url: "/pages/personal/personal"
				})
			} else {
				wx.reLaunch({
					title: '账号或密码错误',
					icon: "fail"
				})
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

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