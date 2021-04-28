# hiMusic
音乐小程序，类似于网易云音乐 



## 安装使用步骤

小程序代码

1. `git clone git@github.com:ChangYanwei/hiMusic.git` 
2. `npm install`

API代码，使用node开启本地服务

1. `git clone git@github.com:Binaryify/NeteaseCloudMusicApi.git`
2. `npm install`
3. `npm run start`
4. [API文档](https://neteasecloudmusicapi.vercel.app/#/)



## 实现的功能

- 音乐播放、切换、收藏
- 每日推荐
- 音乐类视频
- 搜索功能、搜索历史
- 登录（使用网易云音乐的登录接口，需要真实的账号密码）
- 播放记录
- 收藏列表



## 使用的第三方工具

- 使用的API
  - [网易云音乐API](https://neteasecloudmusicapi.vercel.app/#/)
  - 我搞到了自己的阿里云服务器上，可通过 http://8.131.68.141:9300/xxx 访问，如http://8.131.68.141:9300/banner 
  - 如果小程序要上线，需要使用https的服务
- [pubsub-js](https://github.com/mroderick/PubSubJS) 
  - **用于不同页面之间的通信**
  - 先订阅再发布
  - 在音乐播放器页面（songDetail），判断是点击上一首还是下一首时，需要将操作类型传递到每日推荐页面（recommendDetail），因为在这个页面才有全部的数据。找出上/下一首的音乐id后再回传到songDetail
- [momentjs](http://momentjs.cn/)
  - 用于日期时间的格式化
  - 在音乐播放器页面将音频总的播放时间（单位：ms）转成“mm:ss”（分钟：秒）的形式
- [iconfont](https://www.iconfont.cn/)



## 文件
### components文件夹
- 放置自定义组件
- NavHeader是头部标题组件

### pages文件夹
- 页面主要代码

### miniprogram_npm

如果小程序中使用npm安装了第三方包，需要进行构建。

**构建npm**：开发工具 ---> 工具 ---> 构建 npm：会将 node_modules 中的包打包到 miniprogram_npm 中，转换成小程序可以使用的包。小程序加载第三方包的时候会到 miniprogram_npm 文件夹下寻找，如果没有这个文件夹或文件夹中没有对应的包，小程序就会按照相对路径去加载对应的包，结果就是报错。

### static文件夹
- 静态资源文件，如图片、字体

### util文件夹
- 抽取出公共的工具函数
- request.js 用来发送网络请求
- config.js 用来对服务器的域名进行配置，进一步降低代码的耦合度
- loginRequest.js 专门用来处理登录请求的
- communication.js 用于不同页面之间的通信（使用了PubSub第三方库）：订阅音乐播放界面的上一首、下一首、随机播放所产生的事件，事件发生后取出对应的音乐id并回传给音乐播放界面

### songPackage文件夹

- 将每日推荐页面和音乐播放器页面抽离出来形成子包
- [使用分包的教程](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html)

### template文件夹

- 将音乐列表展示的界面抽离成模板文件



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
	- **刚进入页面时使用image代替视频展示，点击某个视频时再将图片替换为video**
	- 分享功能
	- 没有数据时展示一张图片
- 4.24 完成每日推荐页面
	- 每日推荐歌曲列表
	- 歌曲播放的静态页面搭建
- 4.25 完成音乐播放器
	- 使用背景音频，BackgroundAudioManager
	- 实现上一首、下一首、随机播放
	- 音乐播放进度条
	- 使用slider调整音乐当前播放时间
- 4.27 基本完成
  - 完成搜索页面的开发。对搜索框使用input事件，但是进行了防抖处理，用户输入内容后不会立马发送请求，而是等待300ms，如果300ms内没有继续输入，再发请求
  - 历史搜索记录（存储在本地）
  - 使用分包
  - 总体来看，页面上展示的功能没有全部实现
- 4.28 代码优化及解决bug
   - 新增收藏音乐的功能（存储在本地）
   - 抽离重复代码
   - 解决切换音乐时进度条混乱的bug



## 一些记录

- 个人中心页面下拉动画的实现
  - 为元素绑定touchstart、touchmove、touchend事件
  - 在touchstart事件中获取元素的初始clientY值
  - 在touchmove事件中动态获取当前的clientY值，和初始值相减，得出运动距离。再使用transform:translateY()来移动元素
  - 在touchend事件中，元素要回弹，使用transform:translateY(0)
- 页面的滚动主要使用scroll-view实现
- 登录后用户的个人信息（头像、昵称、id）及cookie存储在了本地
- 本小程序的开发学习[资料来源](https://www.bilibili.com/video/BV12K411A7A2)
