const Router = require('koa-router');
const debug = require('debug')('trpg:component:report');

module.exports = function ReportComponent(app) {
  initStorage.call(app);
  initRouters.call(app);

  return {
    name: 'ReportComponent',
  }
}

function initStorage() {
  let app = this;
  let storage = app.storage;
  storage.registerModel(require('./models/error.js'));

  app.on('initCompleted', function(app) {
    // 数据信息统计
    debug('storage has been load 1 report db model');
  });
}

function initRouters() {
  const app = this;
  const webservice = app.webservice;
  const router = new Router();

  const report = require('./routers/report');

  router.use('/report', report.routes());
  webservice.use(router.routes());
}
