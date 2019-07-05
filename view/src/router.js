import Vue from 'vue'
import Router from 'vue-router'
import AdjustEvent from './components/AdjustEvent.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'AdjustEvent',
      component: AdjustEvent
    },
    {
      path: '/RegistEvent',
      name: 'RegistEvent',
      component: () => import('./components/RegistEvent.vue')
    }
  ]
})
