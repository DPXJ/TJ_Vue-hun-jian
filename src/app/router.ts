import { createRouter, createWebHistory } from 'vue-router'
import ChatHomeFull from '@/pages/ChatHomeFull.vue'
import HelloWorld from '@/pages/HelloWorld.vue'
import ChatHomeSimple from '@/pages/ChatHomeSimple.vue'

const routes = [
  {
    path: '/',
    name: 'ChatHome',
    component: ChatHomeFull,
    meta: {
      title: 'AI视频混剪V2.0'
    }
  },
  {
    path: '/simple',
    name: 'ChatHomeSimple',
    component: ChatHomeSimple,
    meta: {
      title: '简化版聊天'
    }
  },
  {
    path: '/test',
    name: 'Test',
    component: HelloWorld,
    meta: {
      title: '测试页面'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  next()
})

export default router
