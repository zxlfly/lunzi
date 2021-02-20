<template>
  <div>
    <!-- <div>
      导航
    </div> -->
    <nuxt></nuxt>
    <!-- <div>底部信息</div> -->
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus">
.login-container
  width 100%
  min-height 100%
  .login-form
    width 520px
    padding 160px 35px 0
    margin 0 auto
    overflow hidden
  .title-container
    text-align center
    margin-bottom 20px
    img
      width 200px
  .captcha-container
    width 340px 
    position relative
    .el-button
      width 90px
      padding 0
      line-height 40px
    .captcha
      position absolute
      right -110px
      img
        width 90px
        height 50px
        cursor pointer
</style>