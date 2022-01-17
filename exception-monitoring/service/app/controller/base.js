'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  success(data) {
    this.ctx.body = {
      code: 1,
      data,
    };
  }
  msg(msg) {
    this.ctx.body = {
      code: 0,
      msg,
    };
  }
  error(msg, code = -1, error = {}) {
    this.ctx.body = {
      code,
      msg,
      error,
    };
  }
}

module.exports = BaseController;
