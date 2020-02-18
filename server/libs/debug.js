const debug = require("debug");

const qCmd = debug("q-cmd");

module.exports = exports = {
  log: qCmd.extend("log"),
  http: qCmd.extend("http:"),
  error: qCmd.extend("error:")
};

debug.enable("q-cmd:*");
