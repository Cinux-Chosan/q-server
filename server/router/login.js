const args = require("../libs/args");

module.exports = exports = {
  post(ctx) {
    const { username, password } = ctx.request.body;
    const users = args.user;
    if (users.size) {
      // 需要登录
      if (users.get(username) === password) {
        ctx.session.username = username;
        return (ctx.body = {
          success: true,
          result: true,
          message: "登录成功!"
        });
      } else {
        return (ctx.body = {
          success: false,
          result: "",
          message: "登录失败：用户名或密码错误!"
        });
      }
    } else {
      return next();
    }
  }
};
