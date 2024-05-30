import { createRouter, createWebHistory } from 'vue-router'
import LobbyView from '../views/LobbyView.vue'
import { useLIFF } from '@/composable/useLIFF'
import { useLayoutStore } from '@/stores/layout'

const DevMode = import.meta.env.MODE === 'development'

// const removeQueryParams = (to: { query: {}; path: any; }) => {
//   if (Object.keys(to.query).length)
//     return { path: to.path, query: {} }
// }

const removeActivityID = (to: { query: { ac?: any }; path: any }) => {
  if (localStorage.getItem('ac')) localStorage.removeItem('ac')
  if (to?.query?.ac) {
    const queryObj = to.query
    delete queryObj['ac']
    return { path: to.path, query: queryObj }
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Lobby',
      component: LobbyView,
      meta: {
        title: '活動大廳'
      }
    },
    {
      path: '/activity/:id?',
      name: 'Activity',
      component: () => import('../views/ActivityView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/collected/:id?',
      name: 'Collected',
      component: () => import('../views/CollectedView.vue'),
      meta: {
        title: '活動打卡紀錄',
        requiresAuth: true
      }
    },
    {
      path: '/scan',
      name: 'Scan',
      component: () => import('../views/ScanView.vue'),
      meta: {
        title: '掃描'
      }
    },
    {
      path: '/winning/:id?',
      name: 'Winning',
      component: () => import('../views/WinningView.vue'),
      meta: {
        title: '兌獎'
      }
    },
    {
      path: '/mapStore',
      name: 'MapStore',
      component: () => import('../views/MapStoreView.vue'),
      meta: {
        title: '門市地圖',
        requiresAuth: true
      }
    },
    {
      path: '/album',
      name: 'Album',
      component: () => import('../views/AlbumView.vue'),
      beforeEnter: [removeActivityID],
      meta: {
        title: '門市打卡紀錄',
        requiresAuth: true
      }
    },
    {
      path: '/wrapup',
      name: 'WrapUp',
      component: () => import('../views/WrapUpView.vue'),
      meta: {
        title: '活動已結束'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/ComingSoonView.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  console.log('global beforeEach');
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  const layoutStore = useLayoutStore()
  // Reset all layout
  layoutStore.toggleDirection(false)
  layoutStore.loadToggle(false)
  layoutStore.closeNav()

  layoutStore.pageLoadToggle(true)
  
  if (to.name == 'Lobby') return next()
  if (!(to.meta && to.meta.requiresAuth)) return next()
  if (DevMode) return next()

  const { getLineAccess, getLineProfileAndAccess } = useLIFF()
  let canAccess = true
  if (['Album', 'Collected', 'MapStore'].includes(String(to.name))) {
    try {
      const serviceT0ken = await getLineAccess(to.path)
      canAccess = serviceT0ken ? true : false
    } catch (error) {
      console.error(error)
    }
  } else if (to.name === 'Activity' && to.params.id) {
    try {
      const serviceT0ken = await getLineProfileAndAccess(String(to.params.id))
      canAccess = serviceT0ken ? true : false
    } catch (error) {
      console.error(error)
    }
  }

  if (!canAccess) return next({ name: 'Lobby' })
  return next()
})

router.afterEach(() => {
  console.log('global afterEach');
  const layoutStore = useLayoutStore()
  layoutStore.pageLoadToggle(false)
})

export default router
