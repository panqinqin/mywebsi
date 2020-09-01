// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
module.exports = {
  assetsDir: 'static', // 相对于outputDir的静态资源(js、css、img、fonts)目录
  parallel: require('os').cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'))
  },
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.ts'
    }
  },
  configureWebpack:{
    resolve: { extensions: ['.ts', '.tsx', '.js', '.json'] },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        }
      ]
    }
  },
  css: {
    requireModuleExtension: false,// 去掉文件名中的 .module
    loaderOptions: {
      // 给 less-loader 传递 Less.js 相关选项
      less: {
        // `globalVars` 定义全局对象，可加入全局变量
        globalVars: {
          primary: '#333'
        }
      }
    }
  },
  devServer: {
    overlay: { // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true
    },
    host: 'localhost',
    port: 8080, // 端口号
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器
    hotOnly: true // 热更新
    // proxy: 'http://localhost:8080'   // 配置跨域处理,只有一个代理
    // proxy: { //配置多个跨域
    // }
  }
}

