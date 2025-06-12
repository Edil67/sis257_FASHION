<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
import { useAuthStore } from '@/stores/main'
import { ref } from 'vue'
const authStore = useAuthStore()
</script>

<template>
  <RouterLink v-if="!authStore.token" to="/login"></RouterLink>
  <span v-else>
    <div class="wrapper">
      <nav>
        <div id="wrapper">
          <ul
            class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            id="accordionSidebar"
          >
            <a
              class="sidebar-brand d-flex align-items-center justify-content-center"
              href="index.html"
            >
              <div class="sidebar-brand-icon rotate-n-15">
                <i class="fas fa-hamburger"></i>
              </div>
              <div class="sidebar-brand-text mx-3">LA <sup>TERZA</sup></div>
            </a>

            <hr class="sidebar-divider my-0" />

            <li class="nav-item active">
              <RouterLink to="/" class="nav-link" href=""
                ><i class="fas fa-fw fa-home"> </i> <span>Inicio</span></RouterLink
              >
            </li>

            <hr class="sidebar-divider" />

            <li class="nav-item">
              <a
                class="nav-link collapsed"
                href="#"
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="true"
                aria-controls="collapseTwo"
              >
                <i class="fas fa-cash-register"></i>
                <span>Ventas</span>
              </a>
              <div
                id="collapseTwo"
                class="collapse"
                aria-labelledby="headingTwo"
                data-parent="#accordionSidebar"
              >
                <div class="bg-white py-2 collapse-inner rounded">
                  <h6 class="collapse-header">Gestión de Ventas:</h6>
                  <RouterLink to="/ventas" class="collapse-item">Ventas</RouterLink>
                  <RouterLink to="/ventadetalles" class="collapse-item">
                    Detalle de Ventas</RouterLink
                  >
                </div>
              </div>
            </li>

            <li class="nav-item">
              <a
                class="nav-link collapsed"
                href="#"
                data-toggle="collapse"
                data-target="#collapseUtilities"
                aria-expanded="true"
                aria-controls="collapseUtilities"
              >
                <i class="fas fa-drumstick-bite"></i>
                <span>Productos</span>
              </a>
              <div
                id="collapseUtilities"
                class="collapse"
                aria-labelledby="headingUtilities"
                data-parent="#accordionSidebar"
              >
                <div class="bg-white py-2 collapse-inner rounded">
                  <h6 class="collapse-header">Gestion de Productos:</h6>
                  <RouterLink to="/productos" class="collapse-item">Productos</RouterLink>
                  <RouterLink to="/categorias" class="collapse-item">Categorias</RouterLink>
                </div>
              </div>
            </li>

            <li class="nav-item" v-if="authStore.user == 'juansustacha'">
              <a
                class="nav-link collapsed"
                href="#"
                data-toggle="collapse"
                data-target="#collapsePages"
                aria-expanded="true"
                aria-controls="collapsePages"
              >
                <i class="fas fa-user-tie"></i>
                <span>Personal</span>
              </a>
              <div
                id="collapsePages"
                class="collapse"
                aria-labelledby="headingPages"
                data-parent="#accordionSidebar"
              >
                <div class="bg-white py-2 collapse-inner rounded">
                  <h6 class="collapse-header">Gestión del Personal:</h6>

                  <RouterLink to="/usuarios" class="collapse-item">Usuario</RouterLink>
                  <RouterLink to="/empleados" class="collapse-item">Empleado</RouterLink>
                </div>
              </div>
            </li>

            <li class="nav-item">
              <RouterLink to="/clientes" class="nav-link">
                <i class="fas fa-fw fa-users"></i>
                <span>Cliente</span>
              </RouterLink>
            </li>
          </ul>

          <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">
              <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <a
                  @click="authStore.logout()"
                  href="#"
                  class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                >
                  <i class="fas fa-sign-out-alt fa-sm text-white-50"></i> Cerrar Sesión
                </a>
                <ul class="navbar-nav ml-auto">
                  <div class="topbar-divider d-none d-sm-block"></div>

                  <li class="nav-item dropdown no-arrow">
                    <a
                      class="nav-link dropdown-toggle"
                      href="#"
                      id="userDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <span class="mr-2 d-none d-lg-inline text-gray-600 small">
                        <HelloWorld
                          :msg="'BIENVENIDO ' + (authStore.user ? '-' + authStore.user : '')"
                        />
                      </span>
                    </a>

                    <div
                      class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="userDropdown"
                    >
                      <a class="dropdown-item" href="#">
                        <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Perfil
                      </a>
                      <a class="dropdown-item" href="#">
                        <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                        Configuración
                      </a>
                    </div>
                  </li>
                </ul>
              </nav>
              <div class="container-fluid">
                <RouterView ENDPOINT_API="ventadetalles"></RouterView>
              </div>
            </div>

            <footer class="sticky-footer bg-white">
              <div class="container my-auto">
                <div class="copyright text-center my-auto"></div>
              </div>
            </footer>
          </div>
        </div>
      </nav>
    </div>
  </span>
</template>

<style></style>
