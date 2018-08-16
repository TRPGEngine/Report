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
  let registerAll = (model) => {
    for (let k in model) {
      storage.registerModel(model[k]);
    }
  }

  storage.registerModel(require('./models/error'));
  registerAll(require('./models/register'));
  registerAll(require('./models/chatlog'));
  registerAll(require('./models/loginTimes'));

  app.on('initCompleted', function(app) {
    // 数据信息统计
    debug('storage has been load 10 report db model');
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
  let dailyReport = schedule.scheduleJob('0 0 2 * * *', async () => {
    // 每日2点
    let end = new Date();
    end.setHours(0, 0, 0, 0);
    let start = new Date(end - 1000 * 60 * 60 * 24);
    debug('run daily report: [%s, %s]', start, end);

    let db = await app.storage.connectAsync();
    for (let k in reports) {
      debug(' - execute task:', k);
      let report = reports[k];
      try {
        report.daily && await report.daily.call(app, start, end, db);
      }catch(err) {
        console.error(err);
      }
    }
    db.close();
  });
  let weeklyReport = schedule.scheduleJob('0 0 2 * * MON', async () => {
    // 每周一2点
    let end = new Date();
    end.setHours(0, 0, 0, 0);
    let start = new Date(end - 1000 * 60 * 60 * 24 * 7);
    debug('run weekly report: [%s, %s]', start, end);

    let db = await app.storage.connectAsync();
    for (let k in reports) {
      debug(' - execute task:', k);
      let report = reports[k];
      try {
        report.weekly && await report.weekly.call(app, start, end, db);
      }catch(err) {
        console.error(err);
      }
    }
    db.close();
  });
  let monthlyReport = schedule.scheduleJob('0 0 2 1 * *', async () => {
    // 每月1日2点
    let end = new Date();
    end.setHours(0, 0, 0, 0);
    let start = new Date(end);
    start.setMonth(start.getMonth() - 1);
    debug('run monthly report: [%s, %s]', start, end);

    let db = await app.storage.connectAsync();
    for (let k in reports) {
      debug(' - execute task:', k);
      let report = reports[k];
      try {
        report.monthly && await report.monthly.call(app, start, end, db);
      }catch(err) {
        console.error(err);
      }
    }
    db.close();
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
