// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import DetailPage from '../views/DetailPage.vue'

const routes = [
  {
    path: '/:category?',
    name: 'Home',
    component: Home,
    props: route => ({ category: route.params.category || 'library' })
  },
  {
    path: '/detail/:category/:id',
    name: 'Detail',
    component: DetailPage,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
