const Koa = require('koa');
const { address } = require('ip')
const koaBody = require('koa-body'); //解析上传文件的插件
const koaStatic = require('koa-static');

const router = require('./router')
const args = require('./libs/args')
const app = new Koa();

app
    .use(koaBody({
        multipart: true,
        formidable: {
            maxFileSize: 4000 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
        }
    }))
    .use(koaStatic(args.dir, ))
    .use(router.routes())
    .use(router.allowedMethods())
    // .use(async ctx => {
    //     ctx.body = 'Hello World';
    // })
    .listen(args.port, () => {
        console.log(`\n\t please visit http://${address()}:${args.port} to download files`)
    });