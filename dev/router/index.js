import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const playground = new Promise((resolve) => {
  import(
    /* webpackMode: "lazy" */
    '@dev/views/Playground.vue'
  )
    .catch((e) => {
      if (e && e.code === 'MODULE_NOT_FOUND') {
        console.warn(
          '%cPlease clone Playground.template.vue into your own playground',
          'font-size: 2rem; font-weight: bold;'
        )
      }
      throw e
    })
    .then(resolve)
})

const routes = [
  {
    path: '/',
    name: 'Playground',
    component: () => playground
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
