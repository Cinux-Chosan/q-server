import router from "../router";

const commands = {
  redirect: {
    login: () => router.push({ name: "Login" })
  }
};

export default window.$_commands = commands;
