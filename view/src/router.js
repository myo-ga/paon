import Vue from 'vue'
import Router from 'vue-router'
import RegistEvent from './components/RegistEvent.vue'
import UpdateEvent from './components/UpdateEvent.vue'

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
      path: '/UpdateEvent',
      name: 'UpdateEvent',
      component: UpdateEvent
    },
    {
      path: '/AdjustEvent',
      name: 'AdjustEvent',
      component: () => import('./components/AdjustEvent.vue')
    },
    {
      path: '/ReferEvent/:id',
      name: 'ReferEvent',
      component: () => import('./components/ReferEvent.vue'),
    },
    {
      path: '/VueTest',
      name: 'VueTest',
      component: () => import('./components/testlist.vue')
    },
  ]
})
