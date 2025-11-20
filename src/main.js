// src/main.js - 禁用mock
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import dataV from '@jiaminghi/data-view'
import * as echarts from 'echarts'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';

// Element UI组件按需导入
import { 
  Icon, Row, Col, Table, TableColumn, Button, Dialog, Link, Input, Select, Option, Tag, ButtonGroup, Alert, MessageBox, Message
} from 'element-ui';

// ⚠️ 注释掉mock - 这是导致404的根本原因
// if (process.env.NODE_ENV === 'development') {
//   const { initMockData } = require('../mock')
//   initMockData()
// }

Vue.prototype.$echarts = echarts
Vue.prototype.axios = axios
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.config.productionTip = false

// 注册Element UI组件
Vue.use(dataV)
Vue.use(VueRouter)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Link)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tag)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')