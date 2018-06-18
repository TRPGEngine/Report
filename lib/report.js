const Router = require('koa-router');
const debug = require('debug')('trpg:component:report');
const schedule = require('node-schedule');
const reports = require('./reports');

module.exports = function ReportComponent(app) {
  initStorage.call(app);
  initRouters.call(app);
  initTimer.call(app);

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

function initTimer() {
  let app = this;
  let dailyReport = schedule.scheduleJob('0 0 2 * * *', () => {
    // 每日2点
    let end = new Date();
    end.setHours(0, 0, 0, 0);
    let start = new Date(end - 1000 * 60 * 60 * 24);
    debug('run daily report: [%s, %s]', start, end);

    for (let report of reports) {
      report.daily && report.daily(start, end);
    }
  });
  let weeklyReport = schedule.scheduleJob('0 0 2 * * MON', () => {
    // 每周一2点
    let end = new Date();
    end.setHours(0, 0, 0, 0);
    let start = new Date(end - 1000 * 60 * 60 * 24 * 7);
    debug('run weekly report: [%s, %s]', start, end);

    for (let report of reports) {
      report.weekly && report.weekly(start, end);
    }
  });
  let monthlyReport = schedule.scheduleJob('0 0 2 1 * *', () => {
    // 每月1日2点
    let end = new Date();
    end.setHours(0, 0, 0, 0);
    let start = new Date(end);
    start.setMonth(start.getMonth() - 1);
    debug('run monthly report: [%s, %s]', start, end);

    for (let report of reports) {
      report.monthly && report.monthly(start, end);
    }
  });

  debug('next daily report', dailyReport.nextInvocation());
  debug('next weekly report', weeklyReport.nextInvocation());
  debug('next monthly report', monthlyReport.nextInvocation());

  app.on('close', function() {
    dailyReport.cancel();
    weeklyReport.cancel();
    monthlyReport.cancel();
  })
}
