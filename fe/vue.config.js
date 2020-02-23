const path = require("path");
const { resolve } = path;

module.exports = {
  outputDir: path.join(__dirname, "../server/www"),
  productionSourceMap: false,
  devServer: {
    proxy: {
      "^/api": {
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
    config
      .entry("app")
      .prepend("@babel/polyfill")
      .end();
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
    
    // ant-design-vue 使用了未转换成 es 5 的 ismobile 包，导致 ie <= 10  无法识别 const 等 es6 属性
    config.module
      .rule("fixBug")
      .test(/\.js$/)
      .include.add(resolve('node_modules/ismobilejs'))
      .end()
      .use("fixBug")
      .loader("babel-loader")
      .end();
    // const conf = config.toConfig();
  }
};
