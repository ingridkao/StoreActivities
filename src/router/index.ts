import { createRouter, createWebHistory } from 'vue-router'
import LobbyView from '../views/LobbyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Lobby',
      component: LobbyView
    },
    {
      path: '/event',
      name: 'Event',
      component: () => import('../views/EventView.vue')
    },
    {
      path: '/mapStore',
      name: 'MapStore',
      component: () => import('../views/MapStoreView.vue')
    },
    // {
    //   path: '/mapEva',
    //   name: 'mapEvangelion',
    //   component: () => import('../views/MapEvaView.vue')
    // },
    {
      path: '/collected',
      name: 'Collected',
      component: () => import('../views/CollectedView.vue')
    },
    {
      path: '/scan',
      name: 'Scan',
      component: () => import('../views/ScanView.vue')
    },
    {
      path: '/wrapup',
      name: 'WrapUp',
      component: () => import('../views/WrapUpView.vue')
    },
    {
      path: '/error',
      name: 'CodeError',
      component: () => import('../views/CodeErrorView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    { 
      path: '/:pathMatch(.*)*',
      name: 'ComingSoon',
      component: () => import('../views/ComingSoonView.vue'),
      meta: {
        title: 'Coming Soon'
      }
    }
  ]
})

export default router
