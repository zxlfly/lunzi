'use strict';
const path = require('path');
const fs = require('fs');
const Controller = require('egg').Controller;

class MonitorController extends Controller {
  async error() {
    const { ctx } = this;
    const { info } = ctx.query;
    const json = JSON.parse(Buffer.from(info, 'base64').toString('utf-8'));
    console.log(json);
    ctx.getLogger('weberror').error(json);
    ctx.body = '';
  }
  async sourcemap() {
    const { ctx } = this;
    const stream = ctx.req;
    const filename = ctx.query.name;
    const dir = path.join(this.config.baseDir, 'upload');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const target = path.join(dir, filename);
    console.log('target:', target);
    const writeStream = fs.createWriteStream(target);
    stream.pipe(writeStream);
  }
}

module.exports = MonitorController;
