import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ToolsView from '@/views/ToolsView.vue';
import BlogView from '@/views/BlogView.vue';

export const routes: RouteRecordRaw[] = [
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
  {
    path: '/blog',
    name: 'blog',
    component: BlogView,
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: BlogView,
  },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
