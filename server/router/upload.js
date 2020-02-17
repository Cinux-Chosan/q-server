const fs = require("fs");
const path = require("path");
const args = require("../libs/args");

module.exports = exports = {
  post: async ctx => {
    const { request } = ctx;
    const dirPath = request.body.dir;
    const tempFilePath = request.files["file"]["path"];
    const fileName = request.files["file"]["name"];
    const extName = path.extname(fileName);
    const baseName = path.basename(fileName, extName);
    let count = 0;
    let writePath = path.join(args.dir, dirPath, fileName);
    // 文件名已存在检测
    while (fs.existsSync(writePath)) {
      writePath = path.join(
        args.dir,
        dirPath,
        `${baseName}(${++count})${extName}`
      );
    }
    const reader = fs.createReadStream(tempFilePath);
    const writer = fs.createWriteStream(writePath);
    reader
      .on("end", () => {
        fs.unlink(tempFilePath, () =>
          console.log(`文件 ${fileName} 上传已完成，临时文件 ${tempFilePath} 已移除`)
        );
      })
      .pipe(writer);
    return (ctx.body = {
      result: "文件上传成功",
      message: "文件上传成功",
      success: true
    });
  }
};
