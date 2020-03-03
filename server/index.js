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
const { isDev, checkAccessble, getIndexFileCache, logReq } = require("./libs/util");
const { error, log } = require("./libs/debug");

const app = new Koa();

app.keys = ["some secret hurr"];

app
  .use(session(app))
  .use(logReq)
  .use(compress())
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
  .use(checkAccessble)
  .use(router.routes())
  .use(router.allowedMethods())
  .use(koaStatic(args.dir, { index: false, hidden: !!args.hidden }))
  .use(koaStatic(path.join(__dirname, "www"), { index: false }))
  .use(ctx => {
    return ctx.body = getIndexFileCache(ctx)
  })
  .on("error", err => {
    error(err.message);
  })
  .listen(args.port, () => {
    log(`please visit http://${address()}:${args.port} to download files`);
  });

