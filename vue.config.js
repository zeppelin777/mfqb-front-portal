const { defineConfig } = require('@vue/cli-service')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}
module.exports = defineConfig({
  outputDir: './portal-build',
  transpileDependencies: true,
  /* devServer: {
        proxy: {
            '/api': {
                target: 'http://8.133.3.57:18091/admin',
                changeOrigin: true,
                 pathRewrite: {
                '^/api': '' // 重写路径，将请求路径中的'/api'替换为空字符串（根据后端接口路径调整）
                }
            },
        },
    }, */
  chainWebpack(config) {
    config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
})
