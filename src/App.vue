<template>
  <div id="app">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
    // DataV
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
body {
  background: #f0f4f8;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* 全局DataV组件样式覆盖 - 确保在亮色背景下可见 */
.dv-scroll-board .rows {
  color: #212121 !important;
}

.dv-scroll-board .rows .row-item {
  color: #212121 !important;
}

.dv-scroll-board .header {
  color: #0d47a1 !important;
}

.dv-scroll-board .header .header-item {
  color: #0d47a1 !important;
  font-weight: bold !important;
}

.dv-digital-flop svg text {
  fill: #0d47a1 !important;
}
</style>
