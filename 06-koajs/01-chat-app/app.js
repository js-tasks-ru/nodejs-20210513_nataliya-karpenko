const path = require('path');
const Koa = require('koa');
const {EventEmitter} = require('events');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const postEmitter = new EventEmitter();

router.get('/subscribe', async (ctx, next) => {
  await new Promise((resolve) => {
    postEmitter.once('post', (message) => {
      resolve(message);
    });
  }).then((message) => {
    ctx.body = message;
  });
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (message && message !== '') {
    postEmitter.emit('post', message);
    ctx.response.status = 200;
  }
});

app.use(router.routes());

module.exports = app;
