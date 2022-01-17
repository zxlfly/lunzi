const path = require('path')
const glob = require('glob')
const fs = require('fs')
const http = require('http')
class UploadSourceMapWebpackPlugin {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        //定义打包后执行
        compiler.hooks.done.tap('UploadSourceMapWebpackPlugin', async (status) => {
            // 读取sourcemap文件
            const list = glob.sync(path.join(status.compilation.outputOptions.path, `../dist/js/*.{js.map,}`))
            for (let filename of list) {
                await this.upload(this.options.uploadUrl, filename)
            }
        })
    }
    upload(url, file) {
        return new Promise(resolve => {
            console.log('upload map:', file);
            const req = http.request(
                `${url}?name=${path.basename(file)}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        Connection: 'keep-alive',
                        'Transfer-Encoding': 'chunked'
                    }
                }
            )
            fs.createReadStream(file)
                .on('data', chunk => {
                    req.write(chunk)
                })
                .on('end', () => {
                    req.end()
                    resolve()
                })
        })
    }
}
module.exports = UploadSourceMapWebpackPlugin