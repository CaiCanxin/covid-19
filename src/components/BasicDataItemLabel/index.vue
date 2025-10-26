<template>
  <div class="basic-data-item">
    <div class="basic-data-item-title">{{ label }}
      <i v-if="data.incrValue > 0" class="el-icon-caret-top" style="color: #60FE5E;"></i>
      <i v-else class="el-icon-caret-bottom" style="color: #F44182;"></i>
      <span :class="[ data.incrValue > 0 ? valueUpClass: valueDownClass, valueClass]">
        {{ data.incrValue }}
      </span>
    </div>
    <div class="basic-data-item-value">
      <dv-digital-flop
        :config="config"
        style="width: 140px; height: 50px"
      />
    </div>
  </div>
</template>
<script>

const getNumberStyle = (color = '#E8EAF6', fontSize = 30, fontWeight = 'bolder') => {
  return {
    fontSize: fontSize,
    fill: color,
    fontWeight: fontWeight
  }
}

export default {
  props: {
    label: String,
    data: {
      value: Number,
      incrValue: Number,
      color: String
    },
  },
  computed: {
    config() {
      return {
        number: [this.data.value],
        content: '{nt}',
        style: getNumberStyle(this.data.color),
      }
    }
  },
  data() {
    return {
      valueUpClass: 'incremento-up-value',
      valueDownClass: 'incremento-down-value',
      valueClass: 'basic-data-item-incremento-value'
    }
  }
}
</script>
<style scoped>
.basic-data-item {
  background: #0f142b;
  margin: 0 5px 5px 5px;
  padding: 15px 10px 10px 10px;
  border-radius: 5px;
}
.incremento-up-value {
  color: #60FE5E;
}
.incremento-down-value {
  color: #F44182;
}
.basic-data-item-title {
  color: #bcbcbe;
  font-size: 14px;
  padding-bottom: 5px;
}
.basic-data-item-value {
  color: #fff;
  font-size: 40px;
  font-weight: bolder;
}
</style>