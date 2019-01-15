import Vue from 'vue'
import Router from 'vue-router'
import { routes } from '..'

Vue.use(Router)

const router = new Router({
  routes
})

new Vue({
  el: '#app',
  router,
  render(h) {
    return h('router-view')
  }
})
