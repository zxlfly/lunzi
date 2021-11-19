'use strict';
const BaseController = require('./base')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const createRule = {
    email: { type: 'email' },
    nickname: { type: 'string' },
    passwd: { type: 'string' },
    captcha: { type: 'string' },
}
const HashSalt = 'zxlfly!@666'
class HomeController extends BaseController {
    async login() {
        let {ctx,app}=this
        let {email,captcha,passwd}=ctx.request.body
        // 验证码
        if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
            return this.error('验证码错误')
        }
        let user = await ctx.model.User.findOne({
            email,
            passwd:md5(passwd+HashSalt)
        })
        if(!user){
            return this.error('用户名或密码错误')
        }
        // 生成token
        let token = jwt.sign({
            _id:user._id,
            email
        },app.config.jwt.secret,{
            expiresIn:"24h"
        })
        this.success({token,email,nickname:user.nickname,avatar:user.avatar})
    }
    async register() {
        const { ctx } = this
        try{
            ctx.validate(createRule)
        }catch(e){
            return this.error('参数不合法', -1, e.errors)
        }
        const { email, passwd, captcha, nickname } = ctx.request.body
        // 验证码
        if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
            return this.error('验证码错误')
        }
        // 邮箱
        if(await this.checkEmail(email)){
            this.error('邮箱已存在')
        }else{
            let ret = await ctx.model.User.create({
                email,
                nickname,
                passwd:md5(passwd+HashSalt)
            })
            console.log(ret);
            if(ret._id){
                this.success('注册成功！')
            }
        }
    }
    async checkEmail(email) {
        let res = await this.ctx.model.User.findOne({email})
        return res
    }
    async verify() {
        
    }
    async info() {
        const { ctx } = this
        const { email } = ctx.state
        const user = await this.checkEmail(email)
        this.success(user)
    }
}

module.exports = HomeController;
