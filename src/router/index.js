import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/views/Home'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/register',
    name: 'register',
    redirect: '?auth=register'
  },
  {
    path: '/login',
    name: 'login',
    redirect: '?auth=login'
  },

  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/Search')
  },
  {
    path: '/feed',
    name: 'feed',
    component: () => import('@/views/GlobalFeed')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
