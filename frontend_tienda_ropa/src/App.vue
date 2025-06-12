<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { useAuthStore } from '@/stores/index'
const authStore = useAuthStore()
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center" href="#">
        <img alt="Vue logo" src="@/assets/logo.svg" width="40" height="40" class="me-2" />
        Fashion Store
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item"><RouterLink class="nav-link" to="/">Home</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/cliente">Clientes</RouterLink></li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/producto">Productos</RouterLink>
          </li>
          <li class="nav-item"><RouterLink class="nav-link" to="/venta">Ventas</RouterLink></li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/categoria">Categoria</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/empleado">Empleado</RouterLink>
          </li>
          <li class="nav-item"><RouterLink class="nav-link" to="/usuario">Usuario</RouterLink></li>
          <li class="nav-item" v-if="authStore.token">
            <a class="nav-link" href="#" @click.prevent="authStore.logout()">Cerrar Sesión</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <main class="container my-4">
    <HelloWorld msg="¡Bienvenido a Fashion Store!" />
    <RouterView />
  </main>
</template>

<style scoped>
/* Resalta el enlace activo */
.nav-link.router-link-exact-active {
  background: #fff !important;
  color: #0d6efd !important;
  border-radius: 0.25rem;
}
</style>
