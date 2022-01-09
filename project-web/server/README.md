# 插件
- 验证码：``svg-captcha``
- 路由：``egg-router-group``
- 数据库：``egg-mongoose``
- 校验：``egg-validate``
- 文件：``fs-extra``
- jwt：``jsonwebtoken``
  - （1）JWT 默认是不加密，但也是可以加密的。生成原始 Token 以后，可以用密钥再加密 一次。 
  - （2）JWT 不加密的情况下，不能将秘密数据写入 JWT。 
  - （3）JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询 数据库的次数。 
  - （4）JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某 个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有 效，除非服务器部署额外的逻辑。 
  - （5）JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减 少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对 用户进行认证。 
  - （6）为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输。
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