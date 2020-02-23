const Koa = require("koa");
const path = require("path");
const send = require("koa-send");
const fs = require("fs");
const koaBody = require("koa-body"); //解析上传文件的插件
const session = require("koa-session");
const koaStatic = require("koa-static");
const compress = require("koa-compress");
const bytes = require("bytes");
const { address } = require("ip");
const cheerio = require("cheerio");
const router = require("./router");
const args = require("./libs/args");
const { isDev } = require("./libs/util");
const { error, log, http } = require("./libs/debug");

const app = new Koa();

// 缓存 index.html 内容
let indexFileContent = "";

app.keys = ["some secret hurr"];

app
  .use(session(app))
  .use((ctx, next) => {
    // 打印每次请求信息
    http(`\t${ctx.path} from \t${ctx.ip}`);
    return next();
  })
  .use(compress({}))
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
  .use(koaStatic(args.dir, { index: false, hidden: !!args.hidden }))
  .use(koaStatic(path.join(__dirname, "www"), { index: false }))
  .use(ctx => {
    // 其他路由全返回页面
    return (ctx.body = isDev
      ? indexFileContent || (indexFileContent = getIndexFileCache())
      : getIndexFileCache());
  })
  .on("error", err => {
    error(err.message);
  })
  .listen(args.port, () => {
    log(`please visit http://${address()}:${args.port} to download files`);
  });

/**
 * 根据命令行参数修改 index.html#title
 */
function getIndexFileCache() {
  const content = fs.readFileSync(path.join(__dirname, "www/index.html"), {
    encoding: "utf8"
  });
  const $ = cheerio.load(content);
  $("title").text(args.title);
  return $.html();
}
