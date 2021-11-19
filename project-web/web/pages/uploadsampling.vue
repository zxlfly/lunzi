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
    async calcHashSampling(){
      let file = this.file
      return new Promise(resolve=>{
        const spark = new sparkMD5.ArrayBuffer()
        const read = new FileReader()
        //2m为单位，头部取2m，中间的取前中后2个字节，余下的尾部的全要
        let offset = 2*1024*1024
        let chunks = [file.slice(0,offset)]
        let cur = offset
        while(cur<file.length){
          // 尾巴
          if(cur+offset>=size){
            chunks.push(file.slice(cur,cur+offset))
          }else{
            // 中间区块，取对应的前中后2字节
            let mid = (cur+offset)>>1
            let end = cur+offset
            chunks.push(file.slice(cur,cur+2))
            chunks.push(file.slice(mid,mid+2))
            chunks.push(file.slice(end-2,end))
          }
          cur+=offset
        }
        read.readAsArrayBuffer(new Blob(chunks))
        read.onload=e=>{
          spark.append(e.target.result)
          resolve(spark.end())
        }
      })
    },
    async uploadFile() {
      if (!this.file) {
        this.hashProgress=0
        return;
      }
      let hash = await this.calcHashSampling()
      console.log('hash:',hash);
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