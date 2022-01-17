<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'vue 异常监控',
  props: {
    msg: String
  },
  mounted() {
    xxx()
  }
}
</script>

<style scoped>
</style>
