// 不使用固定数据，使用 Mock 生成模拟数据
// import overAllData from '../data/covid19-overall.json'
const provinceData = require('../data/covid19-province.json')
const dailyData = require('../public/covid19-daily-list.json')
const overallData = require('../data/covid19-overall.json')

module.exports = [
  {
    url: '/api/covid-19/overall',
    type: 'get',
    response: config => {
      return overallData
    }
  },
  {
    url: '/api/covid-19/area/latest/list',
    type: 'get',
    response: config => {
      return provinceData
    }
  },
  {
    url: '/api/covid-19/list',
    type: 'get',
    response: config => {
      return dailyData
    }
  }
]
