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
      path: '/activity',
      name: 'Activity',
      component: () => import('../views/ActivityView.vue')
    },
    {
      path: '/direction',
      name: 'Direction',
      component: () => import('../views/DirectionView.vue')
    },
    {
      path: '/mapStore',
      name: 'MapStore',
      component: () => import('../views/MapStoreView.vue')
    },
    {
      path: '/album',
      name: 'Album',
      component: () => import('../views/AlbumView.vue')
    },
    {
      path: '/collected/:id?',
      name: 'Collected',
      component: () => import('../views/CollectedView.vue'),
    },

    {
      path: '/result',
      name: 'Result',
      component: () => import('../views/ResultView.vue')
    },
    {
      path: '/scan',
      name: 'Scan',
      component: () => import('../views/ScanView.vue')
    },
    {
      path: '/winning',
      name: 'Winning',
      component: () => import('../views/WinningView.vue')
    },
    {
      path: '/wrapup',
      name: 'WrapUp',
      component: () => import('../views/WrapUpView.vue')
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
