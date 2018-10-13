import Vue from 'vue'
import VueTouch from 'vue-touch'
import App from './app'
import router from './router'
import store from './store'

Vue.use(VueTouch, {name: 'v-touch'})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
