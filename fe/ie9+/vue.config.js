const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
        "@utils": path.join(__dirname, "src/ie9+/utils/"),
        "@req": path.join(__dirname, "src/ie9+/utils/request"),
        "@comps": path.join(__dirname, "src/ie9+/components"),
        "@directives": path.join(__dirname, "src/ie9+/directives"),
        "@classes": path.join(__dirname, "src/ie9+/classes"),
        "@icons": path.join(__dirname, "src/ie9+/Icons"),
        "@router": path.join(__dirname, "src/ie9+/router"),
        "@store": path.join(__dirname, "src/ie9+/store")
      }
    }
  },
  chainWebpack(config) {
    config
      // 清除 vue cli 自带的 app 入口
      .entryPoints
      .delete('app')
      .end()
    // 添加 ie9+ 入口
    config
      .entry('ie9+')
      .add("@babel/polyfill")
      .add('./src/ie9+/main.js')
      .end()
    // IE 9 classList polyfill
    // .prepend("classlist-polyfill")
    config
      // 添加 mobile 入口
      .entry("mobile")
      .add("@babel/polyfill")
      .add("./src/mobile/main.js")
      .end()

    config
      .plugin('html')
      .tap((argsArray) => {
        // 修改 ie9+ 入口
        const [defaultArg] = argsArray
        const ie9Plus = {
          ...defaultArg,
          template: path.join(__dirname, 'public/ie9+.html'),
          chunks: 'ie9+'
        }
        // 添加 mobile 入口
        const mobile = {
          ...defaultArg,
          template: path.join(__dirname, 'public/mobile.html'),
          chunks: 'mobile'
        };
        return [ie9Plus, mobile];
      })
      .end()


    config.module
      .rule("svg")
      .exclude.add(resolve("src/ie9+/Icons"))
      .end();

    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/ie9+/Icons"))
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
