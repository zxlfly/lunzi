# 从输入URL到页面显示发生了什么
从空间的方向来说，经历了客户端-网络-服务器；从时间上输入url-走完网络数据回来-浏览器解析-排版-渲染和绘制。
1. 首先浏览器会判断输入的是合法的url还是一个待搜索的关键词
2. 根据地址栏输入的地址向DNS（Domain Name System）查询IP
   1. 域名系统（英文：Domain Name System，缩写：DNS）是互联网的一项服务。它作为将域名和IP地址相互映射的一个分布式数据库，能够使人更方便地访问互联网。
   2. 域名解析的过程是逐级查询的
      1. 浏览器缓存
      2. 本地hosts
      3. 本地DNS服务器缓存（例如某些路由器有DNS缓存的功能）
      4. 互联网服务提供商（如中国电信）提供的DNS服务
      5. 顶级DNS服务器/根DNS服务器/权威域名服务器
3. 通过IP向服务器发起TCP连接
   1. 拿到了要请求的资源服务器IP后，浏览器通过操作OS的socket与服务器进行TCP连接
   2. 这个连接就是我们所熟知的三次握手
4. 向服务器发起请求
5. 服务器返回请求内容
6. 浏览器开始解析渲染页面并显示
7. 关闭连接
   1. 四次挥手

## 三次握手 四次挥手
根据server2运行时控制台答应输出的内容  
```
address 127.0.0.1
port 9185
address 127.0.0.1
port 7570
GET / HTTP/1.1
Host: 127.0.0.1:3000
Connection: keep-alive
Cache-Control: max-age=0
sec-ch-ua: "Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8


GET /favicon.ico HTTP/1.1
Host: 127.0.0.1:3000
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
sec-ch-ua: "Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"
sec-ch-ua-mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36
Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: no-cors
Sec-Fetch-Dest: image
Referer: http://127.0.0.1:3000/
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
```
实际应答有三次请求第二次开始才带请求信息。这就是我们常说的**三次握手**导致的。
- 三次握手(连接匹配建立过程)
  - 客户端发送确认的同步请求
    - 携带序列号代表客户端
  - 服务端接受到之后回复ack内容为接收到到的序列号+1
    - 并且返回代表服务器的序列号
  - 客户端受到服务端返回信息
    - 发送ack为服务端的序列号+1
    - 再加上自己本身的请求内容
**三次握手可以有效的防止已失效的连接请求报文突然又传送到了服务端而产生错误，例如在某个网络节点长时间滞留导致连接释放后才达到server，此时服务器是不知道客户端状态的，就算返回信息客户端也会忽略，白白浪费服务器资源**  
  
请求完成之后断开连接的过程通常被称为**四次挥手**  
- 四次挥手(连接断开过程)
  - 客户端发送关闭请求
    - 携带序列号代表客户端
  - 服务端接受到之后回复ack内容为接收到的客户端序列号+1
    - 返回代表服务器的序列号
    - 并且此时不会立刻断开连接
    - 因为此时是不确定数据传输是否完成的，需要等待
  - 服务端数据传输完成再次回复客户端
    - 发送ack为接收到的客户端序列号+1
    - 并且告诉客户端传输完成
  - 客户端收到第二条信息后发送信息给服务器
    - ack为接收到的服务器序列号+1
    - 此时客户端不会立刻关闭连接还会等待一段时间
      - 因为此处发送不一定成功
      - 最后客户端也close
  - 服务器收到后close

# [HTTP 与 HTTPS 区别](https://www.runoob.com/w3cnote/http-vs-https.html)
HTTPS 经由 HTTP 进行通信，但利用 SSL/TLS 来加密数据包。HTTPS 开发的主要目的，是提供对网站服务器的身份认证，保护交换数据的隐私与完整性。

# HTTP1.0、HTTP1.1 和 HTTP2.0 的区别
- 从HTTP/1.0到HTTP/2，都是利用TCP作为底层协议进行通信的。
- HTTP/1.1，引进了长连接(keep-alive)，减少了建立和关闭连接的消耗和延迟。
- HTTP/2，引入了多路复用：连接共享，提高了连接的利用率，降低延迟。

# HTTP2.0和HTTP1.X相比的新特性
- 新的二进制格式（Binary Format），HTTP1.x的解析是基于文本。基于文本协议的格式解析存在天然缺陷，文本的表现形式有多样性，要做到健壮性考虑的场景必然很多，二进制则不同，只认0和1的组合。基于这种考虑HTTP2.0的协议解析决定采用二进制格式，实现方便且健壮。
- 多路复用（MultiPlexing），即连接共享，即每一个request都是是用作连接共享机制的。一个request对应一个id，这样一个连接上可以有多个request，每个连接的request可以随机的混杂在一起，接收方可以根据request的 id将request再归属到各自不同的服务端请求里面。
- header压缩，如上文中所言，对前面提到过HTTP1.x的header带有大量信息，而且每次都要重复发送，HTTP2.0使用encoder来减少需要传输的header大小，通讯双方各自cache一份header fields表，既避免了重复header的传输，又减小了需要传输的大小。
- 服务端推送（server push），同SPDY一样，HTTP2.0也具有server push功能。