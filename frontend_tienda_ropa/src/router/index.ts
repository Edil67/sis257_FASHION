import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores'
import { getTokenFromLocalStorage } from '@/helpers'
import MainLayout from '@/views/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      {
        path: 'empleados',
        name: 'empleados',
        component: () => import('../views/EmpleadoView.vue'),
      },
      {
        path: 'productos',
        name: 'productos',
        component: () => import('../views/ProductoView.vue'),
      },
      { path: 'ventas', name: 'ventas', component: () => import('../views/VentaView.vue') },
      // {
      //   path: 'registrar-venta',
      //   name: 'registrar-venta',
      //   component: () => import('@/views/RegistrarVentaView.vue'),
      //   meta: { requiresAuth: true }
      // },
      { path: 'cliente', name: 'clientes', component: () => import('../views/ClienteView.vue') },
      {
        path: 'categoria',
        name: 'categoria',
        component: () => import('../views/CategoriaView.vue'),
      },
    ],
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
  },
  {
    path: '/confirmacion/:referencia',
    name: 'ConfirmacionCompra',
    component: () => import('../views/ConfirmacionCompra.vue'),
  },
  { path: '/login', name: 'login', component: LoginView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Implementación del guard de navegación global
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/', '/checkout']
  const isPublicRoute = publicPages.includes(to.path) || to.path.startsWith('/confirmacion/')
  const authRequired = !isPublicRoute
  const authStore = useAuthStore()

  // Verificar si la ruta requiere autenticación
  if (authRequired && !getTokenFromLocalStorage()) {
    if (authStore) authStore.logout() // Limpiar el estado del store
    authStore.returnUrl = to.path // Guardar la URL para redirigir después del login
    return next('/login') // Redirigir al login
  }

  next() // Continuar con la navegación
})

export default router
