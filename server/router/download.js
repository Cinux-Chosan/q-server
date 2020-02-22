const args = require("../libs/args");
const path = require("path");
const archiver = require("archiver");

module.exports = exports = {
  get: (ctx, next) => {
    let { isDownload } = ctx.query;
    if (isDownload !== undefined) {
      const { downloadList = [] } = ctx.session;
      // 置空下载列表，防止内存泄漏
      ctx.session.downloadList = undefined;
      if (downloadList) {
        const archive = appendToArchiver(downloadList);
        const [firstFile = {}] = downloadList;
        const baseName =
          downloadList.length > 1
            ? "batch"
            : path.basename(firstFile.path) || "undefined";
        ctx.set({
          "Content-Disposition": `attachment;filename=${baseName}.zip`
        });
        return (ctx.body = archive);
      } else {
        return (ctx.body = { success: true, result: "无需要下载的文件" });
      }
    } else {
      return next();
    }
  },
  /**
   * 由于 URL 有长度限制，当选中过多元素时，可能会超出下载上限，因此采用 post + get 的方式
   * 先 post 要下载的文件，生成一个下载链接，前端根据此下载链接进行下载
   */
  post: ctx => {
    const { downloadList } = ctx.request.body;
    ctx.session.downloadList = downloadList;
    return (ctx.body = { success: true, result: "设置成功" });
  }
};

function appendToArchiver(downloadList = []) {
  const archive = archiver("zip", { cwd: args.dir });
  downloadList.forEach(({ fullPath, isDir }) => {
    if (isDir) {
      archive.directory(fullPath);
    } else {
      archive.file(fullPath);
    }
  });
  archive.finalize();
  return archive;
}
