import { createRouter, createWebHistory } from 'vue-router'
import GensparkHome from '@/pages/GensparkHome.vue'
import ChatHome from '@/pages/ChatHome.vue'
import ChatHomeFull from '@/pages/ChatHomeFull.vue'
import HelloWorld from '@/pages/HelloWorld.vue'
import ChatHomeSimple from '@/pages/ChatHomeSimple.vue'
import TestSimple from '@/pages/TestSimple.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ChatHomeFull,
    meta: {
      title: 'AI视频混剪V2.0'
    }
  },
  {
    path: '/genspark',
    name: 'Genspark',
    component: GensparkHome,
    meta: {
      title: 'Genspark 超级智能体 - AI视频混剪'
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatHome,
    meta: {
      title: 'AI对话 - 视频混剪助手'
    }
  },
  {
    path: '/full',
    name: 'ChatHomeFull',
    component: ChatHomeFull,
    meta: {
      title: 'AI视频混剪V2.0 - 完整版'
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
    path: '/testsimple',
    name: 'TestSimple',
    component: TestSimple,
    meta: {
      title: '简单测试'
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
