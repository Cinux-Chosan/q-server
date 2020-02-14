const yargs = require('yargs')

yargs
    .options({
        port: {
            alias: 'p',
            default: 8888,
            describe: '被监听的端口号'
        },
        dir: {
            alias: 'd',
            default: process.cwd(),
            describe: '文件根目录，默认为执行命令的目录'
        }
    })

module.exports = exports = yargs.argv




