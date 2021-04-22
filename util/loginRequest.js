import config from './config';

export default function(url,data = {}) {
	return new Promise((resolve,reject) => {
		wx.request({
		  url:config.host + url,
		  data,
		  success(res) {
			wx.setStorageSync('cookie', res.cookies);
			resolve(res.data);
		  },
		  fail() {
			  reject("出错啦！请重试")
		  }
		})
	})
}