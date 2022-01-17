const UploadSourceMapWebpackPlugin = require('./plugin/uploadSourceMapWebpackPlugin')
module.exports = {
    // 关闭eslint
    devServer: {
        overlay: {
            warning: true,
            errors: true
        }
    },
    lintOnSave: false,
    configureWebpack: {
        plugins: [
            new UploadSourceMapWebpackPlugin({
                uploadUrl: 'http://localhost:7001/monitor/sourcemap'
            })
        ]
    }
}