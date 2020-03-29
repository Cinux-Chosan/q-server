const fs = require("fs");
const path = require("path");
const args = require("../libs/args");

module.exports = exports = {
  post: async ctx => {
    if (!args.upload) {
      ctx.throw(500, "未开启文件上传功能", { expose: true });
    }
    const { request } = ctx;
    const { dir: dirPath = "/" } = request.body;
    const tempFilePath = request.files["file"]["path"];
    const fileName = request.files["file"]["name"];
    const extName = path.extname(fileName);
    const baseName = path.basename(fileName, extName);
    let count = 0;
    let writePath = path.join(args.dir, dirPath, fileName);
    // 已存在文件名检测
    while (fs.existsSync(writePath)) {
      writePath = path.join(args.dir, dirPath, `${baseName}(${++count})${extName}`);
    }
    const reader = fs.createReadStream(tempFilePath);
    const writer = fs.createWriteStream(writePath);
    try {
      await new Promise((resolve, reject) => {
        reader
          .on("end", () => {
            fs.unlink(tempFilePath, () =>
              console.log(
                `文件 ${fileName} 上传已完成，临时文件 ${tempFilePath} 已移除，目标文件 ${writePath} 已生成。`
              )
            );
            resolve();
          })
          .on("error", err => reject(err))
          .pipe(writer);
      });
      return (ctx.body = {
        result: "文件上传成功",
        message: "文件上传成功",
        success: true
      });
    } catch (error) {
      return (ctx.body = {
        result: "文件上传失败",
        message: error.message,
        success: false
      });
    }
  }
};
