# 轮子

# project-web
### web（使用的nuxt2）
### server(egg.js)
### 规范使用的huskt、commitizen、validate-commit-msg
- 文件上传
  - 切片上传
  - 断点续传
  - 并发控制
  - 错误重试
- 限制图片格式
- 登录
  - jwt
  - 发送邮件
    - 实现在server

# 防抖函数
原理：在事件被触发n秒再执行回调，如果这个n秒内再次触发，就重新计时。  
可以使用定时器执行函数，新调用发生时如果存在没有执行的就清除之前的定时器

# 节流函数
原理：单位时间内只能触发一次函数  

# 深克隆
平时比较常用的就是利用JSON的api来实现``const newObj = JSON.parse(JSON.stringify(oldObj))``  
但是这个方法有局限性,严格来说不算
- 无法实现对函数、RegExp等特殊对象的克隆
- 会抛弃对象的constructor，所有构造函数都会指向Object
- 对象有循环引用，要考虑爆栈等问题
- 还要处理__proto__问题
一般业务不太会需要这种功能！！！如果需要可以使用immutable这种第三方的库。

# 实现Promise
简化版

# 实现Event(event bus)
通过对象实例管理收集依赖

# 实现instanceOf


# 实现call
就是将函数挂载对象上面执行，然后删除挂载属性  
接受的参数是散的

# 实现apply
和call的区别就是接受的参数是数组

# 实现bind
bind 除了返回是函数以外，它 的参数和 call 一样  
还有一点就是函数构造调用的时候(使用new关键字)，提供的this会被忽略，但是参数不会被忽略

# 实现new

# 一次完整的http请求都经历了什么http-request

# 关于tree组件+虚拟滚动
## 基本渲染逻辑  
- 没有子节点，直接渲染当前节点，无图标，根据当前层级显示相应数量的占位元素Indent
- 有子节点，open不为true，则直接渲染当前节点，图标为close
- 有子节点，open为true，则渲染当前节点和第一层子节点，图标为open
- 以此类推
## 数据处理
将树拍平成一维数组,渲染的时候也不再需要递归了  
## 使用虚拟滚动
虚拟滚动列表(更详细的参考[vue2_share](https://github.com/zxlfly/vue2_share))
