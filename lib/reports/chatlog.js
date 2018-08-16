module.exports = {
  async daily(start, end, db) {
    const app = this;
    let count = await db.models.chat_log.countAsync({
      date: app.storage._orm.between(start, end)
    });
    await db.models.report_chatlog_daily.createAsync({
      count,
      start,
      end,
    });
  },
  async weekly(start, end, db) {
    const app = this;
    let count = await db.models.chat_log.countAsync({
      date: app.storage._orm.between(start, end)
    });
    await db.models.report_chatlogweekly.createAsync({
      count,
      start,
      end,
    });
  },
  async monthly(start, end, db) {
    const app = this;
    let count = await db.models.chat_log.countAsync({
      date: app.storage._orm.between(start, end)
    });
    await db.models.report_chatlogonthly.createAsync({
      count,
      start,
      end,
    });
  },
}
