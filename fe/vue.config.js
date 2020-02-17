const path = require("path");
const { resolve } = path;

module.exports = {
  outputDir: path.join(__dirname, "../server/fedist"),
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:8888"
      },
      "^/download": {
        target: "http://localhost:8888"
      }
    },
    writeToDisk: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@utils": path.join(__dirname, "src/utils/"),
        "@req": path.join(__dirname, "src/utils/request"),
        "@comp": path.join(__dirname, "src/components"),
        "@icons": path.join(__dirname, "src/Icons")
      }
    }
  },
  chainWebpack(config) {
    config.module
      .rule("svg")
      .exclude.add(resolve("src/Icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/Icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
  }
};
