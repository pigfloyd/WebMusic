import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router.js'
import 'font-awesome/css/font-awesome.min.css'
import ELEMENT from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import  { BootstrapVue } from 'bootstrap-vue'

Vue.prototype.$axios = axios
//axios.defaults.baseURL = '/api'
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(ELEMENT)
Vue.use(VueRouter)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
 