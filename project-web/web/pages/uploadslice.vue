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
const CHUNK_SIZE = 0.5 * 1024 * 1024;
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
      this.chunks = chunks.map((x, i) => {
        let name = hash + "-" + i;
        return {
          hash,
          name,
          i,
          chunk: x.file,
          progress:0
        };
      });
      this.uploadChunks(hash);
    },
    async uploadChunks(hash) {
      let req = this.chunks
        .map((x, i) => {
          let form = new FormData();
          form.append("name", x.name);
          form.append("chunk", x.chunk);
          form.append("hash", x.hash);
          return form;
        })
        .map((f, i) => {
          return this.$http.post("/uploadfiles", f, {
            onUploadProgress: (progress) => {
              console.log(Number(
                ((progress.loaded / progress.total) * 100).toFixed(2)
              ));
              // 对应每个切片的进度条,计算出总的进度
              this.chunks[i].progress = Number(
                ((progress.loaded / progress.total) * 100).toFixed(2)
              );
            },
          });
        });
      // @todo并发控制
      await Promise.all(req);
      await this.mergeChunks(hash)
    },
    mergeChunks(hash){
      this.$http.post('mergechunks',{
        ext:this.file.name.split('.').pop(),
        size:CHUNK_SIZE,
        hash:hash
      })
    },
  },
};
</script>
<style>
#drag{
    height: 100px;
    line-height :100px;
    border :2px dashed #eee;
    text-align: center ;
}
.cube-container .cube{
    width: 48px;
    height: 48px;
    line-height: 48px;
    border:  1px black solid;
    background: #eee;
    float:  left;
}
.cube-container .cube>.success{
  background:green;
}
.cube-container .cube>.uploading{
  background:blue;
}
.cube-container .cube>.error{
  background:red;
}
</style>