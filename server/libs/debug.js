const debug = require("debug");

const server = debug("server");

module.exports = exports = {
  log: server.extend("log"),
  http: server.extend("http:"),
  error: server.extend("error:")
};

debug.enable("server:*");
