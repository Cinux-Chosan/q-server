const fs = require('fs');
const path = require("path");
const cheerio = require("cheerio");
const args = require('./args');
const { http } = require("./debug");

/**
 * Check if it's hidden.
 */

const isHidden = (root, filePath) => {
  filePath = filePath.substr(root.length).split(path.sep);
  for (let i = 0; i < filePath.length; i++) {
    if (filePath[i][0] === ".") return true;
  }
  return false;
};

const isDev = process.env.NODE_ENV === "dev";

const isAccessible = (root, absPath) => !path.relative(root, absPath).startsWith('..')

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
}

// 记录请求信息
const logReq = (ctx, next) => {
  // 打印每次请求信息
  http(`\t${ctx.path} from \t${ctx.ip}`);
  return next();
}

module.exports = exports = {
  isHidden,
  isDev,
  isAccessible,
  getIndexFileCache,
  checkAccessble,
  logReq
};
