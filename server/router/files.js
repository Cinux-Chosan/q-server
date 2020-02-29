const readdirp = require("readdirp");
const path = require("path");
const args = require("../libs/args");
const { isHidden, isAccessible } = require("../libs/util");

module.exports = exports = {
  post: async ctx => {
    const dir = path.join(args.dir, ctx.request.body.dir);
    try {
      if (!isAccessible(args.dir, dir)) throw new Error("越权访问");
      let files = await readdirp.promise(dir, { alwaysStat: true, depth: 0, type: "all" });
      // 过滤隐藏文件
      if (!args.hidden) {
        files = files.filter(file => !isHidden(args.dir, file.fullPath));
      }
      const formattedFileObjects = files.map(file => {
        const isDir = file.stats.isDirectory();
        return {
          ...file,
          fileExt: path.extname(file.fullPath),
          fullPath: path.relative(args.dir, file.fullPath),
          isDir
        };
      });
      return (ctx.body = {
        result: formattedFileObjects,
        success: true
      });
    } catch (error) {
      console.error(error.message);
      return (ctx.body = {
        result: [],
        message: error.message,
        success: false
      });
    }
  }
};
