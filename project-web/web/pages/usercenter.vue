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
    <h1>用户中心</h1>
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
  </div>
</template>

<script>
import sparkMD5 from "spark-md5";
const CHUNK_SIZE = 10 * 1024 * 1024;
export default {
  async mounted() {
    const res = await this.$http.get("/user/info");
    // console.log(res);
    this.bindEvents();
  },
  data() {
    return {
      file: null,
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
    async uploadFile() {
      if (!this.file) {
        return;
      }
      let isImg = await this.isImage(this.file)
      if(!isImg){
        this.$message.error('只支持gif、png、jpg、jpeg格式图片');
        return
      }
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
    async blobToString(blob) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function () {
          const ret = reader.result
            .split("")
            .map((v) => v.charCodeAt())
            .map((v) => {
              let x = v.toString(16).toUpperCase()
              if(x.length==1){
                x = "0"+x
              }
              return x
            })
            .join(" ");
            console.log(reader.result
            .split("")
            .map((v) => v.charCodeAt())
            .map((v) => v.toString(16).toUpperCase()));
          resolve(ret);
        };
        reader.readAsBinaryString(blob);
      });
    },
    async isImage(file) {
      return (
        (await this.isGif(file)) ||
        (await this.isPng(file)) ||
        (await this.isJpg(file))
      );
    },
    async isGif(file) {
      let ret = await this.blobToString(file.slice(0, 6));
      console.log('isGif:',ret);
      console.log('isGif:',ret == "47 49 46 38 39 61" || ret == "47 49 46 38 37 61")
      return ret == "47 49 46 38 39 61" || ret == "47 49 46 38 37 61"
    },
    async isPng(file) {
      const ret = await this.blobToString(file.slice(0, 8));
      console.log('isPng:',ret);
      console.log('isPng:',ret == "89 50 4E 47 0D 0A 1A 0A");
      return ret == "89 50 4E 47 0D 0A 1A 0A"
    },
    async isJpg(file) {
      const start = await this.blobToString(file.slice(0, 2));
      const tail = await this.blobToString(file.slice(-2, file.size));
      console.log('isJpg:',start,tail);
      console.log('isJpg:',start == "FF D8" && tail == "FF D9");
      return start == "FF D8" && tail == "FF D9"
    },
  },
};
</script>