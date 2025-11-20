# 技术实现方案 — COVID-19 数据可视化项目

> 位置：项目根目录 `TECHNICAL_PLAN.md`

## 1. 概览

- 项目名：data-visualization-with-covid-19
- 技术栈：Vue 2.x（Options API）、Element UI、ECharts（echarts、echarts-wordcloud、echarts-liquidfill）、Axios、Mock.js
- 目标：提供基于 COVID-19 数据的可视化仪表盘，包括词云（舆情分析）、趋势图、地图、排名和预测模块，支持按时间滑动查看历史数据，并支持导出与分享。
- 关键目录：
  - `src/components/`：可复用图表组件（词云、趋势图、地图等）
  - `src/views/`：页面容器（如 `sentiment-analysis.vue`）
  - `src/api/`：数据请求封装
  - `data/`：本地静态演示数据
  - `mock/`：Mock 数据与本地接口

---

## 2. 主要功能与用户故事

- 词云（舆情分析）
  - 用户可以通过时间滑块查看不同日期的关键词分布与权重。
  - 支持 hover 显示 tooltip、点击高亮/筛选。
- 趋势 / 预测图
  - 展示历史实际数据与模型预测（例如 LSTM）对比，支持鼠标悬停查看精确数值。
- 全局时间控制
  - 时间选择器（滑块或时间线）可作为全局控制，驱动页面内所有基于时间的图表联动。
- 导出
  - 支持将当前视图导出为图片/CSV 以便分享或离线分析。

---

## 3. 架构与组件划分

- 页面层（Views）
  - `src/views/sentiment-analysis.vue`：词云 + 预测视图容器，负责时间控制与不同图表的聚合与联动。

- 组件层（Components）
  - `WordCloudChart`（`src/components/temp/word-cloud-chart.vue`）
    - 责任：封装 echarts-wordcloud 渲染、内部时间滑块（可选）、数据预处理和交互（hover、点击）。
    - Props：`data`、`timeline`、`seriesMap`、`maxWords`、`sizeRange`、`rotationRange`、`rotationStep`、`gridSize`。
    - Methods：`initChart()`、`updateChart()`、`prepareData()`（TopN + 归一化）、`handleResize()`。
    - 建议：支持受控用法（props `currentIndex` + event `update:currentIndex`）以便父组件控制时间。
  - `PredictionChart`：显示预测曲线（实际/预测）并支持 tooltip 和导出。
  - 其它：`ChartCard`、`BasicTrendChart`、`DataMap` 等。

- 数据层
  - `src/api/covid19.js`：统一封装后端请求，支持 mock 切换。
  - `data/`：放置静态 JSON，用作演示或离线模式。

---

## 4. 数据流与交互契约

- 父组件 -> 子组件
  - 单帧模式：`<WordCloudChart :data="wordList" />` —— 子组件仅渲染该数组。
  - 时序模式：`<WordCloudChart :timeline="dateList" :seriesMap="map" />` —— 子组件显示内置滑块并根据 `currentIndex` 切换数据。
- 子组件 -> 父组件
  - 子组件内部滑块操作时建议 `this.$emit('date-change', { date, index })`，父组件接收并同步其它图表。
- 数据形状
  - 词云条目：`{ name: string, value: number }`。
  - timeline 建议格式：`['YYYY-MM-DD', ...]`（可排序字符串）。

---

## 5. 词云实现细节（重点）

- 渲染流程
  1. `mounted()` 调用 `initChart()`，使用 `echarts.init()` 初始化实例。
  2. `updateChart()` 从 `seriesMap[timeline[currentIndex]]` 或 `props.data` 读取当前数据。
  3. `prepareData(raw)` 做排序、TopN 截断与归一化（消除极端权重差异），返回 ECharts 可用数据。
  4. 通过 `chart.setOption(option, true)` 更新图表。

- 减少重叠策略
  - 限制 `maxWords`（默认 50-80，根据容器大小自适应）。
  - 增大 `gridSize` 值（如 12-18），使词间有更大的格子间隔。
  - 控制 `rotationRange`（默认水平 0°，或小角度范围）降低重叠概率。
  - 对 value 做归一化（映射到 1-100），避免极大值垄断布局。
  - 若仍重叠，可降级为“词表列表视图”作为回退。

- 配色与稳定性
  - 使用基于词名的哈希函数选择颜色，保证刷新时颜色稳定而非完全随机。

- 性能注意点
  - ECharts 渲染大量词时可能卡顿，使用 `maxWords` 限制并在拖动滑块时做节流（throttle）或防抖（debounce）。
  - 避免频繁 `dispose()` + `init()`；推荐持久化 `chart` 实例并仅使用 `setOption` 更新。

---

## 6. 测试计划

- 单元测试（Jest + Vue Test Utils）
  - 测试 `prepareData()`：输入乱序/缺失字段数据，返回 TopN、值在指定区间。
  - 测试组件 props 驱动行为：传入不同 `timeline`/`seriesMap` 时，`updateChart()` 正常调用。

- E2E 测试（Cypress 或 Playwright）
  - 测试滑块拖动是否驱动词云更新、预测图是否联动、导出功能是否工作。

- 静态检查
  - ESLint 检查（已包含 vue-cli 配置），在 CI 中运行 lint + 单测 + build。

---

## 7. 构建与部署

- 本地开发：
  ```bash
  npm install
  npm run dev
  ```
- 生产打包：
  ```bash
  npm run build
  ```
- 部署建议：
  - 静态前端可部署到 Netlify / Vercel / GitHub Pages；若有后端，则采用 Nginx + 后端服务，静态资源 CDN 加速。
  - 在生产环境使用 HTTPS 与合适的缓存策略。

---

## 8. 可扩展性与优化建议

- 后端聚合：对于大时间跨度或高分辨率数据，后端做按天/周/月聚合，前端只拉取所需时间段数据。
- 前端缓存：使用 localStorage/sessionStorage 或内存缓存 `seriesMap`，避免重复请求。
- 自适应策略：基于容器大小自动调整 `maxWords` 与 `sizeRange`，低端设备自动降级渲染复杂度。
- 图表导出：提供 PNG/SVG 导出与 CSV 导出（词云词表）。
- 样式统一：建议将滑块替换为 `el-slider`（Element UI）以保证 UI 风格一致。

---

## 9. 迁移路线（短中长期）

- V1（1-2 周）
  - 稳定词云交互与参数（父控/子控策略确定），修复重叠问题，增加单元测试。
- V2（2-4 周）
  - 增加全局时间控制器广播、导出功能、后端分页/聚合支持、性能优化。
- V3（4-8 周）
  - 支持用户保存仪表盘视图、权限/认证、考虑迁移到 Vue 3 以便长期维护。

---

## 10. 立即建议（可直接实施）

1. 决定时间滑块的“单一控制端”：
   - 推荐：父组件控制（`sentiment-analysis.vue`）并把 `currentIndex` 作为 prop 传入 `WordCloudChart`（受控组件），子组件只负责渲染，不包含自己的滑块。
   - 备选：子组件保留滑块并通过事件 `date-change` 通知父组件（需要双向同步逻辑）。
2. 在 `WordCloudChart` 中保持 `maxWords`、`gridSize`、`sizeRange` 为可配置 props，允许在不同页面传参调优。
3. 添加 `prepareData()` 的单元测试用例，优先保证数据预处理正确。
4. 将滑块样式替换为 `el-slider`（Element UI）以统一 UI 风格。

---

## 11. 附录：关键文件与建议修改点

- `src/components/temp/word-cloud-chart.vue`
  - ensure: 支持受控/非受控两种模式；提供 `prepareData()`、`maxWords` 等 props；在 update 时仅 `setOption` 而非重建实例。
- `src/views/sentiment-analysis.vue`
  - 建议：父组件控制时间索引并将 `timeline/seriesMap` 传入 `WordCloudChart`；在页面上保留一个统一的滑块以驱动所有图表。
- `src/api/covid19.js`
  - 建议：将大数据的按需拉取与缓存逻辑封装在此处。


---

如果你同意，我现在会把这个文件保存到仓库（已完成），并可以继续：
- A）把 `WordCloudChart` 改为受控组件并移除子内滑块（保持父控滑块）；
- B）或把父控滑块移回 UI 并隐藏子组件滑块；
- C）添加 `prepareData()` 的单元测试。

请选择下一步或直接让我实施其中一项。