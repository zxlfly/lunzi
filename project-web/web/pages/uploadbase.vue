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
        :percentage="hashProgress"
      ></el-progress>
    </div>
    <div>
      <el-button @click="uploadFile">上传头像</el-button>
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
      uploadProgress: 0,
    };
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
    createFileChunk(file,size = CHUNK_SIZE){
      let chunks = []
      let i =0
      while(i<file.size){
        chunks.push({
          index:i,
          file:file.slice(i,i+size)
        })
        i += size
      }
      return chunks
    },
    // 使用requestIdleCallback
    async calcHashRequestIdleCallback(){
      let chunks = this.chunks
      return new Promise(resolve=>{
        const spark = new sparkMD5.ArrayBuffer()
        let count = 0
        const appendToSpark = async file =>{
          return new Promise(resolve=>{
            const read = new FileReader()
            read.readAsArrayBuffer(file)
            read.onload=e=>{
              spark.append(e.target.result)
              resolve()
            }
          })
        }
        const workloop = async deadline=>{
          // timeRemaining获取当前帧的剩余时间
          while(count<chunks.length&&deadline.timeRemaining()>1){
            // 有任务且有时间
            await appendToSpark(chunks[count].file)
            count++
            if(count<chunks.length){
              this.hashProgress=Number((100*count)/chunks.length.toFixed(2))
            }else{
              this.hashProgress=100
              resolve(spark.end())
            }
          }
          window.requestIdleCallback(workloop)
        }
        window.requestIdleCallback(workloop)
      })
      
    },
    // 使用子线程
    async calcHashWorker(){
      return new Promise(resolve=>{
        this.worker = new Worker('/hash.js')
        this.worker.postMessage({chunks:this.chunks})
        this.worker.onmessage = e=>{
          let {progress,hash} = e.data
          this.hashProgress=Number(progress.toFixed(2))
          if(hash){
            resolve(hash)
          }
        }
      })
    },
    async uploadFile() {
      if (!this.file) {
        this.hashProgress=0
        return;
      }
      this.chunks = this.createFileChunk(this.file,CHUNK_SIZE)
      console.log('chunks:',this.chunks)
      // 使用worker计算md5
      let hash = await this.calcHashWorker()
      let hash2 = await this.calcHashRequestIdleCallback()
      console.log('hash:',hash);
      console.log('hash2:',hash2);
      return 
      let form = new FormData();
      form.append("name", "file");
      form.append("file", this.file);
      let res = this.$http.post("/uploadfile", form, {
        onUploadProgress: (progress) => {
          this.uploadProgress = Number(
            ((progress.loaded / progress.total) * 100).toFixed(2)
          );
        },
      });
      console.log(res);
    },
  },
};
</script>