import login from "./login";

const commands = {};

export const plugin = {
  // Module Name
  name: "@chosan-commands",
  install() {
    window.$_commands = commands;
  },
  /* Create callback
    It will be executed in the very beginning of class initilization (when we create new instance of the class)
    */
  create() {
    Object.assign(commands, {
      redirect: {
        login: login.bind(this, this)
      }
    });
  }
};

export default commands;
