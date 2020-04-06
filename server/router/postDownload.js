/**
 * 通过 post 下载文件
 */
const path = require("path");
const fs = require("fs");
const args = require("../libs/args");
const { appendToArchiver, isDir } = require("../libs/util");

module.exports = exports = {
  post(ctx) {
    const { downloadList } = ctx.request.body;
    let downloadName,
      list = [],
      result;
    if (typeof downloadList === "string") {
      const fullPath = path.join(args.dir, downloadList);
      const basename = path.basename(fullPath);
      if (isDir(fullPath, true)) {
        downloadName = `${basename}.zip`;
        result = appendToArchiver([fullPath]);
      } else {
        downloadName = basename;
        result = fs.createReadStream(fullPath);
      }
    } else if (downloadList instanceof Array) {
      downloadName = "batch.zip";
      list = downloadList;
      result = appendToArchiver(list);
    }
    ctx.set({
      "Content-Disposition": `attachment;filename=${downloadName}`
    });
    return (ctx.body = result);
  }
};
