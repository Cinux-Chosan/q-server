const args = require("../libs/args");

module.exports = exports = {
  post(ctx) {
    ctx.session.username = null;
    return (ctx.body = {
      success: true,
      message: "登出成功!",
      result: true
    });
  }
};
