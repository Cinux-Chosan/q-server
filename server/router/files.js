const glob = require("glob");
const args = require('../libs/args')

module.exports = exports = {
    get: (ctx) => {
        const files = glob.sync('*.*', { cwd: args.dir })
        return ctx.body = {
            result: files,
            success: true
        }
    }
}