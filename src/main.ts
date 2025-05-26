import { ViteSSG } from 'vite-ssg'
import { routes } from './router.ts'
import './assets/styles/main.css'
import App from './App.vue'

export const createApp = ViteSSG(App, { routes })
