module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  rules: {
    "no-console": 'off',
    "no-debugger": onOrOff(),
    "no-dupe-keys": onOrOff(),
    "vue/no-unused-components": onOrOff(),
    "no-unused-vars": onOrOff(),
    "no-constant-condition": onOrOff(),
    // polyfill
    "no-prototype-builtins": "off"
  },
  globals: {
    isDev: false
  }
};

function onOrOff() {
  return process.env.NODE_ENV === "production" ? "error" : "off";
}
