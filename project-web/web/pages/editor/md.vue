<template>
  <div class="container">
    <el-button class="btn" @click="submit" type="primary">提交</el-button>
    <el-row>
      <el-col :span="12">
        <!-- markdown编辑器的基本操作 -->
        <textarea ref="editor" class="md-editor" :value="content" @input="update"></textarea>
      </el-col>
      <el-col :span="12">
        <div class="markdown-body" v-html="compiledContent"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { marked } from 'marked'
import hljs from 'highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/monokai-sublime.css'
export default {
  methods: {
    async submit() {

    },
    update(e) {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.content = e.target.value
      }, 350)
    },
    bindEvents() {
      this.$refs.editor.addEventListener('paste', async e => {
        const files = e.clipboardData.files
        console.log(files)
        // 直接上传
      })
      this.$refs.editor.addEventListener('drop', async e => {
        const files = e.dataTransfer.files
        console.log(files)
        // @todo 文件上传
        e.preventDefault()
      })
    }
  },
  computed: {
    compiledContent() {
      // return this.content
      return marked(this.content, {})
    },

  },
  mounted() {
    this.timer = null
    this.bindEvents()
    marked.setOptions({
      rendered: new marked.Renderer(),
      highlight(code) {
        return hljs.highlightAuto(code).value
      }
    })
  },
  data() {
    return {
      content: `# 随机数${String(Math.random()).slice(2,6)}`
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}
.md-editor {
  width: 100%;
  height: 80vh;
  outline: none;
  resize: none;
}
.btn {
  position: fixed;
  right: 40px;
  top: 20px;
}


</style>