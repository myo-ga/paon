import Vue from 'vue'
import Router from 'vue-router'
import RegistEvent from './components/RegistEvent.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'RegistEvent',
      component: RegistEvent
    },
    {
      path: '/AdjustEvent',
      name: 'AdjustEvent',
      component: () => import('./components/AdjustEvent.vue')
    },
    {
      path: '/VueTest',
      name: 'VueTest',
      component: () => import('./components/SearchMap.vue')
    }
  ]
})
