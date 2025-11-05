import Vue from 'vue';
import VueRouter from 'vue-router';
import MainLayout from '../views/main-layout.vue';
import WorldMapLayout from "../views/world-map-layout.vue";
import SentimentAnalysis from '../views/sentiment-analysis.vue';
import Calendar from '../views/calendar.vue';

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
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router