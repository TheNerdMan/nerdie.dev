import { createMemoryHistory, createRouter } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ToolsView from '@/views/ToolsView.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/tools',
    name: 'tools',
    component: ToolsView,
  },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
