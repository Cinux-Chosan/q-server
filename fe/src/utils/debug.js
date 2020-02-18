import debug from "debug";

const qCmd = debug("q-cmd");

export default {
  log: qCmd.extend("log"),
  http: qCmd.extend("http:"),
  error: qCmd.extend("error:")
};

debug.enable("q-cmd:*");
