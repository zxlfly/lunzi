import {createServer} from "http"
// 创建一个http.server
const server= createServer((req,res)=>{
    // 设置状态码
        res.statusCode = 200
    // 这是响应头
        res.setHeader('Content-Type','text/html')
    // 返回内容
    res.end('<h2>hello world!</h2>')
})
server.listen(3000,()=>{
    console.log('启动成功3000');
})