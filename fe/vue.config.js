const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = path;

module.exports = {
  outputDir: path.join(__dirname, "../server/www"),
  publicPath: "/",
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
        "@8": path.join(__dirname, "src/ie8-"),
        "@9": path.join(__dirname, "src/ie9+"),
        "@m": path.join(__dirname, "src/mobile"),
        // 多终端通用
        "@common": path.join(__dirname, "common"),
        "@utils": path.join(__dirname, "common/utils"),
        "@icons": path.join(__dirname, "common/Icons"),
        "@req": path.join(__dirname, "common/utils/request"),
        "@classes": path.join(__dirname, "common/classes"),
        "@directives": path.join(__dirname, "common/directives"),
      }
    }
  },
  chainWebpack(config) {
    // 清除 vue cli 自带的 app 入口
    config.entryPoints
      .delete("app")
      .end();
    // 添加 ie9+ 入口
    config
      .entry("ie9+")
      .add("@babel/polyfill")
      .add("./src/ie9+/main.js")
      .end();
    // IE 9 classList polyfill
    // .prepend("classlist-polyfill")
    config
      // 添加 mobile 入口
      .entry("mobile")
      .add("@babel/polyfill")
      .add("./src/mobile/main.js")
      .end();

    config
      .plugin("html")
      .tap(argsArray => {
        // 修改 ie9+ 入口
        const [defaultArg] = argsArray;
        const ie9Plus = {
          ...defaultArg,
          template: path.join(__dirname, "public/ie9+.html"),
          chunks: "ie9+",
          excludeChunks: ["mobile"],
          filename: "ie9+.html"
        };

        // 添加 mobile 入口
        const mobile = {
          ...defaultArg,
          template: path.join(__dirname, "public/mobile.html"),
          chunks: "mobile",
          excludeChunks: ["ie9+"],
          filename: "mobile.html"
        };
        config
          .plugin("mobileHtml")
          .use(HtmlWebpackPlugin, [mobile])
          .end();

        return [ie9Plus, mobile];
      })
      .end();

    config.module
      .rule("svg")
      .exclude.add(resolve("common/Icons"))
      .end();

    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("common/Icons"))
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
    //     vue: "Vue"
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
