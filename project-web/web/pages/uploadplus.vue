<style>
.drag {
  width: 100%;
  line-height: 100px;
  border: 1px dashed #999;
  text-align: center;
}
</style>
<template>
  <div>
    <h1>文件上传</h1>
    <div ref="drag" class="drag">
      <input type="file" name="file" @change="handleFileChange" />
    </div>
    <div>
      <el-progress
        :stroke-width="20"
        :text-inside="true"
        :percentage="uploadProgress"
      ></el-progress>
    </div>
    <div>
      <el-button @click="uploadFile">上传头像</el-button>
    </div>
    <!-- 切片上传进度 -->
    <!-- chunk.progress等于100为成功，小于0出错 -->
    <div class="cube-container" :style="{ width: cubeWidth + 'px' }">
      <div class="cube" v-for="chunk in chunks" :key="chunk.name">
        <div
          :class="{
            uploading: chunk.progress > 0 && chunk.progress < 100,
            success: chunk.progress == 100,
            error: chunk.progress < 0,
          }"
          :style="{ height: chunk.progress + '%' }"
        >
          <i
            class="el-icon-loading"
            style="color: #f56c6c"
            v-if="chunk.progress < 100 && chunk.progress > 0"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sparkMD5 from "spark-md5";
// 一定要是整数，不然后台合并会出错
const CHUNK_SIZE = Math.floor(0.05 * 1024 * 1024);
export default {
  mounted() {
    this.bindEvents();
  },
  data() {
    return {
      file: null,
      hashProgress: 0,
      chunks: [],
    };
  },
  computed: {
    cubeWidth() {
      return Math.ceil(Math.sqrt(this.chunks.length)) * 50;
    },
    uploadProgress() {
      if (!this.file || this.chunks.length) {
        return 0;
      }
      const loaded = this.chunks
        .map((item) => item.chunk.size * item.progress)
        .reduce((acc, cur) => acc + cur, 0);
      return parseInt(((loaded * 100) / this.file.size).toFixed(2));
    },
  },
  methods: {
    bindEvents() {
      const drag = this.$refs.drag;
      drag.addEventListener("dragover", function (e) {
        drag.style.borderColor = "red";
        e.preventDefault();
      });
      drag.addEventListener("dragleave", function (e) {
        drag.style.borderColor = "#999";
        e.preventDefault();
      });
      drag.addEventListener("drop", (e) => {
        drag.style.borderColor = "#999";
        this.file = e.dataTransfer.files[0];
        console.log(e.dataTransfer.files[0]);
        e.preventDefault();
      });
    },
    handleFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      this.file = file;
    },
    async calcHashSampling() {
      let file = this.file;
      return new Promise((resolve) => {
        const spark = new sparkMD5.ArrayBuffer();
        const read = new FileReader();
        //2m为单位，头部取2m，中间的取前中后2个字节，余下的尾部的全要
        let offset = 2 * 1024 * 1024;
        let chunks = [file.slice(0, offset)];
        let cur = offset;
        while (cur < file.length) {
          // 尾巴
          if (cur + offset >= size) {
            chunks.push(file.slice(cur, cur + offset));
          } else {
            // 中间区块，取对应的前中后2字节
            let mid = (cur + offset) >> 1;
            let end = cur + offset;
            chunks.push(file.slice(cur, cur + 2));
            chunks.push(file.slice(mid, mid + 2));
            chunks.push(file.slice(end - 2, end));
          }
          cur += offset;
        }
        read.readAsArrayBuffer(new Blob(chunks));
        read.onload = (e) => {
          spark.append(e.target.result);
          resolve(spark.end());
        };
      });
    },
    createFileChunk(file, size = CHUNK_SIZE) {
      let chunks = [];
      let i = 0;
      while (i < file.size) {
        chunks.push({
          index: i,
          file: file.slice(i, i + size),
        });
        i += size;
      }
      return chunks;
    },
    async uploadFile() {
      if (!this.file) {
        this.hashProgress = 0;
        return;
      }
      let chunks = this.createFileChunk(this.file, CHUNK_SIZE);
      console.log("chunks:", this.chunks);
      let hash = await this.calcHashSampling();
      console.log("hash:", hash);
      let {
        data: { uploaded, uploadedList },
      } = await this.$http.post("/checkfile", {
        hash: hash,
        ext: this.file.name.split(".").pop(),
      });
      console.log(uploaded, uploadedList);
      if (uploaded) {
        return this.$message.success("秒传成功");
      }
      this.chunks = chunks.map((x, i) => {
        let name = hash + "-" + i;
        return {
          hash,
          name,
          i,
          chunk: x.file,
          progress: uploadedList.indexOf(name) > -1 ? 100 : 0,
        };
      });

      await this.uploadChunks(hash);
    },
    async uploadChunks(hash) {
      let req = this.chunks
        .filter((chunk) => chunk.progress != 100)
        .map((chunk) => {
          let form = new FormData();
          form.append("name", chunk.name);
          form.append("chunk", chunk.chunk);
          form.append("hash", chunk.hash);
          return { form, i: chunk.i ,error:0};
        });
      // .map(({form:f,i}) => {
      //   return this.$http.post("/uploadfiles", f, {
      //     onUploadProgress: (progress) => {
      //       console.log(Number(
      //         ((progress.loaded / progress.total) * 100).toFixed(2)
      //       ));
      //       // 对应每个切片的进度条,计算出总的进度
      //       this.chunks[i].progress = Number(
      //         ((progress.loaded / progress.total) * 100).toFixed(2)
      //       );
      //     },
      //   });
      // });
      //并发控制
      // await Promise.all(req);
      await this.sendRequest(req);
      await this.mergeChunks(hash);
    },
    async sendRequest(req, concurrent = 3) {
      return new Promise((resolve, reject) => {
        let len = req.length;
        let cut = 0;
        let stop = false
        const start =async () => {
          // 某个任务失败三次 直接结束上传
          if(stop)return
          // 从头部弹出任务
          let task = req.shift();
          // 执行任务
          if (task) {
            let { form, i } = task;
            try {
              await this.$http.post("/uploadfiles", form, {
                onUploadProgress: (progress) => {
                  // 对应每个切片的进度条,计算出总的进度
                  this.chunks[i].progress = Number(
                    ((progress.loaded / progress.total) * 100).toFixed(2)
                  );
                },
              });
              if (cut == len - 1) {
                resolve();
              } else {
                cut++;
                start();
              }
            } catch (e) {
              // 失败重试
              this.chunks[i].progress=-1
              if(task.error<3){
                task.error++
                req.unshift(task)
                start()
              }else{
                // 失败三次
                stop=true
                reject()
              }
            }
          }
        };
        while (concurrent > 0) {
          start();
          concurrent--;
        }
      });
    },
    mergeChunks(hash) {
      this.$http.post("mergechunks", {
        ext: this.file.name.split(".").pop(),
        size: CHUNK_SIZE,
        hash: hash,
      });
    },
  },
};
</script>
<style>
#drag {
  height: 100px;
  line-height: 100px;
  border: 2px dashed #eee;
  text-align: center;
}
.cube-container .cube {
  width: 48px;
  height: 48px;
  line-height: 48px;
  border: 1px black solid;
  background: #eee;
  float: left;
}
.cube-container .cube > .success {
  background: green;
}
.cube-container .cube > .uploading {
  background: blue;
}
.cube-container .cube > .error {
  background: red;
}
</style>