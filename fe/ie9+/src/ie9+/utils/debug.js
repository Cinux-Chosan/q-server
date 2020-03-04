import debug from "debug";

const qCmd = debug("q-cmd");

export default {
  log: qCmd.extend("log"),
  http: qCmd.extend("http"),
  event: qCmd.extend("event"),
  error: qCmd.extend("error")
};

debug.enable("q-cmd:*");
