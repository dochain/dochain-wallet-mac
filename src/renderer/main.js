// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './components/App'
import router from './router'
import i18n from './lib/i18n'
import websocket from './lib/websocket'
import store from './store'
import VeeValidate from 'vee-validate'
import filter from './lib/filter'
import '@/assets/css/app.css'
import '@/assets/css/dochain.css'
// 设置配置
Vue.config.productionTip = false
Vue.use(VeeValidate)
Vue.use(Vuex)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  i18n,
  filter,
  websocket,
  router,
  template: '<App/>',
  components: { App }
})
