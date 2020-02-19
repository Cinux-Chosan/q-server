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
  }
});

module.exports = exports = yargs.argv;
