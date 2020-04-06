const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const archiver = require("archiver");
const UAParser = require("ua-parser-js");
const args = require("./args");
const { http, log } = require("./debug");

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
 * 读取对应 index 并根据命令行参数修改 index.html#title 并缓存
 */
const getIndexFileCache = (() => {
  // 其他路由全返回页面
  let ie9;
  let ie8;
  let mobile;
  let manifest = require("../manifest");
  const loadHTML = indexPath => {
    const content = fs.readFileSync(path.join(__dirname, indexPath), { encoding: "utf8" });
    const $ = cheerio.load(content);
    $("title").text(args.title);
    return $.html();
  };
  const getHtmlFileName = name => {
    return Object.keys(manifest).find(key => key.match(new RegExp(`${name}[.0-9a-z]*.html`)));
  };
  return ctx => {
    const ua = ctx.header["user-agent"];
    const { browser, device } = UAParser(ua);
    if (isDev) {
      log("broswer and device info:", ua, browser, device);
      delete require.cache[require.resolve("../manifest")];
      manifest = require("../manifest");
    }
    if (device.type === "mobile") {
      // 使用 mobile
      return (!isDev && mobile) || (mobile = loadHTML(`../www/${getHtmlFileName("mobile")}`));
    } else if (browser.name === "IE" && browser.version <= 8) {
      // 使用 IE8-
      return (!isDev && ie8) || (ie8 = loadHTML(`../www/${getHtmlFileName("ie8\\-")}`));
    } else {
      // 其他情况都使用 IE9+
      return (!isDev && ie9) || (ie9 = loadHTML(`../www/${getHtmlFileName("ie9\\+")}`));
    }
  };
})();

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

const isDir = (filePath, sync) => {
  if (sync) return fs.statSync(filePath).isDirectory();
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) return reject(err);
      resolve(stats.isDirectory());
    });
  });
};

const appendToArchiver = (downloadList = []) => {
  const archive = archiver("zip");
  downloadList.forEach(filePath => {
    // 对每个路径进行越权校验
    if (isAccessible(args.dir, filePath)) {
      const cwd = path.join(filePath, "..");
      const basename = path.basename(filePath);
      const globConf = { cwd, dot: args.hidden };
      archive
        .glob(basename, globConf) // 匹配文件
        .glob(`${basename}/**/*`, globConf); // 匹配目录和内容
    } else {
      throw new Error("访问越权");
    }
  });
  archive.finalize();
  return archive;
};

const whiteList = ["/api/login", "/api/sysConf"];

const checkLogin = (ctx, next) => {
  const users = args.user;
  const isInWhiteList = whiteList.find(el => el === ctx.path);
  if (users.size && !isInWhiteList) {
    // 需要登录
    const username = ctx.session.username;
    if (users.get(username)) {
      // 登录过且已存在的用户
      return next();
    } else {
      // 未登录或不存在的用户，重定向到登录页面
      return (ctx.body = {
        success: false,
        command: "redirect#login",
        result: "",
        message: "用户未登录"
      });
    }
  } else {
    return next();
  }
};

module.exports = exports = {
  isDev,
  isHidden,
  isAccessible,
  getIndexFileCache,
  checkAccessble,
  logReq,
  isDir,
  appendToArchiver,
  checkLogin
};
