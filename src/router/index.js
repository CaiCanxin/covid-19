import Vue from 'vue';
import VueRouter from 'vue-router';
import AIAssistant from '../views/AIAssistant.vue';
import Calendar from '../views/calendar.vue';
import MainLayout from '../views/main-layout.vue';
import SentimentAnalysis from '../views/sentiment-analysis.vue';
import WorldMapLayout from "../views/world-map-layout.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MainLayout',
    component: MainLayout
  },
  {
    path: '/world-map-layout',
    name: 'WorldMapLayout',
    component: WorldMapLayout
  },
  {
    path: '/sentiment-analysis',
    name: 'SentimentAnalysis',
    component: SentimentAnalysis
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar
  },
  {
    path: '/ai-assistant',
    name: 'AIAssistant',
    component: AIAssistant
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router