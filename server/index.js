const Koa = require("koa");
const path = require("path");
const koaBody = require("koa-body"); //解析上传文件的插件
const session = require("koa-session");
const koaStatic = require("koa-static");
const compress = require("koa-compress");
const bytes = require("bytes");
const { address } = require("ip");
const router = require("./router");
const args = require("./libs/args");
const { checkAccessble, getIndexFileCache, logReq, checkLogin } = require("./libs/util");
const { error, log } = require("./libs/debug");

const app = new Koa();

app.keys = ["some secret hurr"];

app
  // session
  .use(session(app))
  // 日志打印
  .use(logReq)
  // 压缩响应
  .use(compress())
  // index.html
  .use((ctx, next) => (ctx.path === "/" ? (ctx.body = getIndexFileCache(ctx)) : next()))
  // www
  .use(koaStatic(path.join(__dirname, "www"), { index: false, defer: false }))
  // 登录校验
  .use(checkLogin)
  // post 请求体解析
  .use(
    koaBody({
      multipart: true,
      formidable: {
        maxFileSize: bytes(args.limit) // 设置上传文件大小最大限制，默认2M
      },
      onError(err) {
        err.message = `文件大小超出后台设置的 ${args.limit} 限制`;
        err.expose = true;
        throw err;
      }
    })
  )
  // 目录越权校验，用于 api 中目录参数
  .use(checkAccessble)
  // api 路由
  .use(router.routes())
  .use(router.allowedMethods())
  // 其他静态资源响应
  .use(koaStatic(args.dir, { index: false, hidden: !!args.hidden }))
  // 兜底
  .use(ctx => (ctx.body = getIndexFileCache(ctx)))
  .on("error", err => {
    error(err.message);
  })
  .listen(args.port, () => {
    log(`please visit http://${address()}:${args.port} to download files`);
  });
