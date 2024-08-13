import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
        name: 'lubbock',
        component: () => import('@/views/LubbockView.vue')
    },
    {
        path: '/lubbockheat',
        name: 'lubbockheat',
        component: () => import('@/views/LubbockHeatMap.vue')
    }
  ]
})

export default router
