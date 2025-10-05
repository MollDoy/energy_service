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
    },
    {
        path: "/reportInfo/:reportId",
        name: "reportInfo",
        component: () => import("../views/ReportInfo.vue"),
        props: route => ({...route.params, reportId: parseInt(route.params.id)}),
    }
]

export default createRouter({
  history: createWebHistory(),
  routes
})