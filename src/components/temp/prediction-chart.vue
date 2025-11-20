<template>
  <div ref="chartContainer" class="prediction-chart"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'PredictionChart',
  props: {
    data: {
      type: Object,
      default: () => ({
        dateList: [],
        actualData: [],
        predictedData: []
      })
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    data: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  methods: {
    initChart() {
      if (this.chart) {
        this.chart.dispose()
      }
      
      this.chart = echarts.init(this.$refs.chartContainer)
      this.updateChart()
      
      window.addEventListener('resize', this.handleResize)
    },
    updateChart() {
      if (!this.chart) return
      
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#667eea',
          borderWidth: 1,
          textStyle: {
            color: '#fff'
          },
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#667eea'
            }
          }
        },
        legend: {
          data: ['实际数据', '预测数据'],
          textStyle: {
            color: '#a0d8ef'
          },
          top: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.data.dateList,
          axisLine: {
            lineStyle: {
              color: 'rgba(102, 126, 234, 0.3)'
            }
          },
          axisLabel: {
            color: '#a0d8ef',
            interval: 4
          }
        },
        yAxis: {
          type: 'value',
          name: '病例数',
          nameTextStyle: {
            color: '#a0d8ef'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(102, 126, 234, 0.3)'
            }
          },
          axisLabel: {
            color: '#a0d8ef',
            formatter: '{value}'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(102, 126, 234, 0.1)'
            }
          }
        },
        series: [
          {
            name: '实际数据',
            type: 'line',
            data: this.data.actualData,
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
              width: 3,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#00d4ff' },
                { offset: 1, color: '#0077ff' }
              ])
            },
            itemStyle: {
              color: '#00d4ff',
              borderWidth: 2,
              borderColor: '#fff'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
                { offset: 1, color: 'rgba(0, 212, 255, 0.05)' }
              ])
            }
          },
          {
            name: '预测数据',
            type: 'line',
            data: this.data.predictedData,
            smooth: true,
            symbol: 'diamond',
            symbolSize: 6,
            lineStyle: {
              width: 3,
              type: 'dashed',
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#ff6348' },
                { offset: 1, color: '#ff4757' }
              ])
            },
            itemStyle: {
              color: '#ff4757',
              borderWidth: 2,
              borderColor: '#fff'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 71, 87, 0.2)' },
                { offset: 1, color: 'rgba(255, 71, 87, 0.05)' }
              ])
            }
          }
        ]
      }
      
      this.chart.setOption(option, true)
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
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
.prediction-chart {
  width: 100%;
  height: 100%;
}
</style>