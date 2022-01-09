'use strict';
const { Service } = require('egg');
const path = require('path');
const fse = require('fs-extra');
const nodemailer = require('nodemailer');
const { WriteStream } = require('fs');
const { resolve } = require('path');


const userEmail = 'xxxx@qq.com';
const transporter = nodemailer.createTransport({
  service: 'QQ',
  secureConnection: true,
  auth: {
    user: userEmail,
    pass: '123456',
  },
});

class ToolService extends Service {
  async sendMail(email, subject, text, html) {
    console.log(email, subject, html);
    const mailOptions = {
      from: userEmail,
      cc: userEmail,
      to: email,
      subject,
      text,
      html,
    };
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.log('email error', err);
      return false;
    }
  }

  async mergeFile(filepath, hash, size) {
    const chunkdir = path.resolve(this.config.UPLOAD_DIR, hash);
    // chunk名
    let chunks = await fse.readdir(chunkdir);
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
    // 转换成路径
    chunks = chunks.map(cp => path.resolve(chunkdir, cp));
    await this.merge(chunks, filepath, size, chunkdir);
  }
  async merge(files, fpath, size, chunkdir) {
    const pipStream = (filePath, writeStream) => new Promise(resolve => {
      const readStream = fse.createReadStream(filePath);
      readStream.on('end', () => {
        fse.unlinkSync(filePath);
        resolve();
      });
      readStream.pipe(writeStream);
    });
    const pros = files.map((file, index) => {
      return pipStream(file, fse.createWriteStream(fpath, {
        start: index * size,
      }));
    });
    await Promise.all(pros);
  }
}


module.exports = ToolService;
