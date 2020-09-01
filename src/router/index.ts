import Router from 'vue-router'
import Vue from 'vue'
Vue.use(Router)
const menu = [
  {
    path: '/',
    name: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/components/empty.vue'),
    children: [
      {
        path: '/loveTrack',
        name: 'loveTrack',
        component: () => import('@/views/codepen/test.vue')
      }
    ]
  }
]
const router = new Router({ routes: menu })
export default router
