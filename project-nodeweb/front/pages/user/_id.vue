<template>
  <div class="kkb-container">
    <h1>用户中心</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane :label='"关注"+following.length' name="following">
        <div v-for="user in following" :key="user._id">
          <UserDisplay :user="user"></UserDisplay>
        </div>
      </el-tab-pane>
      <el-tab-pane :label='"粉丝"+followers.length' name="followers">
        <div v-for="user in followers" :key="user._id">
            <UserDisplay :user="user"></UserDisplay>
          </div>
        </el-tab-pane>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import UserDisplay from '~/components/UserDisplay.vue'
export default {
  data(){
    return {
      activeName:'following',
      following:[],
      followers:[]
    }
  },
  components:{UserDisplay},
  mounted(){
    let userid = this.$route.params.id
    this.userid = userid
    if(userid){
      // 加载关注的人
      this.loadFollowing()
      // 加载粉丝
      this.loadFollowers()
      // 加载文章
      this.loadArticles()
    }
  },
  methods:{
    async loadFollowing(){
      let ret = await this.$http.get(`/user/${this.userid}/following`)
      if(ret.code==0){
        this.following = ret.data
      }
    },
    async loadFollowers(){
      let ret = await this.$http.get(`/user/${this.userid}/followers`)
      if(ret.code==0){
        this.followers = ret.data
      }
    },
    loadArticles(){},
  }
}
</script>

<style>

</style>