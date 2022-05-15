import { exec, execSync } from 'child_process'
import fs from 'fs'
import readline from 'readline'

(async function () {
  const array = []

  async function processLineByLine() {
    // 如果不想手动输入全部路径
    // 需要注意https://github.com/nodejs/help/issues/2907
    const fileStream = fs.createReadStream('allText.txt');

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // 注意：使用 crlfDelay 选项
    // 将 input.txt 中的所有 CR LF ('\r\n') 实例识别为单个换行符。

    for await (const line of rl) {
      // input.txt 中的每一行都将在此处作为 `line` 连续可用。
      if (line.length > 10) {
        array.push(line)
      }
      // console.log(`Line from file: ${line}`);
    }
    //   console.log(array.length);
  }

  await processLineByLine()
  console.log(array);
  console.log(array.length);
  const errorList = []
  await sendRequest(array, 10)
  console.log('完成！,失败任务：', errorList);
  async function sendRequest(req, concurrent = 0) {
    return new Promise((resolve, reject) => {
      let len = req.length;
      let cut = 0;

      const start = async () => {
        // 从头部弹出任务
        let task = req.shift();
        // 执行任务
        if (task) {
          try {
            console.log('开始-----：', task.split('aac_adtstoasc')[1])
            exec(task, (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
              if (cut == len - 1) {
                console.log('完成-----：', task.split('aac_adtstoasc')[1])
                resolve();
              } else {
                console.log('完成-----：', task.split('aac_adtstoasc')[1])
                cut++;
                start();
              }
            })
          } catch (e) {
            // 可以重新下载，这里跳过了
            cut++
            start()
            errorList.push(task)
            console.error('失败任务：', task.split('aac_adtstoasc')[1]);
          }
        }
      };
      while (concurrent > 0) {
        start();
        concurrent--;
      }
    });
  }
})()

