import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import VueRouter from 'vue-router'
import 'font-awesome/css/font-awesome.min.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'bootstrap/dist/css/bootstrap.css'
import '../theme/index.css'
import axios from 'axios'



Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'
Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(ElementUI)

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
 