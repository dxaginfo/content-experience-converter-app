import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('../views/EditorView.vue')
  },
  {
    path: '/templates',
    name: 'templates',
    component: () => import('../views/TemplatesView.vue')
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: () => import('../views/AnalyticsView.vue')
  },
  {
    path: '/preview/:id',
    name: 'preview',
    component: () => import('../views/PreviewView.vue')
  },
  {
    path: '/consistency-checker',
    name: 'consistency-checker',
    component: () => import('../views/ConsistencyCheckerView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router