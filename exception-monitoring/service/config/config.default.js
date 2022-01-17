/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const path = require('path');
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1637143895661_4485';

  // add your middleware config here
  config.middleware = [];
  config.customLogger = {
    weberror: {
      file: path.join(appInfo.root, 'logs/weberror.log'),
    },
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };
  return {
    ...config,
    ...userConfig,
    security: {
      csrf: {
        enable: false,
      },
    },
  };
};
