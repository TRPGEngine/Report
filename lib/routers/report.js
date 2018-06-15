const Router = require('koa-router');
const router = new Router();

router.post('/error', async (ctx) => {
  let ip = ctx.request.headers['x-real-ip'] || ctx.request.ip;
  let ua = ctx.request.headers['user-agent'];
  let {message, stack} = ctx.request.body;

  let db = await ctx.trpgapp.storage.connectAsync();
  try {
    await db.models.report_error.createAsync({
      ip,
      ua,
      message,
      stack,
    });
  }finally {
    db.close();
  }

  ctx.body = '提交成功';
});

module.exports = router;
