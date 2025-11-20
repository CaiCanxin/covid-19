<template>
  <div
    class="main-map-chart"
    ref="dataMap"
    style="width: 100%; height: 100%"
   />
</template>
<script>
import '../../assets/china'
let chart = null
export default {
  props: {
    title: String,
    list: Array
  },
  data () {
    return {
      config: {}
    }
  },
  methods: {
    initChart () {
      if (null != chart && undefined != chart) {
        chart.dispose()
      }
      chart = this.$echarts.init(this.$refs.dataMap)
      this.setOptions()
    },
    setOptions() {
      let option = {
        backgroundColor: 'transparent',
        tooltip: {
          triggerOn: 'click',
          formatter: function (e, t, n) {
            return 0.5 == e.value ? e.name + '：有疑似病例' : e.seriesName + '<br />' + e.name + '：' + e.value;
          },
        },
        title: {
          text: this.title,
          top: 50,
          left: 'center',
          textStyle: {
            fontWeight: 'bolder',
            fontSize: 24,
            color: '#0d47a1'
          }
        },
        visualMap: {
          min: 0,
          max: 1000,
          left: 26,
          bottom: 40,
          showLabel: !0,
          textStyle: {
            color: '#424242',
            fontWeight: '500'
          },
          // 图例
          pieces: [
            {
              gt: 5000,
              label: '> 5000 人',
              color: '#850a35',
            },
            {
              gte: 2000,
              lte: 5000,
              label: '2000 - 5000 人',
              color: '#850a5a',
            },
            {
              gte: 1000,
              lte: 2000,
              label: '1000 - 2000 人',
              color: '#88296d',
            },
            {
              gte: 500,
              lte: 1000,
              label: '500 - 1000 人',
              color: '#6d2988',
            },
            {
              gte: 300,
              lte: 500,
              label: '300 - 500 人',
              color: '#4f2988',
            },
            {
              gte: 200,
              lt: 300,
              label: '200 - 300 人',
              color: '#352b7c',
            },
            {
              gt: 100,
              lt: 200,
              label: '100 - 200 人',
              color: '#2b3260'
            },
            {
              gt: 0,
              lt: 100,
              label: '< 100 人',
              color: '#e3f2fd',
            },
            {
              gt: 0,
              lt: 50,
              label: '< 50 人',
              color: '#f5f5f5',
            },
          ],
          show: !0,
        },
        geo: {
          map: 'china',
          roam: true, // 开启缩放和平移
          scaleLimit: {
            min: 1, // 最小缩放
            max: 3, // 最大缩放
          },
          zoom: 1.23, // 当前视角的缩放比例
          top: 120,
          label: {
            normal: {
              show: !0,
              fontSize: '14',
              color: '#424242',
              fontWeight: '500'
            },
          },
          itemStyle: {
            normal: {
              areaColor: '#e3f2fd',
              shadowBlur: 6,
              shadowColor: 'rgba(33, 150, 243, 0.2)',
              borderColor: 'rgba(33, 150, 243, 0.5)',
              borderWidth: 1
            },
            emphasis: {
              areaColor: '#bbdefb',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              borderWidth: 2,
              borderColor: '#1976d2'
            },
          }
        },
        series: [
          {
            name: '确诊病例',
            type: 'map',
            geoIndex: 0,
            data: this.list
          }
        ],
      }
      chart.setOption(option)
    }
  },
  watch: {
    list: {
      handler (newValue, oldValue) {
        if (oldValue != newValue) {
          this.setOptions()
        }
      },
      deep: true
    }
  }
}
</script>