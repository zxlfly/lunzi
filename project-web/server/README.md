# 插件
- 验证码：``svg-captcha``
- 路由：``egg-router-group``
- 数据库：``egg-mongoose``
- 校验：``egg-validate``
- 文件：``fs-extra``
- jwt：``jsonwebtoken``
- md5：``md5``
- 发邮件：``nodemailer``

## 返回参数格式
```
{
    //1是成功 其他都是失败
    // -1是错误
    // -666 登录状态过期
    code:200,
    data:{},
    msg:""
}
```

### 遇到的报错
服务端没有改动的情况下出现的，目前定位是合并切片之后，删除hash文件夹log的，暂不知怎么解决，实际不影响程序运行！
```
EPERMError: EPERM: operation not permitted, watch
    at FSEvent.FSWatcher._handle.onchange (node:internal/fs/watchers:204:21)
errno: -4048
syscall: "watch"
code: "EPERM"
filename: null
dir: "E:\\学习\\lunzi\\project-web\\server\\app\\public\\7dc83f071dfce745b47a390c5d3edfbb"  
name: "EPERMError"
pid: 14896
hostname: DESKTOP-8NDFEA9
```