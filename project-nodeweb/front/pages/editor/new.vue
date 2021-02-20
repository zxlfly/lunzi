<template>
  <div>
    <!-- <div contenteditable="true">哈哈</div>
    document.execCommand('') -->
    <!-- 1. 刚开始第三方的
      tinyMce，wangEditor -->
      <!-- 2. 开源的定制  slate.js  -->
      <!-- 3. 又专门的编辑器开发团队，自己定制把，非常复杂，word在线版
        计算位置，定位，样式，实现一个简单的浏览器工作量差不多的 -->
    <div class="write-btn">
      <el-button @click="submit" type='primary'>提交</el-button>
    </div>
    <el-row>
      <el-col :span='12'>
        <!-- markdown编辑器的基本操作 -->
        <textarea ref="editor" class="md-editor" :value="content" @input="update" ></textarea>
      </el-col>
      <el-col :span='12'>
        <div class="markdown-body" v-html="compiledContent"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/monokai-sublime.css'
// monokai-sublime
export default {
  data(){
    return {
      // timer:
      content:`# ${String(Math.random()).slice(2,6)}
* 上课
* 吃饭
* 写代码

\`\`\`javascript

  let a =1;
  console.log(a)
\`\`\`
      `
      
    }
  },
  mounted(){
    this.timer = null
    this.bindEvents()
    
    marked.setOptions({
      rendered: new marked.Renderer(),
      highlight(code){
        return hljs.highlightAuto(code).value
      }
      // ..
    })
  },
  computed:{
    compiledContent(){
      return marked(this.content, {})
    }
  },
  // lodash/debounce


  


  methods:{
    bindEvents(){
      this.$refs.editor.addEventListener('paste',async e=>{
        const files = e.clipboardData.files
        console.log(files)
        // 直接上传
      })
      this.$refs.editor.addEventListener('drop', async e=>{
        const files = e.dataTransfer.files
        console.log(files)
        // @todo 文件上传
        e.preventDefault()
      })
    },
    update(e){
      clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        this.content = e.target.value
      },350)
    },
    async submit(){
      // 文章列表，点赞，关注，草稿
      // user =》 aticle  一对多
      let ret = await this.$http.post('/article/create', {
        content:this.content, //  selected:false
        compiledContent:this.compiledContent // 显示只读取这个
      })
      if(ret.code==0){
        this.$notify({
          title:'创建成功',
          type:'success',
          message:`文章《${ret.data.title}》创建成功`
        })
        setTimeout(()=>{
          this.$router.push({ path:'/article/'+ret.data.id})
        })
      }
    }
  }
}
</script>

<style>
.markdown-body pre{
  /* background:#23241f; */
  /* color:#f92672; */
}
.md-editor{
  width:100%;
  height:100vh;
  outline: none;
}
.write-btn{
  position: fixed;
  z-index:100;
  right:30px;
  top:10px;
}
</style>