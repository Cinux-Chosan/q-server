const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const args = require("./args");
const { http } = require("./debug");

/**
 * 是否是 dev 环境
 */
const isDev = process.env.NODE_ENV === "dev";

/**
 * 检查 root 之后的路径是否是隐藏文件或目录
 */

const isHidden = (root, filePath) => {
  filePath = filePath.substr(root.length).split(path.sep);
  for (let i = 0; i < filePath.length; i++) {
    const firstChar = filePath[i] && filePath[i].trim()[0];
    if (firstChar === ".") return true;
  }
  return false;
};

/**
 * 检测 absPath 是否越过了 root，成为了 root 的上级
 * @param {String} root 根路由，absPath 不能越过根路径
 * @param {String} absPath 用于检测的路径
 */
const isAccessible = (root, absPath) => !path.relative(root, absPath).startsWith("..");

/**
 * 根据命令行参数修改 index.html#title
 */
function getIndexFileCache() {
  const content = fs.readFileSync(path.join(__dirname, "../www/index.html"), { encoding: "utf8" });
  const $ = cheerio.load(content);
  $("title").text(args.title);
  return $.html();
}

// 对请求路径做通用越权校验，如有特殊校验需求需要在接口中校验
const checkAccessble = (ctx, next) => {
  // 对接口进行越权检查
  const destPath = path.join(args.dir, ctx.request.body.dir || ".");
  if (isAccessible(args.dir, destPath)) {
    return next();
  } else {
    return ctx.throw(401, "access_denied");
  }
};

// 记录每次请求信息
const logReq = (ctx, next) => {
  http(`\t${ctx.path} from \t${ctx.ip}`);
  return next();
};

module.exports = exports = {
  isDev,
  isHidden,
  isAccessible,
  getIndexFileCache,
  checkAccessble,
  logReq
};
