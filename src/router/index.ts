import { createRouter, createWebHistory } from 'vue-router'
import LobbyView from '../views/LobbyView.vue'
import { useLIFF } from '@/composable/useLIFF'

// const removeQueryParams = (to: { query: {}; path: any; }) => {
//   if (Object.keys(to.query).length)
//     return { path: to.path, query: {} }
// }
const canUserAccess = async() => {
  const { getLineProfileAndAccess } = useLIFF()
  try {
    const userData = await getLineProfileAndAccess()
    return userData
  } catch (error) {
    console.error(error);
    return false
  }
}

const removeActivityID = (to: { query: {}; path: any; }) => {
  // 清空Activity
  if (sessionStorage.getItem('ac')) sessionStorage.removeItem('ac')
  if(to?.query?.ac){
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
      beforeEnter: [removeActivityID]
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
      path: '/direction',
      name: 'Direction',
      component: () => import('../views/DirectionView.vue')
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
        title: '門市打卡紀錄'
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
      component: () => import('../views/WrapUpView.vue'),
      meta: {
        title: '活動已結束'
      }
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

router.beforeEach(async (to, from, next) => {
  if (to.name == 'Lobby') {
    return next()
  }else if (to.meta && to.meta.requiresAuth) {
    const canAccess = await canUserAccess()
    console.log(canAccess);
    if (!canAccess) return next({name: 'Lobby'})
    return next()
  }else{
    return next()
  }
})

export default router
