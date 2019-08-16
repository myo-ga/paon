import Vue from 'vue'
import router from './router'
import './plugins/vuetify'
import axios from 'axios' 

import store from './plugins/store'

import App from './App.vue'


Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


