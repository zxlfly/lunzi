# 总结
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
实际答应有三次请求第二次开始才带请求信息。这就是我们常说的**三次握手**导致的。
- 三次握手(连接匹配建立过程)
  - 客户端发送确认的同步请求
    - 携带序列号代表客户端
  - 服务端接受到之后回复ack内容为接收到到的序列号+1
    - 并且返回代表服务器的序列号
  - 客户端受到服务端返回信息
    - 发送ack为服务端的序列号+1
    - 再加上自己本身的请求内容
**三次握手可以有效的防止已失效的连接请求报文突然又传送到了服务端而产生错误，例如在摸个网络节点长时间滞留导致连接释放后才达到server，此时服务器是不知道客户端状态的，就算返回信息客户端也会忽略，白白浪费服务器资源**  
  
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

