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
    name: 'episodes',
    component: () => import('@/views/GlobalFeed'),
    redirect: {name: 'allEpisodes'},
    children: [
      {
        path: '',
        name: 'allEpisodes',
        component: () => import('@/components/PdEpisodes'),
        props: {apiUrl: '/episodes'}
      },
      {
        path: 'subscriptions',
        name: 'subscriptions',
        component: () => import('@/components/PdEpisodes'),
        props: {apiUrl: '/episodes?subscriptions=true'}
      }
    ]
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
    path: '/add-podcast',
    name: 'add-podcast',
    component: () => import('@/views/AddPodcast')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/NotFound')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
