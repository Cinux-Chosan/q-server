import axios from "axios";
import debug from "@utils/debug";

/**
 * 为了区分 api 和静态资源，所有 api 请求推荐使用 post 方式，将 get 留给静态资源使用
 */
export default async (path, data, method = "post", reThrow = true) => {
  let response;
  try {
    response = await axios[method.toLowerCase()](path, data);
    if (response.status === 200) {
      const { data } = response;
      if (data.success) {
        return data.result;
      } else if (data.command) {
        const [command, name] = data.command.split("#");
        window.$_commands[command][name]();
      } else {
        isDev && debug.error("request", data.message);
        throw new Error(data.message);
      }
    }
  } catch (err) {
    isDev && debug.error(err.message);
    if (reThrow) throw err;
  } finally {
    isDev && debug.http(path, "\t", response);
  }
};
