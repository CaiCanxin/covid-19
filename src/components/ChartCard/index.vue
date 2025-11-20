<template>
  <div :class="`chart-card ${customClass ? customClass : ''}`">
   <div v-if="$slots.title">
     <slot name="title"></slot>
   </div>
   <div v-else class="chart-item-title">
      <i :class="icon" v-if="icon"></i>
      <span class="title-text">{{ title }}</span>
    </div>
   <div :class="`chart-item-container ${innerClass ? innerClass : ''}`">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    innerClass: String,
    customClass: String,
    icon: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.chart-item-title {
  color: #1565c0;
  font-size: 17px;
  font-weight: bold;
  padding: 10px 10px 10px 20px;
  text-align: left;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}
.chart-item-title .title-text {
  margin-left: 8px;
}
</style>