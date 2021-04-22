// 封装网络请求的功能函数

// 导入配置服务器域名的文件，降低耦合度，因为服务器域名可能会变
import config from './config.js';

export default function (url, data = {}, method='GET',header={}) {
	return new Promise((resolve, reject) => {
		wx.request({
			url: config.host + url,
			data,
			method,
			header,
			success(res) {		
				resolve(res.data)
			},
			fail() {
				reject("出错啦！请重试")
			}
		})
	})
}