const Koa = require("koa");
const path = require("path");
const send = require("koa-send");
const koaBody = require("koa-body"); //解析上传文件的插件
const koaStatic = require("koa-static");
const bytes = require("bytes");
const { address } = require("ip");
const router = require("./router");
const args = require("./libs/args");
const { error, log, http } = require("./libs/debug");

const app = new Koa();

app
  .use((ctx, next) => {
    http(`\t${ctx.path} from \t${ctx.ip}`);
    return next();
  })
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
  .use(koaStatic(args.dir, { index: false, hidden: !!args.hidden }))
  .use(koaStatic(path.join(__dirname, "fedist")))
  .use((ctx, next) => {
    // 对接口进行越权检查
    const destPath = path.join(args.dir, ctx.request.body.dir || ".");
    if (path.relative(args.dir, destPath).startsWith("..")) {
      return ctx.throw(401, "access_denied");
    } else {
      return next();
    }
  })
  .use(router.routes())
  .use(router.allowedMethods())
  .use(async ctx => {
    // 其他路由全返回页面
    await send(ctx, "fedist/index.html", { root: __dirname });
  })
  .on("error", err => {
    error(err.message);
  })
  .listen(args.port, () => {
    log(`please visit http://${address()}:${args.port} to download files`);
  });
