import PubSub from "pubsub-js";
export default function (that) {

	// 订阅来自songDetail页面发布的数据
	PubSub.subscribe('switchType', (msg, type) => {
		let {
			index,
			musicList
		} = that.data;
		if (type === 'pre') {
			// 如果当前是第一首，点击上一首，要转到最后一首
			index = index === 0 ? musicList.length - 1 : --index;
		} else if (type === 'next') {
			// 如果当前是最后一首，点击下一首，要转到第一首
			index = index === musicList.length - 1 ? 0 : ++index;
		} else if (type === 'random') {
			// 随机播放
			while (true) {
				let newIndex = Math.floor(Math.random() * musicList.length);
				if (newIndex !== index) {
					index = newIndex;
					break;
				}
			}
		}

		that.setData({
			index
		})
		console.log(musicList);
		let id = musicList[index].id || musicList[index].song.id;
		// 将音乐的id发送给songDetail页面
		PubSub.publish('musicId', id);
	})

}