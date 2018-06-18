module.exports = {
  async daily(start, end, db) {
    const app = this;
    let count = await db.models.player_user.countAsync({
      createAt: app.storage._orm.between(start, end)
    });
    await db.models.report_register_daily.createAsync({
      count,
      start,
      end,
    })
  },
  async weekly(start, end, db) {
    const app = this;
    let count = await db.models.player_user.countAsync({
      createAt: app.storage._orm.between(start, end)
    });
    await db.models.report_register_weekly.createAsync({
      count,
      start,
      end,
    })
  },
  async monthly(start, end, db) {
    const app = this;
    let count = await db.models.player_user.countAsync({
      createAt: app.storage._orm.between(start, end)
    });
    await db.models.report_register_monthly.createAsync({
      count,
      start,
      end,
    })
  },
}
