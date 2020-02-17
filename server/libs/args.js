const yargs = require("yargs");
const bytes = require("bytes");

yargs.options({
  port: {
    alias: "p",
    default: 8888,
    describe: "被监听的端口号"
  },
  dir: {
    alias: "d",
    default: process.cwd(),
    describe: "文件服务根目录，默认为执行命令的当前目录"
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
    describe: "自动关闭时间，单位 s（秒）"
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
  }
});

module.exports = exports = yargs.argv;
