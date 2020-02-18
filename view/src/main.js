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

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


