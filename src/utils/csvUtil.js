// src/utils/csvUtil.js

import Papa from 'papaparse';

// 静态变量存储转换后的数据
let covidData = [];
let worldCovidData = [];

// 数据转换函数
const parseCovidData = async () => {
  try {
    // 从 public 目录获取 CSV 文件
    const response = await fetch('/china_provincedata.csv');
    const csvText = await response.text();

    // 使用 papaparse 解析 CSV 字符串
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    });

    const rows = parsed.data;

    // 按日期分组数据
    const groupedByDate = {};

    // 遍历CSV数据
    rows.forEach(row => {
      const date = row.dateId;

      // 如果该日期还没有数据，初始化数组
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }

      // 添加省份数据
      groupedByDate[date].push({
        confirmedCount: parseInt(row.confirmedCount),
        confirmedIncr: parseInt(row.confirmedIncr),
        currentConfirmedCount: parseInt(row.currentConfirmedCount),
        currentConfirmedIncr: parseInt(row.currentConfirmedIncr),
        suspectedCount: parseInt(row.suspectedCount),
        suspectedIncr: parseInt(row.suspectedCountIncr),
        deadCount: parseInt(row.deadCount),
        deadIncr: parseInt(row.deadIncr),
        curedCount: parseInt(row.curedCount),
        curedIncr: parseInt(row.curedIncr),
        provinceLabel: row.provinceShortName
      });
    });

    // 构建最终的JSON结构
    covidData = Object.keys(groupedByDate).map(date => ({
      date,
      data: groupedByDate[date]
    })).sort((a, b) => a.date.localeCompare(b.date));

    return covidData;
  } catch (error) {
    console.error('Error parsing CSV data:', error);
    return [];
  }
};

const parseWorldCovidData = async () => {
  try {
    // 从 public 目录获取 CSV 文件
    const response = await fetch('/countrydata.csv');
    const csvText = await response.text();

    // 使用 papaparse 解析 CSV 字符串
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    });

    const rows = parsed.data;

    // 按日期分组数据
    const groupedByDate = {};

    // 遍历CSV数据
    rows.forEach(row => {
      const date = row.dateId;

      // 如果该日期还没有数据，初始化数组
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }

      // 添加省份数据
      groupedByDate[date].push({
        confirmedCount: parseInt(row.confirmedCount),
        confirmedIncr: parseInt(row.confirmedIncr),
        currentConfirmedCount: parseInt(row.currentConfirmedCount),
        currentConfirmedIncr: parseInt(row.currentConfirmedIncr),
        suspectedCount: parseInt(row.suspectedCount),
        suspectedIncr: parseInt(row.suspectedCountIncr),
        deadCount: parseInt(row.deadCount),
        deadIncr: parseInt(row.deadIncr),
        curedCount: parseInt(row.curedCount),
        curedIncr: parseInt(row.curedIncr),
        provinceLabelEn: row.countryFullName,
        provinceLabel: row.countryName
      });
    });

    // 构建最终的JSON结构
    worldCovidData = Object.keys(groupedByDate).map(date => ({
      date,
      data: groupedByDate[date]
    })).sort((a, b) => a.date.localeCompare(b.date));

    return worldCovidData;
  } catch (error) {
    console.error('Error parsing CSV data:', error);
    return [];
  }
};

// 初始化数据（异步）
let initializedData = [];
let initializedWorldData = [];
parseCovidData().then(data => {
  initializedData = data;
});
parseWorldCovidData().then(data => {
  initializedWorldData = data;
});

// 导出数据和相关函数
export {
  initializedData as chinaProvinceData,
  initializedWorldData as worldData,
  parseCovidData,
  parseWorldCovidData
};
