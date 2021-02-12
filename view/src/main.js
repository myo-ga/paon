import Vue from 'vue'

// vue-router
import router from './router'

//axios
import axios from 'axios' 
Vue.prototype.$axios = axios;

//vuex
import store from './plugins/store'

//vuetify
import './plugins/vuetify'

//app
import App from './App.vue'

import VueLocalStorage from 'vue-local-storage'


Vue.config.productionTip = false;
Vue.use(VueLocalStorage)


new Vue({
  router,
  store,
  localStorage,
  render: h => h(App)
}).$mount('#app')


