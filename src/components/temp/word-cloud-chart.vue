<template>
  <div class="word-cloud-wrapper">
    <div ref="chartContainer" class="word-cloud-chart"></div>

    <!-- 时间滑动块：当传入 timeline 和 seriesMap 时启用 -->
    <div v-if="hasTimeline" class="time-slider">
      <div class="time-info">{{ currentDateLabel }}</div>
      <input
        type="range"
        :min="0"
        :max="timeline.length - 1"
        v-model.number="currentIndex"
        @input="handleSliderChange"
      />
      <div class="time-range">
        <span>{{ timeline[0] }}</span>
        <span>{{ timeline[timeline.length - 1] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-wordcloud';

export default {
  name: 'WordCloudChart',
  props: {
    data: {
      type: Array,
      default: () => []
    }
    ,
    // 可选：时间线数组（日期字符串），例如 ['2020-01-01', ...]
    timeline: {
      type: Array,
      default: () => []
    },
    // 可选：按日期映射到词云数据的对象，key 为 timeline 中的日期字符串，value 为数组（与 data 相同格式）
    seriesMap: {
      type: Object,
      default: () => ({})
    },
    // 最大词数，避免拥挤重叠
    maxWords: {
      type: Number,
      default: 80
    },
    // 词云字号范围
    sizeRange: {
      type: Array,
      default: () => [12, 48]
    },
    // 旋转角度范围与步长（默认为水平，减少重叠）
    rotationRange: {
      type: Array,
      default: () => [0, 0]
    },
    rotationStep: {
      type: Number,
      default: 0
    },
    // 网格大小（越大越不易重叠，但排布更稀疏）
    gridSize: {
      type: Number,
      default: 12
    }
  },
  data() {
    return {
      chart: null
      ,currentIndex: 0
    }
  },
  watch: {
    data: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
    ,
    // 当滑块索引变更时更新图表
    currentIndex() {
      this.updateChart()
    },
    // 当 timeline/seriesMap 更新时，重置索引并刷新
    timeline: {
      handler() {
        if (this.currentIndex >= this.timeline.length) this.currentIndex = Math.max(0, this.timeline.length - 1)
        this.updateChart()
      },
      deep: true
    },
    seriesMap: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  mounted() {
    // 初始化图表
    this.initChart()
  },
  methods: {
    initChart() {
      if (this.chart) {
        this.chart.dispose()
      }
      
      this.chart = echarts.init(this.$refs.chartContainer)
      this.updateChart()
      
      // 响应式
      window.addEventListener('resize', this.handleResize)
    },
    updateChart() {
      // 选择当前要展示的数据：优先使用 seriesMap + timeline，其次使用单帧 data
      const hasTimeline = this.timeline && this.timeline.length && this.seriesMap && Object.keys(this.seriesMap).length
      const raw = hasTimeline ? (this.seriesMap[this.timeline[this.currentIndex]] || []) : this.data
      const dataToUse = this.prepareData(raw)
      if (!this.chart || !dataToUse || !dataToUse.length) return
      
      const option = {
        tooltip: {
          show: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#667eea',
          borderWidth: 1,
          textStyle: {
            color: '#fff'
          },
          formatter: (params) => {
            return `${params.name}: ${params.value}`
          }
        },
        series: [{
          type: 'wordCloud',
          shape: 'circle',
          keepAspect: false,
          left: 'center',
          top: 'center',
          width: '90%',
          height: '90%',
          right: null,
          bottom: null,
          sizeRange: this.sizeRange,
          rotationRange: this.rotationRange,
          rotationStep: this.rotationStep,
          gridSize: this.gridSize,
          drawOutOfBound: false,
          layoutAnimation: true,
          textStyle: {
            fontFamily: 'Microsoft YaHei, sans-serif',
            fontWeight: 'bold',
            color: (params) => this.getStableColor(params.name)
          },
          emphasis: {
            focus: 'self',
            textStyle: {
              textShadowBlur: 10,
              textShadowColor: '#00d4ff'
            }
          },
          data: dataToUse
        }]
      }
      
      this.chart.setOption(option, true)
    },
    // 预处理：取 TopN，并做简单归一化，减少重叠与极端值影响
    prepareData(raw) {
      if (!raw || !raw.length) return []
      // 排序并截断
      const sorted = [...raw]
        .filter(d => d && d.name && typeof d.value === 'number')
        .sort((a, b) => b.value - a.value)
        .slice(0, this.maxWords)

      // 归一化到 [1, 100] 区间，避免极端差距
      const values = sorted.map(d => d.value)
      const min = Math.min(...values)
      const max = Math.max(...values)
      const span = Math.max(1, max - min)
      return sorted.map(d => ({
        name: d.name,
        value: Math.round(((d.value - min) / span) * 99 + 1)
      }))
    },
    // 基于名称的稳定颜色，避免每次刷新颜色变化导致视觉抖动
    getStableColor(str) {
      const palette = [
        '#00d4ff', '#00a8ff', '#0077ff',
        '#667eea', '#764ba2', '#f093fb',
        '#4facfe', '#00f2fe', '#43e97b',
        '#fa709a', '#fee140', '#30cfd0'
      ]
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash |= 0
      }
      const idx = Math.abs(hash) % palette.length
      return palette[idx]
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    }
    ,
    handleSliderChange() {
      // v-model 已更新 currentIndex，updateChart 在 watcher 中触发
      // 这里只做防抖或其他逻辑的占位
    }
  },
  computed: {
    hasTimeline() {
      return this.timeline && this.timeline.length && this.seriesMap && Object.keys(this.seriesMap).length
    },
    currentDateLabel() {
      if (!this.hasTimeline) return ''
      return this.timeline[this.currentIndex] || ''
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped>
.word-cloud-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.word-cloud-chart {
  width: 100%;
  /* 由外层容器控制总高度，这里占据剩余空间 */
  flex: 1 1 auto;
}

.time-slider {
  padding: 8px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.time-info {
  text-align: center;
  font-size: 13px;
  color: #333;
  margin-bottom: 6px;
}
.time-slider input[type="range"] {
  width: 100%;
}
.time-range {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
</style>