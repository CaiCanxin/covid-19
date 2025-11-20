<template>
  <div ref="chart" :style="{ width: '100%', height: '100%' }"></div>
</template>

<script>
import { LineChart } from 'echarts/charts';
import {
    GridComponent,
    TitleComponent,
    TooltipComponent,
    VisualMapComponent
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  LineChart,
  CanvasRenderer
]);

export default {
  name: 'SentimentLineChart',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({ dateList: [], sentimentData: [] })
    }
  },
  data() {
    return {
      chartInstance: null
    };
  },
  methods: {
    initChart() {
      if (this.chartInstance) {
        this.chartInstance.dispose();
      }
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption(this.getChartOption());
    },
    getChartOption() {
      return {
        tooltip: {
          trigger: 'axis',
          formatter: '日期: {b}<br/>情感指数: {c}',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#2196f3',
          borderWidth: 1,
          textStyle: {
            color: '#333'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.data.dateList,
          axisLabel: {
            rotate: 30,
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 1,
          splitLine: {
            lineStyle: {
              color: '#eee'
            }
          },
          axisLabel: {
            formatter: '{value}',
            color: '#666'
          }
        },
        markLine: {
          data: [
            {
              yAxis: 0.6,
              name: '基准线',
              lineStyle: {
                color: '#ff9800',
                type: 'dashed',
                width: 2
              },
              label: {
                show: true,
                formatter: '基准线: 0.6',
                position: 'end',
                color: '#ff9800',
                fontSize: 12
              }
            }
          ]
        },
        visualMap: {
          show: false,
          pieces: [{
            gt: 0,
            lte: 0.5,
            color: '#ff6b6b'
          }, {
            gt: 0.5,
            lte: 1,
            color: '#4dabf7'
          }],
          outOfRange: {
            color: '#999'
          }
        },
        series: [
          {
            name: '情感指数',
            type: 'line',
            smooth: true,
            data: this.data.sentimentData,
            symbolSize: 8,
            lineStyle: {
              width: 3
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(77, 171, 247, 0.4)'
              }, {
                offset: 1,
                color: 'rgba(255, 107, 107, 0.4)'
              }])
            },
            markLine: {
              silent: true,
              data: [
                {
                  yAxis: 0.6,
                  name: '基准线',
                  lineStyle: {
                    color: '#ff9800',
                    type: 'dashed',
                    width: 2
                  },
                  label: {
                    show: true,
                    formatter: '基准线: 0.6',
                    position: 'end',
                    color: '#ff9800',
                    fontSize: 12
                  }
                }
              ]
            }
          }
        ]
      };
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        if (this.chartInstance) {
          this.chartInstance.setOption(this.getChartOption());
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
    window.addEventListener('resize', () => {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    });
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }
};
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
}
</style>
