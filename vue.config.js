// vue.config.js
module.exports = {
  devServer: {
    before(app) {
      // 检查 app.stack 是否存在
      if (app.stack && Array.isArray(app.stack)) {
        app.stack = app.stack.filter(layer => {
          return !(
            layer.handle && 
            layer.handle.toString && 
            layer.handle.toString().includes('mock')
          );
        });
      }
    },
    proxy: {
      '/api': {
        target: 'https://dashscope.aliyuncs.com', // 移除末尾空格
        changeOrigin: true,
        secure: true,
        pathRewrite: { '^/api': '' },
        logLevel: 'debug'
      }
    }
  }
}