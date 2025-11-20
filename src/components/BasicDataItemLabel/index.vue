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

const getNumberStyle = (color = '#1565c0', fontSize = 30, fontWeight = 'bolder') => {
  return {
    fontSize: fontSize,
    fill: color || '#1565c0',
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(227, 242, 253, 0.95));
  margin: 0 5px 5px 5px;
  padding: 15px 10px 10px 10px;
  border-radius: 8px;
  border: 1px solid rgba(33, 150, 243, 0.3);
  box-shadow: 0 2px 12px rgba(33, 150, 243, 0.15);
}
.incremento-up-value {
  color: #4caf50;
  font-weight: bold;
}
.incremento-down-value {
  color: #f44336;
  font-weight: bold;
}
.basic-data-item-title {
  color: #424242;
  font-size: 14px;
  padding-bottom: 5px;
  font-weight: 600;
}
.basic-data-item-value {
  color: #1976d2;
  font-size: 40px;
  font-weight: bolder;
}
</style>