import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/cliente',
      name: 'clientes',
      component: () => import('../views/ClienteView.vue'),
    },
    {
      path: '/producto',
      name: 'producto',
      component: () => import('../views/ProductoView.vue'),
    },
    {
      path: '/venta',
      name: 'venta',
      component: () => import('../views/VentaView.vue'),
    },
    {
      path: '/ventaDetalle',
      name: 'ventaDetalle',
      component: () => import('../views/VentadetalleView.vue'),
    },
    {
      path: '/categoria',
      name: 'categoria',
      component: () => import('../views/CategoriaView.vue'),
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: () => import('../views/UsuarioView.vue'),
    },
    {
      path: '/empleado',
      name: 'empleado',
      component: () => import('../views/EmpleadoView.vue'),
    },
  ],
})

export default router
