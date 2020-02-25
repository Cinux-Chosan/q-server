const args = require("../libs/args");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");

let downloadId = 0;
const donwloadMap = {};

module.exports = exports = {
  get: (ctx, next) => {
    let { isDownload, downloadId: localId } = ctx.query;
    if (isDownload !== undefined) {
      const downloadInfo = donwloadMap[localId] || {};
      const { downloadList } = downloadInfo;
      delete donwloadMap[localId];
      if (downloadList && downloadList.length > 0) {
        const [firstFile = {}] = downloadList;
        const isMultiple = downloadList.length > 1;
        if (!isMultiple && !firstFile.isDir) {
          // 只有一个文件并且是非目录，直接下载
          const fullPath = path.join(args.dir, firstFile.fullPath);
          ctx.set({
            "Content-Disposition": `attachment;filename=${firstFile.basename}`
          });
          return (ctx.body = fs.createReadStream(fullPath));
        } else {
          // 批量下载，适用于目录或者多个文件打包下载
          const archive = appendToArchiver(downloadInfo);
          const baseName = path.basename(firstFile.path);
          const downloadName = isMultiple ? "batch" : baseName;
          ctx.set({
            "Content-Disposition": `attachment;filename=${downloadName}.zip`
          });
          return (ctx.body = archive);
        }
      } else {
        return (ctx.body = { success: true, result: "无需要下载的文件" });
      }
    } else {
      return next();
    }
  },
  /**
   * 由于 URL 有长度限制，如果通过 url 传递下载文件参数，当选中过多元素时，可能会超出 url 上限，因此采用 post + get 的方式
   * 先 post 要下载的文件，生成一个下载 id，前端根据此下载 id 进行下载
   */
  post: ctx => {
    const { downloadList, path } = ctx.request.body;
    const loaclId = downloadId++;
    donwloadMap[loaclId] = { downloadList, path };
    return (ctx.body = { success: true, result: loaclId });
  }
};

function appendToArchiver({ downloadList = [], path: subPath }) {
  const cwd = path.join(args.dir, subPath);
  const archive = archiver("zip");
  archive.on('error', function (err) {
    throw err;
  });
  downloadList.forEach(({ basename, isDir }) => {
    // archiver 不支持 cwd 参数
    const fullPath = path.join(cwd, basename);
    if (isDir) {
      archive.directory(fullPath, basename);
    } else {
      archive.file(fullPath, { name: basename });
    }
  });
  archive.finalize();
  return archive;
}
