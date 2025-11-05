<template>
  <div class="container">
    <!-- 顶部 -->
    <div class="top-header">
      <div class="title">
        <h1>{{ title }}</h1>
        <div class="top-header-tip">
          <div class="back-btn" @click="navigate('/')">
            <i class="el-icon-back"></i> 返回主页
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="card">
        <h3>全国疫情新增确诊人数日历图</h3>
        <div class="chart-container" style="height:320px;" ref="chartContainer"></div>
      </div>
    </div>

    <div class="card">
      <h3>世界疫情数据曲线图</h3>
      <div class="controls">
        <label>请选择国家：</label>
        <select v-model="selectedCountry" @change="updateLineChart">
          <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
        </select>
      </div>
      <div id="lines" class="chart-container" ref="lineChartContainer"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {worldData, parseWorldCovidData} from '../utils/csvUtil'

export default {
  data() {
    return {
      chartRef: null,
      lineChartRef: null,
      selectedCountry: '中国',
      countries: [],
      countryData: {}
    }
  },
  computed: {
    covidData() {
      return this.countryData;
    }
  },
  methods: {
    // 新增方法：处理 worldData 数据
    processWorldData() {
      const countryData = {};
      // 处理每个国家的数据
      worldData.forEach(dayData => {
        const date = dayData.date;
        dayData.data.forEach(countryItem => {
          const countryName = countryItem.provinceLabel;
          if (!countryData[countryName]) {
            countryData[countryName] = {
              dates: [],
              confirmed: [],
              current: [],
              dead: [],
              healed: []
            };
          }

          countryData[countryName].dates.push(date);
          countryData[countryName].confirmed.push(countryItem.confirmedCount);
          countryData[countryName].current.push(countryItem.currentConfirmedCount);
          countryData[countryName].dead.push(countryItem.deadCount);
          countryData[countryName].healed.push(countryItem.curedCount);
        });
      });

      this.countryData = countryData;
    },
    // 新增方法：初始化国家列表
    initCountries() {
      if (worldData && worldData.length > 0) {
        const allCountries = worldData[30].data.map(item => item.provinceLabel);
        this.countries = allCountries;

        // 设置默认选中国家
        if (allCountries.length > 0 && !allCountries.includes(this.selectedCountry)) {
          this.selectedCountry = allCountries[0];
        }
      }
    },
    navigate(path) {
      this.$router.push(path)
    },
    initLineChart() {
      this.lineChartRef = echarts.init(
          this.$refs.lineChartContainer,
          undefined,
          { renderer: 'canvas' }
      );
      this.updateLineChart();
    },
    updateLineChart() {
      // 确保有数据后再渲染
      if (!this.covidData[this.selectedCountry]) return

      const countryData = this.covidData[this.selectedCountry];

      const option = {
        title: {
          text: `2019-nCoV${this.selectedCountry}疫情数据曲线图`
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['确诊数据', '现存确诊数据', '死亡数据', '治愈数据']
        },
        xAxis: {
          type: 'category',
          data: countryData.dates,
          axisLabel: {
            rotate: -30
          }
        },
        yAxis: {
          type: 'value',
          name: '人数'
        },
        series: [
          {
            name: '确诊数据',
            type: 'line',
            data: countryData.confirmed,
            smooth: true,
            areaStyle: {
              opacity: 0.5
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          },
          {
            name: '现存确诊数据',
            type: 'line',
            data: countryData.current,
            smooth: true,
            areaStyle: {
              opacity: 0.5
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          },
          {
            name: '死亡数据',
            type: 'line',
            data: countryData.dead,
            smooth: true,
            areaStyle: {
              opacity: 0.5
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          },
          {
            name: '治愈数据',
            type: 'line',
            data: countryData.healed,
            smooth: true,
            areaStyle: {
              opacity: 0.5
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          }
        ]
      };

      this.lineChartRef.setOption(option);
    }
  },
  mounted() {

    // 日历热力图初始化
    var heatmapOptions = {
      "animation": true,
      "animationThreshold": 2000,
      "animationDuration": 1000,
      "animationEasing": "cubicOut",
      "animationDelay": 0,
      "animationDurationUpdate": 300,
      "animationEasingUpdate": "cubicOut",
      "animationDelayUpdate": 0,
      "color": [
        "#c23531",
        "#2f4554",
        "#61a0a8",
        "#d48265",
        "#749f83",
        "#ca8622",
        "#bda29a",
        "#6e7074",
        "#546570",
        "#c4ccd3",
        "#f05b72",
        "#ef5b9c",
        "#f47920",
        "#905a3d",
        "#fab27b",
        "#2a5caa",
        "#444693",
        "#726930",
        "#b2d235",
        "#6d8346",
        "#ac6767",
        "#1d953f",
        "#6950a1",
        "#918597"
      ],
      "series": [
        {
          "type": "heatmap",
          "coordinateSystem": "calendar",
          "data": [
            [
              "2020-01-19",
              217
            ],
            [
              "2020-01-20",
              74
            ],
            [
              "2020-01-21",
              149
            ],
            [
              "2020-01-22",
              131
            ],
            [
              "2020-01-23",
              264
            ],
            [
              "2020-01-24",
              462
            ],
            [
              "2020-01-25",
              688
            ],
            [
              "2020-01-26",
              777
            ],
            [
              "2020-01-27",
              1773
            ],
            [
              "2020-01-28",
              1464
            ],
            [
              "2020-01-29",
              1737
            ],
            [
              "2020-01-30",
              1984
            ],
            [
              "2020-01-31",
              2101
            ],
            [
              "2020-02-01",
              2590
            ],
            [
              "2020-02-02",
              2827
            ],
            [
              "2020-02-03",
              3233
            ],
            [
              "2020-02-04",
              3892
            ],
            [
              "2020-02-05",
              3697
            ],
            [
              "2020-02-06",
              3151
            ],
            [
              "2020-02-07",
              3387
            ],
            [
              "2020-02-08",
              2653
            ],
            [
              "2020-02-09",
              2923
            ],
            [
              "2020-02-10",
              2467
            ],
            [
              "2020-02-11",
              2015
            ],
            [
              "2020-02-12",
              16265
            ],
            [
              "2020-02-13",
              3011
            ],
            [
              "2020-02-14",
              2644
            ],
            [
              "2020-02-15",
              2008
            ],
            [
              "2020-02-16",
              2051
            ],
            [
              "2020-02-17",
              1893
            ],
            [
              "2020-02-18",
              1751
            ],
            [
              "2020-02-19",
              822
            ],
            [
              "2020-02-20",
              892
            ],
            [
              "2020-02-21",
              399
            ],
            [
              "2020-02-22",
              649
            ],
            [
              "2020-02-23",
              221
            ],
            [
              "2020-02-24",
              517
            ],
            [
              "2020-02-25",
              411
            ],
            [
              "2020-02-26",
              440
            ],
            [
              "2020-02-27",
              329
            ],
            [
              "2020-02-28",
              430
            ],
            [
              "2020-02-29",
              579
            ],
            [
              "2020-03-01",
              206
            ],
            [
              "2020-03-02",
              128
            ],
            [
              "2020-03-03",
              120
            ],
            [
              "2020-03-04",
              143
            ],
            [
              "2020-03-05",
              145
            ],
            [
              "2020-03-06",
              103
            ],
            [
              "2020-03-07",
              46
            ],
            [
              "2020-03-08",
              45
            ],
            [
              "2020-03-09",
              20
            ],
            [
              "2020-03-10",
              31
            ],
            [
              "2020-03-11",
              25
            ],
            [
              "2020-03-12",
              23
            ],
            [
              "2020-03-13",
              18
            ],
            [
              "2020-03-14",
              27
            ],
            [
              "2020-03-15",
              29
            ],
            [
              "2020-03-16",
              39
            ],
            [
              "2020-03-17",
              35
            ],
            [
              "2020-03-18",
              84
            ],
            [
              "2020-03-19",
              65
            ],
            [
              "2020-03-20",
              116
            ],
            [
              "2020-03-21",
              82
            ],
            [
              "2020-03-22",
              102
            ],
            [
              "2020-03-23",
              147
            ],
            [
              "2020-03-24",
              100
            ],
            [
              "2020-03-25",
              113
            ],
            [
              "2020-03-26",
              118
            ],
            [
              "2020-03-27",
              135
            ],
            [
              "2020-03-28",
              128
            ],
            [
              "2020-03-29",
              106
            ],
            [
              "2020-03-30",
              98
            ],
            [
              "2020-03-31",
              86
            ],
            [
              "2020-04-01",
              93
            ],
            [
              "2020-04-02",
              78
            ],
            [
              "2020-04-03",
              73
            ],
            [
              "2020-04-04",
              55
            ],
            [
              "2020-04-05",
              75
            ],
            [
              "2020-04-06",
              66
            ],
            [
              "2020-04-07",
              86
            ],
            [
              "2020-04-08",
              92
            ],
            [
              "2020-04-09",
              56
            ],
            [
              "2020-04-10",
              64
            ],
            [
              "2020-04-11",
              113
            ],
            [
              "2020-04-12",
              115
            ],
            [
              "2020-04-13",
              99
            ],
            [
              "2020-04-14",
              49
            ],
            [
              "2020-04-15",
              52
            ],
            [
              "2020-04-16",
              352
            ],
            [
              "2020-04-17",
              31
            ],
            [
              "2020-04-18",
              21
            ],
            [
              "2020-04-19",
              36
            ],
            [
              "2020-04-20",
              13
            ],
            [
              "2020-04-21",
              37
            ],
            [
              "2020-04-22",
              15
            ],
            [
              "2020-04-23",
              9
            ],
            [
              "2020-04-24",
              13
            ],
            [
              "2020-04-25",
              14
            ],
            [
              "2020-04-26",
              3
            ],
            [
              "2020-04-27",
              6
            ],
            [
              "2020-04-28",
              22
            ],
            [
              "2020-04-29",
              0
            ],
            [
              "2020-04-30",
              16
            ],
            [
              "2020-05-01",
              3
            ],
            [
              "2020-05-02",
              5
            ],
            [
              "2020-05-03",
              7
            ],
            [
              "2020-05-04",
              4
            ],
            [
              "2020-05-05",
              0
            ],
            [
              "2020-05-06",
              4
            ],
            [
              "2020-05-07",
              7
            ],
            [
              "2020-05-08",
              1
            ],
            [
              "2020-05-09",
              15
            ],
            [
              "2020-05-10",
              19
            ],
            [
              "2020-05-11",
              1
            ],
            [
              "2020-05-12",
              7
            ],
            [
              "2020-05-13",
              6
            ],
            [
              "2020-05-14",
              5
            ],
            [
              "2020-05-15",
              9
            ]
          ],
          "label": {
            "show": true,
            "position": "top",
            "margin": 8
          }
        }
      ],
      "legend": [
        {
          "data": [
            ""
          ],
          "selected": {
            "": true
          },
          "show": true,
          "padding": 5,
          "itemGap": 10,
          "itemWidth": 25,
          "itemHeight": 14
        }
      ],
      "tooltip": {
        "show": true,
        "trigger": "item",
        "triggerOn": "mousemove|click",
        "axisPointer": {
          "type": "line"
        },
        "textStyle": {
          "fontSize": 14
        },
        "borderWidth": 0
      },
      "calendar": {
        "width": "auto",
        "orient": "horizontal",
        "range": [
          "2020-1",
          "2020-6"
        ],
        "cellSize": 20
      },
      "title": [
        {
          "text": "\u5168\u56fd\u75ab\u60c5\u6bcf\u65e5\u65b0\u589e\u786e\u8bca\u75c5\u4f8b\u65e5\u5386\u56fe",
          "subtext": "From Weix",
          "padding": 5,
          "itemGap": 10
        }
      ],
      "visualMap": {
        "show": true,
        "type": "piecewise",
        "min": 0,
        "max": 100,
        "inRange": {
          "color": [
            "#50a3ba",
            "#eac763",
            "#d94e5d"
          ]
        },
        "calculable": true,
        "inverse": false,
        "splitNumber": 5,
        "orient": "vertical",
        "left": "100px",
        "top": "230px",
        "showLabel": true,
        "itemWidth": 20,
        "itemHeight": 14,
        "borderWidth": 0,
        "pieces": [
          {
            "min": 13000,
            "color": "#7f1818"
          },
          {
            "min": 1000,
            "max": 10000
          },
          {
            "min": 500,
            "max": 999
          },
          {
            "min": 100,
            "max": 499
          },
          {
            "min": 10,
            "max": 99
          },
          {
            "min": 0,
            "max": 9
          }
        ]
      }
    };

    this.chartRef = echarts.init(
        this.$refs.chartContainer,
        undefined,
        {renderer: 'canvas'}
    );
    this.chartRef.setOption(heatmapOptions);

    // 初始化折线图
    this.initLineChart();

    // 初始化国家列表
    this.initCountries();

    // 处理世界数据
    this.processWorldData();

    this.updateLineChart();
  },
  beforeDestroy() {
    if (this.chartRef) {
      this.chartRef.dispose();
    }
    if (this.lineChartRef) {
      this.lineChartRef.dispose();
    }
  },
  watch: {
    // 移除原有的 countries watcher
    // 监听选中国家变化，更新图表
    selectedCountry() {
      this.$nextTick(() => {
        this.updateLineChart();
      });
    }
  }
}
</script>

<style scoped>
/* 继承主页面样式 */
.container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  background-attachment: fixed;
  padding: 20px;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

h1 {
  font-size: 42px;
  font-weight: 900;
  padding: 25px 30px;
  background: linear-gradient(90deg, #00d4ff 0%, #00a8ff 50%, #0077ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
  letter-spacing: 3px;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.5));
  }
  to {
    filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.8));
  }
}

.top-header {
  position: relative;
  margin-bottom: 25px;
  background: rgba(15, 20, 43, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.top-header-tip {
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
}

.back-btn {
  padding: 10px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.card {
  background: rgba(15, 20, 43, 0.8);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  margin-bottom: 25px;
  border: 2px solid transparent;
  background-image:
      linear-gradient(rgba(15, 20, 43, 0.8), rgba(15, 20, 43, 0.8)),
      linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
  padding: 20px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(102, 126, 234, 0.4);
}

.card h3 {
  color: #00d4ff;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  margin: 0 0 20px 0;
}

.controls {
  margin-bottom: 20px;
}

.controls label {
  color: #a0d8ef;
  margin-right: 10px;
}

.controls select {
  padding: 5px 10px;
  border-radius: 5px;
  background: rgba(15, 20, 43, 0.8);
  color: #a0d8ef;
  border: 1px solid rgba(0, 212, 255, 0.2);
}

.chart-container {
  width: 100%;
  height: 400px;
}

/* Element UI 样式覆盖 */
::v-deep .el-slider__runway {
  background-color: rgba(102, 126, 234, 0.2);
}

::v-deep .el-slider__bar {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

::v-deep .el-slider__button {
  border-color: #667eea;
  background-color: #fff;
}

::v-deep .el-slider__marks-text {
  color: #a0d8ef;
  font-size: 12px;
}

::v-deep .el-tag {
  border: none;
  font-weight: bold;
}
</style>
