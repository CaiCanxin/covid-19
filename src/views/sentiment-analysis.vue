<template>
  <div class="container">
    <!-- 顶部 -->
    <div class="top-header">
      <div class="title">
        <h1>{{ title }}</h1>
        <div class="top-header-tip">
          <div class="back-btn" @click="goBack">
            <i class="el-icon-back"></i> 返回主页
          </div>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <el-row :gutter="20">
        <!-- 词云分析区域 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="card-header">
              <h3>舆情分析 - 词云图</h3>
              <div class="slider-label">当前日期：{{ currentDate }}</div>
            </div>
            <div class="chart-content">
              <word-cloud-chart
                ref="wordCloudChart"
                :data="currentWordCloudData"
                :timeline="dateList"
                :seriesMap="wordCloudMap"
                :maxWords="50"
                :sizeRange="[14,50]"
                :rotationRange="[0,0]"
                :gridSize="16"
                style="width: 100%; height: 450px"
              />
            </div>
          </div>
        </el-col>
        
        <!-- 情感分析折线图区域 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="card-header">
              <h3>舆情分析 - 情感走势</h3>
            </div>
            <div class="chart-content">
              <sentiment-line-chart
                ref="sentimentLineChart"
                :data="sentimentLineData"
                style="width: 100%; height: 450px"
              />
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 数据预测区域 -->
        <el-col :span="24">
          <div class="chart-card">
            <div class="card-header">
              <h3>数据增长预测</h3>
              <div class="prediction-info">
              </div>
            </div>
            <div class="chart-content">
              <prediction-chart
                ref="predictionChart"
                :data="predictionData"
                style="width: 100%; height: 500px"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import PredictionChart from '../components/temp/prediction-chart.vue';
import SentimentLineChart from '../components/temp/sentiment-line-chart.vue';
import WordCloudChart from '../components/temp/word-cloud-chart.vue';

export default {
  name: 'SentimentAnalysis',
  components: {
    WordCloudChart,
    PredictionChart,
    SentimentLineChart
  },
  data() {
    return {
      title: '新冠肺炎舆情分析与预测',
      dateIndex: 6,
      dateList: Array.from({ length: 7 }, (_, i) => {
        const d = new Date('2020-02-07')
        d.setDate(d.getDate() + i)
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
      }),
      wordCloudDataList: [
        // Mock数据 - 不同日期的词云数据
        [
          { name: '疫情防控', value: 1500 },
          { name: '核酸检测', value: 1200 },
          { name: '隔离', value: 1100 },
          { name: '疫苗接种', value: 1000 },
          { name: '健康码', value: 900 },
          { name: '社区防疫', value: 850 },
          { name: '医护人员', value: 800 },
          { name: '志愿者', value: 750 },
          { name: '物资保障', value: 700 },
          { name: '居家隔离', value: 650 }
        ],
        [
          { name: '疫苗', value: 1600 },
          { name: '防控措施', value: 1300 },
          { name: '核酸', value: 1150 },
          { name: '确诊病例', value: 1050 },
          { name: '治愈', value: 950 },
          { name: '医疗资源', value: 900 },
          { name: '防护', value: 850 },
          { name: '抗疫', value: 800 },
          { name: '封控', value: 750 },
          { name: '健康', value: 700 }
        ],
        [
          { name: '新增病例', value: 1400 },
          { name: '疫情', value: 1250 },
          { name: '防疫', value: 1100 },
          { name: '医院', value: 1000 },
          { name: '口罩', value: 920 },
          { name: '消毒', value: 880 },
          { name: '体温', value: 830 },
          { name: '病毒', value: 780 },
          { name: '传播', value: 730 },
          { name: '预防', value: 680 }
        ],
        [
          { name: '治疗方案', value: 1550 },
          { name: '疫情形势', value: 1280 },
          { name: '防控', value: 1120 },
          { name: '患者', value: 1020 },
          { name: '康复', value: 940 },
          { name: '医疗', value: 890 },
          { name: '病床', value: 840 },
          { name: '重症', value: 790 },
          { name: '症状', value: 740 },
          { name: '药物', value: 690 }
        ],
        [
          { name: '疫情数据', value: 1480 },
          { name: '防疫政策', value: 1220 },
          { name: '检测', value: 1080 },
          { name: '疫苗研发', value: 980 },
          { name: '免疫', value: 910 },
          { name: '防护服', value: 860 },
          { name: '医疗队', value: 810 },
          { name: '救治', value: 760 },
          { name: '隔离点', value: 710 },
          { name: '疫情通报', value: 670 }
        ],
        [
          { name: '疫情防控', value: 1520 },
          { name: '核酸检测', value: 1240 },
          { name: '接种疫苗', value: 1090 },
          { name: '健康监测', value: 990 },
          { name: '防疫措施', value: 920 },
          { name: '医疗救治', value: 870 },
          { name: '抗疫精神', value: 820 },
          { name: '疫情态势', value: 770 },
          { name: '防控成果', value: 720 },
          { name: '复工复产', value: 680 }
        ],
        [
          { name: '疫情防控', value: 1580 },
          { name: '动态清零', value: 1300 },
          { name: '核酸筛查', value: 1130 },
          { name: '疫苗加强针', value: 1030 },
          { name: '精准防控', value: 950 },
          { name: '流调溯源', value: 900 },
          { name: '医疗保障', value: 850 },
          { name: '疫情监测', value: 800 },
          { name: '常态化防控', value: 750 },
          { name: '抗疫一线', value: 700 }
        ]
      ],
      predictionData: {
        dateList: [],
        actualData: [],
        predictedData: []
      },
      sentimentLineData: {
        dateList: [],
        sentimentData: []
      },
    }
  },
  computed: {
    currentDate() {
      return this.dateList[this.dateIndex]
    },
    currentWordCloudData() {
      return this.wordCloudDataList[this.dateIndex]
    },
    wordCloudMap() {
      const map = {}
      this.dateList.forEach((d, idx) => {
        map[d] = this.wordCloudDataList[idx] || []
      })
      return map
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    async initPredictionData() {
      try {
        const response = await fetch('/daily_case_totals_predictions.csv');
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1); // 分割并移除表头
        
        const dates = [];
        const actual = [];
        const predicted = [];

        rows.forEach(row => {
          const columns = row.split(',');
          if (columns.length >= 3 && columns[0]) {
            dates.push(columns[0].trim());
            const actualValue = columns[1] && parseFloat(columns[1]) !== 0 ? parseFloat(columns[1]) : null;
            actual.push(actualValue);
            const predictedValue = columns[2] && parseFloat(columns[2]) !== 0 ? parseFloat(columns[2]) : null;
            predicted.push(predictedValue);
          }
        });

        this.predictionData = {
          dateList: dates,
          actualData: actual,
          predictedData: predicted
        };
      } catch (error) {
        console.error("加载预测数据失败:", error);
      }
    },
    initSentimentLineData() {
      this.sentimentLineData = {
        dateList: this.dateList,
        sentimentData: [0.61, 0.52, 0.43, 0.48, 0.59, 0.65, 0.72]
      };
    },
    initCharts() {
      this.$refs.wordCloudChart.initChart()
      this.$refs.predictionChart.initChart()
      this.$refs.sentimentLineChart.initChart()
    }
  },
  async mounted() {
    this.initSentimentLineData();
    await this.initPredictionData();
    this.$nextTick(() => {
      this.initCharts()
    })
  }
}
</script>

<style scoped>
/* 继承主页面样式 */
.container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
  background-attachment: fixed;
  padding: 20px;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

h1 {
  font-size: 42px;
  font-weight: 900;
  padding: 25px 30px;
  background: linear-gradient(90deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
  letter-spacing: 3px;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    filter: drop-shadow(0 2px 5px rgba(25, 118, 210, 0.3));
  }
  to {
    filter: drop-shadow(0 4px 10px rgba(25, 118, 210, 0.5));
  }
}

.top-header {
  position: relative;
  margin-bottom: 25px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(25, 118, 210, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.top-header-tip {
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
}

.back-btn {
  padding: 10px 25px;
  background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
  color: #fff;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.5);
}

.chart-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  margin-bottom: 25px;
  border: 2px solid transparent;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)),
    linear-gradient(135deg, #64b5f6 0%, #42a5f5 25%, #2196f3 50%, #1e88e5 75%, #1976d2 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.15);
  transition: all 0.3s ease;
  overflow: hidden;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(25, 118, 210, 0.25);
}

.card-header {
  padding: 20px 25px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  color: #1976d2;
  font-size: 20px;
  font-weight: bold;
  text-shadow: none;
  margin: 0;
}

.date-slider-wrapper {
  display: flex;
  align-items: center;
}

.slider-label {
  color: #424242;
  font-size: 14px;
  white-space: nowrap;
}

.prediction-info {
  display: flex;
  align-items: center;
}

.chart-content {
  padding: 20px;
}

.prediction-metrics {
  margin-top: 25px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(33, 150, 243, 0.2);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.2);
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.metric-icon i {
  font-size: 24px;
  color: #fff;
}

.metric-info {
  flex: 1;
}

.metric-label {
  color: #757575;
  font-size: 13px;
  margin-bottom: 5px;
}

.metric-value {
  color: #1976d2;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.metric-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.metric-trend i {
  margin-right: 5px;
}

/* Element UI 样式覆盖 */
::v-deep .el-slider__runway {
  background-color: rgba(33, 150, 243, 0.15);
}

::v-deep .el-slider__bar {
  background: linear-gradient(90deg, #42a5f5 0%, #1e88e5 100%);
}

::v-deep .el-slider__button {
  border-color: #2196f3;
  background-color: #fff;
}

::v-deep .el-slider__marks-text {
  color: #424242;
  font-size: 12px;
}

::v-deep .el-tag {
  border: none;
  font-weight: bold;
}
</style>