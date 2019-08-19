import Vue from 'vue'

// vue-router
import router from './router'

//axios
import axios from 'axios' 
import store from './plugins/store'
Vue.prototype.$axios = axios;

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


