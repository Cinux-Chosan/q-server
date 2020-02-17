const args = require('../libs/args')

module.exports = exports = {
    post: (ctx) => {
        return ctx.body = {
            result: {
                uploadable: !!args.upload,
                limit: args.limit
            },
            success: true
        }
    }
}