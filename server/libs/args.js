const yargs = require("yargs");
const bytes = require("bytes");
const toMs = require("millisecond");
const package = require("../../package");
const path = require("path");

yargs.options({
  port: {
    alias: "p",
    default: 8888,
    describe: "被监听的端口号"
  },
  dir: {
    alias: "d",
    default: process.cwd(),
    describe: "文件服务根目录，默认为执行命令的当前目录",
    coerce: dir => (path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir))
  },
  upload: {
    alias: "u",
    default: false,
    type: "boolean",
    describe: "是否启用上传功能"
  },
  kill: {
    alias: "k",
    default: -1,
    type: "string",
    describe: "自动关闭时间（ms, s, m, h, d, w, y），默认单位 h（小时）",
    coerce: killTime => {
      const ms = Number(killTime) ? toMs(`${killTime} h`) : toMs(killTime);
      ms > 0 && setTimeout(() => process.exit(0), ms);
      return ms;
    }
  },
  hidden: {
    alias: "h",
    default: false,
    type: "boolean",
    describe: "隐藏文件是否可下载"
  },
  limit: {
    alias: "l",
    default: "200mb",
    describe: "允许上传的文件大小（B, KB, MB, GB, TB, PB ...），默认单位：B",
    coerce: limit => (Number(limit) ? bytes(limit) : limit)
  },
  title: {
    alias: "t",
    default: package.name,
    describe: "网页标题"
  },
  user: {
    describe: "用户名和密码对，支持英文字符、数字、星号和下划线，格式：username/password",
    default: new Map(),
    coerce: user => {
      const users = typeof user === "string" ? [user] : user;
      const userInfo = new Map();
      for (let index = 0; index < users.length; index++) {
        const user = users[index];
        const match = user.match(/^([_*A-Za-z0-9]+)\/([_*A-Za-z0-9]+)$/);
        if (match) {
          const username = match[1];
          const password = match[2];
          userInfo.set(username, password);
        } else {
          throw new Error("用户名或密码格式错误");
        }
      }
      return userInfo;
    }
  }
});

module.exports = exports = yargs.argv;
