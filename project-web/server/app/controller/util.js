'use strict';
const BaseController = require('./base');
const SvgCaptcha = require('svg-captcha')
const fse = require('fs-extra')
const path = require('path');
const { has } = require('core-js/core/dict');
class UtilController extends BaseController {
  async captcha() {
    const { ctx } = this;
    let captcha = SvgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 4
    })
    ctx.session.captcha = captcha.text
    ctx.response.type = 'image/svg+xml'
    ctx.body = captcha.data
  }
  async sendcode() {
    const { ctx } = this
    const email = ctx.query.email
    const code = Math.random().toString().slice(2, 6)
    console.log('邮箱' + email + '验证码:' + code)
    ctx.session.emailcode = code

    const subject = '验证码'
    const text = ''
    const html = `<h2>测试验证码：</h2><span>${code}</span>`
    const hasSend = await this.service.tools.sendMail(email, subject, text, html)
    if (hasSend) {
      this.msg('发送成功')
    } else {
      this.error('发送失败')
    }
  }
  async uploadfile() {
    const { ctx } = this
    let file = ctx.request.files[0]
    let { name } = ctx.request.body
    await fse.move(file.filepath, this.config.UPLOAD_DIR + "/" + file.filename)
    this.success({ url: `/public/${file.filename}` })
  }
  async uploadfiles() {
    // 报错
    let s = Math.random()
    if(s>0.9){
      return this.ctx.status = 500
    }
    const { ctx } = this
    let file = ctx.request.files[0]
    let { name ,hash} = ctx.request.body
    let chunkspath = path.resolve(this.config.UPLOAD_DIR, hash)
    if (!fse.existsSync(chunkspath)) {
      await fse.mkdir(chunkspath)
    }
    await fse.move(file.filepath, `${chunkspath}/${name}`)
    this.msg('切片上传成功')
    // this.success({ url: `/public/${file.filename}` })
  }
  async mergechunks(){
    let {ext,size,hash} = this.ctx.request.body
    let filepath = path.resolve(this.config.UPLOAD_DIR,`${hash}.${ext}`)
    await this.ctx.service.tools.mergeFile(filepath,hash,size)
    // 上传完成删除hash目录
    this.success({
      url:`/public/${hash}.${ext}`
    })
    try{
      fse.remove(`${this.config.UPLOAD_DIR}/${hash}`)
    }catch(e){
      console.log('remove error:',e);
    }
  }
  async checkfile(){
    let {ctx} = this
    let {ext,hash}=ctx.request.body
    let filepath = path.resolve(this.config.UPLOAD_DIR,`${hash}.${ext}`)
    let uploaded=false 
    let uploadedList=[]
    if(fse.existsSync(filepath)){
      uploaded=true
    }else{
      uploadedList=await this.getUploadedList(path.resolve(this.config.UPLOAD_DIR,hash))
    }
    this.success({
      uploaded,
      uploadedList
    })
  }
  async getUploadedList(dirPath) {
    return fse.existsSync(dirPath)
      ? (await fse.readdir(dirPath)).filter(name => name[0] !== '.')
      : []
  }
}

module.exports = UtilController;
