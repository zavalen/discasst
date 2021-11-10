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
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Profile')
  },
  {
    path: '/podcasts',
    name: 'podcasts',
    component: () => import('@/views/Podcasts')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/Settings')
  },
  {
    path: '/feed',
    name: 'feed',
    component: () => import('@/views/GlobalFeed')
  },
  {
    path: '/:podcastSlug/:episodeSlug',
    name: 'episode',
    component: () => import('@/views/Episode')
  },
  {
    path: '/:podcastSlug',
    name: 'podcast',
    component: () => import('@/views/Podcast')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/NotFound')
  },
  {
    path: '/add-podcast',
    name: 'add-podcast',
    component: () => import('@/views/AddPodcast')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
