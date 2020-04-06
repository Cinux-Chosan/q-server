const args = require("../libs/args");

module.exports = exports = {
  post: ctx => {
    return (ctx.body = {
      result: {
        uploadable: !!args.upload,
        login: !!args.user.size,
        limit: args.limit,
        title: args.title
      },
      success: true
    });
  }
};
