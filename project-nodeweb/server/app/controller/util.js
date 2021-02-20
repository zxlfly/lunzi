const svgCaptcha = require('svg-captcha')
const fse = require('fs-extra')
const path = require('path')
const BaseController = require('./base')

class UtilController extends BaseController {
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 3,
    })
    console.log('captcha=>', captcha.text)
    this.ctx.session.captcha = captcha.text
    this.ctx.response.type = 'image/svg+xml'
    this.ctx.body = captcha.data
  }
  async mergefile() {
    const { ext, size, hash } = this.ctx.request.body
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)
    await this.ctx.service.tools.mergeFile(filePath, hash, size)
    this.success({
      url: `/public/${hash}.${ext}`,
    })
  }
  async checkfile() {
    const { ctx } = this
    const { ext, hash } = ctx.request.body
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)

    let uploaded = false
    let uploadedList = []
    if (fse.existsSync(filePath)) {
      // 文件存在
      uploaded = true
    } else {
      uploadedList = await this.getUploadedList(path.resolve(this.config.UPLOAD_DIR, hash))
    }
    this.success({
      uploaded,
      uploadedList,
    })
  }
  // .DS_Strore
  async getUploadedList(dirPath) {
    return fse.existsSync(dirPath)
      ? (await fse.readdir(dirPath)).filter(name => name[0] !== '.')
      : []
  }
  async uploadfile() {
    // /public/hash/(hash+index)
    // 报错
    // if(Math.random()>0.3){
    //   return this.ctx.status = 500
    // }
    const { ctx } = this
    console.log(ctx.request)
    const file = ctx.request.files[0]
    const { hash, name } = ctx.request.body

    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash)
    // const filePath = path.resolve() // 文件最终存储的位置。合并之后

    // console.log(name,file)

    // console.log(file.filepath)
    // console.log(this.config.UPLOAD_DIR)
    if (!fse.existsSync(chunkPath)) {
      await fse.mkdir(chunkPath)
    }

    await fse.move(file.filepath, `${chunkPath}/${name}`)

    this.message('切片上传成功')
    // this.success({
    //   url:'xx'
    // })
  }
  async sendcode() {
    const { ctx } = this
    const email = ctx.query.email
    const code = Math.random().toString().slice(2, 6)
    console.log('邮箱' + email + '验证码:' + code)
    ctx.session.emailcode = code

    const subject = '验证码'
    const text = ''
    const html = `<h2>小开社区</h2><a href="https://kaikeba.com"><span>${code}</span></a>`
    const hasSend = await this.service.tools.sendMail(email, subject, text, html)
    if (hasSend) {
      this.message('发送成功')
    } else {
      this.error('发送失败')
    }
  }

}
module.exports = UtilController
