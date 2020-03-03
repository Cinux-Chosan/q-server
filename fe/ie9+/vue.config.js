const path = require("path");
const webpack = require("webpack");
const { resolve } = path;

module.exports = {
  outputDir: path.join(__dirname, "../../server/www/ie9+"),
  publicPath: "/ie9+",
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
        "@comps": path.join(__dirname, "src/components"),
        "@directives": path.join(__dirname, "src/directives"),
        "@classes": path.join(__dirname, "src/classes"),
        "@icons": path.join(__dirname, "src/Icons"),
        "@router": path.join(__dirname, "src/router"),
        "@store": path.join(__dirname, "src/store")
      }
    }
  },
  chainWebpack(config) {
    config
      .entry("app")
      // IE 9 classList polyfill
      // .prepend("classlist-polyfill")
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

    // 动态打包标志
    config
      .plugin("DefinePlugin")
      .use(webpack.DefinePlugin, [
        {
          isDev: JSON.stringify(config.get("mode") !== "production")
        }
      ])
      .end();

    // config
    //   .externals({
    //     Vue: "Vue"
    //   })
    //   .end();

    // ant-design-vue 使用了未转换成 es 5 的 ismobile 包，导致 ie <= 10  无法识别 const 等 es6 属性
    config.module
      .rule("fixBug")
      .test(/\.js$/)
      .include.add(resolve("node_modules/ismobilejs"))
      .add(resolve("node_modules/debug"))
      .end()
      .use("fixBug")
      .loader("babel-loader")
      .end();
    const conf = config.toConfig();
  }
};
