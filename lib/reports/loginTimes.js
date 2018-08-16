module.exports = {
  async daily(start, end, db) {
    const app = this;
    let login_count = await db.models.player_login_log.countAsync({
      createAt: app.storage._orm.between(start, end)
    });
    let loginUUIDs = await db.models.player_login_log.aggregate({
      createAt: app.storage._orm.between(start, end)
    }).select('user_uuid').count().groupBy('user_uuid').getAsync();
    loginUUIDs = loginUUIDs[0];
    console.log('loginUUIDs', loginUUIDs);
    let user_count = loginUUIDs.length;
    await db.models.report_login_times_daily.createAsync({
      login_count,
      user_count,
      start,
      end,
    });
  },
  async weekly(start, end, db) {
    const app = this;
    let login_count = await db.models.player_login_log.countAsync({
      createAt: app.storage._orm.between(start, end)
    });
    let loginUUIDs = await db.models.player_login_log.aggregate({
      createAt: app.storage._orm.between(start, end)
    }).select('user_uuid').count().groupBy('user_uuid').getAsync();
    loginUUIDs = loginUUIDs[0];
    console.log('loginUUIDs', loginUUIDs);
    let user_count = loginUUIDs.length;
    await db.models.report_login_times_weekly.createAsync({
      login_count,
      user_count,
      start,
      end,
    });
  },
  async monthly(start, end, db) {
    const app = this;
    let login_count = await db.models.player_login_log.countAsync({
      createAt: app.storage._orm.between(start, end)
    });
    let loginUUIDs = await db.models.player_login_log.aggregate({
      createAt: app.storage._orm.between(start, end)
    }).select('user_uuid').count().groupBy('user_uuid').getAsync();
    loginUUIDs = loginUUIDs[0];
    console.log('loginUUIDs', loginUUIDs);
    let user_count = loginUUIDs.length;
    await db.models.report_login_times_monthly.createAsync({
      login_count,
      user_count,
      start,
      end,
    });
  },
}
