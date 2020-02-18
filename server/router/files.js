const readdirp = require("readdirp");
const path = require("path");
const args = require("../libs/args");
const util = require("../libs/util");

module.exports = exports = {
  post: async ctx => {
    const dir = path.join(args.dir, ctx.request.body.path);
    try {
      let files = await readdirp.promise(dir, {
        alwaysStat: true,
        depth: 0,
        type: "all"
      });
      if (!args.hidden) {
        files = files.filter(file => !util.isHidden(args.dir, file.fullPath));
      }
      const formattedFileObjects = files.map(file => {
        return {
          ...file,
          fileExt: path.extname(file.fullPath),
          fullPath: path.relative(args.dir, file.fullPath),
          isDir: file.stats.isDirectory()
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
        message: "系统异常",
        success: false
      });
    }
  }
};
