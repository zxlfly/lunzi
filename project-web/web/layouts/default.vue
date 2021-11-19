<template>
  <el-container>
    <!-- <div>
        {{userinfo}}
    </div>-->
    <el-header>
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1">
          <nuxt-link to="/">首页</nuxt-link>
        </el-menu-item>

        <el-menu-item v-if="userinfo.id" index="3" class="pull-right">
          <a @click="logout">退出</a>
        </el-menu-item>
        <el-menu-item v-if="userinfo.id" index="4" class="pull-right">
          <!-- <UserDisplay :user="userinfo">

          </UserDisplay>-->
        </el-menu-item>

        <el-menu-item v-if="userinfo.id" index="3" class="pull-right">
          <nuxt-link to="/editor/new">
            <el-button type="primary">写文章</el-button>
          </nuxt-link>
        </el-menu-item>

        <el-menu-item v-if="!userinfo.id" index="2" class="pull-right">
          <nuxt-link to="/register">注册</nuxt-link>
        </el-menu-item>

        <el-menu-item v-if="!userinfo.id" index="3" class="pull-right">
          <nuxt-link to="/login">登录</nuxt-link>
        </el-menu-item>
      </el-menu>
    </el-header>

    <el-main>
      <nuxt />
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>
<script>
export default {
  data: () => {
    return {
      userinfo: {}
    }
  }
}
</script>
<style>
</style>