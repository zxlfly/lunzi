'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller } = app;
  router.get('/monitor/error', controller.monitor.error);
  router.post('/monitor/sourcemap', controller.monitor.sourcemap);
};
