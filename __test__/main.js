/* eslint-disable import/named,import/namespace */
import Vue from 'vue'
import Router from 'vue-router'
import { routes } from '..'

Vue.use(Router)

const router = new Router({ routes })

new Vue({
  router,
  render: h => h('router-view')
}).$mount('#app')
