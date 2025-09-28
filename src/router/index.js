import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { 
        path: '/reports', 
        name: 'reports', 
        component: () => import("../views/Reports.vue") 
    },
    {
        path: "/",
        redirect: "/reports"
    }
]

export default createRouter({
  history: createWebHistory(),
  routes
})