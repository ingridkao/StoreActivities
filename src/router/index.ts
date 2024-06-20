import { createRouter, createWebHistory } from 'vue-router'
import LobbyView from '../views/LobbyView.vue'
import { useLIFF } from '@/composable/useLIFF'
import { useLayoutStore } from '@/stores/layout'
import { useSweetAlert } from '@/composable/useSweetAlert'

const DevMode = import.meta.env.MODE === 'development'

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
      path: '/activity/:id',
      name: 'Activity',
      component: () => import('../views/ActivityView.vue'),
      meta: {
        title: 'ibon打卡活動',
        requiresAuth: true
      }
    },
    {
      path: '/scan/:id',
      name: 'Scan',
      component: () => import('../views/ScanView.vue'),
      meta: {
        title: '掃描打卡'
        //requiresCamera: true
      }
    },
    {
      path: '/collected/:id',
      name: 'Collected',
      component: () => import('../views/CollectedView.vue'),
      meta: {
        title: '活動打卡紀錄',
        requiresAuth: true
      }
    },
    {
      path: '/winning/:id',
      name: 'Winning',
      component: () => import('../views/WinningView.vue'),
      meta: {
        title: '活動兌獎',
        requiresAuth: true
      }
    },
    {
      path: '/mapStore/:id?',
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
      meta: {
        title: '門市打卡紀錄',
        requiresAuth: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/ComingSoonView.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

/**
 * LINE LOGIN: user profile
 *       - 已登入:網頁導轉到此頁
 *       - 未登入:LINE Login後 redirect到此頁
 */
router.beforeEach(async (to, from, next) => {
  // Reset all layout
  const layoutStore = useLayoutStore()
  layoutStore.toggleDirection(false)
  layoutStore.toggleScanResult(false)
  layoutStore.closeNav()

  layoutStore.pageLoadToggle(true)

  if (to.name == 'Lobby') return next()

  // 開發模式停止line login
  if (DevMode) return next()

  if (!(to.meta && to.meta.requiresAuth)) return next()

  const { checkLineIsLoggedin, getLineAccess, getLineProfileAndAccess } = useLIFF()
  const isLoggedin = await checkLineIsLoggedin()
  const { authAlert } = useSweetAlert()
  const verifyLogin = async () => {
    try {
      let serviceT0ken = null
      if (['Album', 'Collected', 'MapStore'].includes(String(to.name))) {
        serviceT0ken = await getLineAccess(to.path)
      } else if (to.name === 'Activity' && to.params.id) {
        serviceT0ken = await getLineProfileAndAccess(String(to.params.id))
      }
      return serviceT0ken ? '' : '失敗'
    } catch (error) {
      return String(error)
    }
  }
  if (isLoggedin) {
    verifyLogin()
    return next()
  } else {
    return authAlert(
      '',
      async () => {
        const verifyFail = await verifyLogin()
        if (verifyFail === '') {
          return next()
        } else {
          return next({ name: 'Lobby' })
        }
      },
      () => {
        return next({ name: 'Lobby' })
      }
    )
  }
})

router.afterEach((to, from, failure) => {
  if (!failure) {
    if (to.meta.title) {
      document.title = to.meta.title as string
    }
    // TODO: GA4
    // sendToAnalytics(to.fullPath)
    const layoutStore = useLayoutStore()
    layoutStore.pageLoadToggle(false)
  }
})

export default router
