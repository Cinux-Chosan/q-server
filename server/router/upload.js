
const fs = require('fs');

module.exports = exports = {
    post: async (ctx, next) => {
        // const file = ctx.request.file; // 获取上传文件
        const reader = fs.createReadStream(ctx.request.files['file']['path']);
        const writePath = __dirname + `/../uploaded/${ctx.request.files['file']['name']}`;
        const upStream = fs.createWriteStream(writePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        return ctx.body = {
            message: "文件上传成功",
            cc: 0
        }
    }
}
