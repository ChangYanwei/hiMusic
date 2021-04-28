# hiMusic
音乐小程序，类似于网易云音乐

## 文件
### components文件夹
- 放置自定义组件
- NavHeader是头部标题组件

### pages文件夹
- 页面主要代码

### static文件夹
- 静态资源文件，如图片、字体

### util文件夹
- 抽取出公共的工具函数

- request.js 用来发送网络请求
- config.js 用来对服务器的域名进行配置，进一步降低代码的耦合度

## 开发进度
- 2021.4.19 - 4.20 主页
	- 推荐歌曲
	- 排行榜
- 4.21 个人中心页
	- 登录功能
	- 最近播放记录
- 4.22 - 4.23 完成视频页的大部分功能（搜索功能还没有做）
	- 顶部视频分类导航
	- 下拉刷新
	- 刚进入页面时使用image代替视频展示，点击某个视频时再将图片替换为video
	- 分享功能
	- 没有数据时展示一张图片
- 4.24 完成每日推荐页面
	- 每日推荐歌曲列表
	- 歌曲播放的静态页面搭建
- 4.25 完成音乐播放器
	- 使用背景音频，BackgroundAudioManager
	- 实现上一首、下一首、随机播放
	- 进度条
	- 使用slider调整音乐当前播放时间
- 4.27 基本完成
  - 完成搜索页面的开发
  - 总体来看，页面上展示的功能没有全部实现

## 使用的第三方库

- 使用的API
  - [网易云音乐API](https://neteasecloudmusicapi.vercel.app/#/)
  - 

- [pubsub-js](https://github.com/mroderick/PubSubJS) 
	- **用于不同页面之间的通信**
	- 先订阅再发布
	- 在音乐播放器页面（songDetail），判断是点击上一首还是下一首时，需要将操作类型传递到每日推荐页面（recommendDetail），因为在这个页面才有全部的数据。找出上/下一首的音乐id后再回传到songDetail
- [momentjs](http://momentjs.cn/)
	- 用于日期时间的格式化
	- 在音乐播放器页面将音频总的播放时间（单位：ms）转成“mm:ss”（分钟：秒）的形式

## 一些小问题

- 个人中心页面下拉动画的实现
  - 为元素绑定touchstart、touchmove、touchend事件
  - 在touchstart事件中获取元素的初始clientY值
  - 在touchmove事件中动态获取当前的clientY值，和初始值相减，得出运动距离。再使用transform:translateY()来移动元素
  - 在touchend事件中，元素要回弹，使用transform:translateY(0)


