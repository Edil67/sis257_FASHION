<template>
  <!-- Header -->
  <header>
    <!-- Header desktop -->
    <div class="container-menu-desktop" :class="{ 'navbar-solid': !isTransparent }">
      <!-- Topbar -->
      <div v-if="!isLoggedIn" class="top-bar" :class="{ 'navbar-solid': !isTransparent }">
        <div class="content-topbar flex-sb-m h-full container">
          <div class="left-top-bar" :style="{ color: !isTransparent ? '#333' : '' }">
            Envío gratuito para pedidos estándar superiores a 100Bs
          </div>

          <div class="right-top-bar flex-w h-full">
            <a
              href="#"
              class="flex-c-m trans-04 p-lr-25"
              :style="{ color: !isTransparent ? '#333' : '' }"
            >
              Ayuda & Preguntas Frecuentes
            </a>

            <router-link
              to="/login"
              class="flex-c-m trans-04 p-lr-25"
              :style="{ color: !isTransparent ? '#333' : '' }"
            >
              Iniciar Sesión
            </router-link>

            <a
              href="#"
              class="flex-c-m trans-04 p-lr-25"
              :style="{ color: !isTransparent ? '#333' : '' }"
            >
              ES
            </a>

            <a
              href="#"
              class="flex-c-m trans-04 p-lr-25"
              :style="{ color: !isTransparent ? '#333' : '' }"
            >
              BOB
            </a>
          </div>
        </div>
      </div>

      <!-- Topbar for logged-in users -->
      <div v-else class="top-bar" :class="{ 'navbar-solid': !isTransparent }">
        <div class="content-topbar flex-sb-m h-full container">
          <div class="left-top-bar" :style="{ color: !isTransparent ? '#333' : '' }">
            Bienvenido, {{ authStore.user || 'Usuario' }}
          </div>

          <div class="right-top-bar flex-w h-full">
            <router-link
              to="/empleados"
              class="flex-c-m trans-04 p-lr-25"
              :style="{ color: !isTransparent ? '#333' : '' }"
            >
              Empleados
            </router-link>

            <router-link
              to="/productos"
              class="flex-c-m trans-04 p-lr-25"
              :style="{ color: !isTransparent ? '#333' : '' }"
            >
              Productos
            </router-link>

            <router-link
              to="/ventas"
              class="flex-c-m trans-04 p-lr-25"
              :style="{ color: !isTransparent ? '#333' : '' }"
            >
              Ventas
            </router-link>

            <router-link
              to="/cliente"
              class="flex-c-m trans-04 p-lr-25"
              :style="{ color: !isTransparent ? '#333' : '' }"
            >
              Clientes
            </router-link>

            <router-link
              to="/categoria"
              class="flex-c-m trans-04 p-lr-25"
              :style="{ color: !isTransparent ? '#333' : '' }"
            >
              Categorías
            </router-link>
          </div>
        </div>
      </div>

      <div class="wrap-menu-desktop" :class="{ 'navbar-solid': !isTransparent }">
        <nav class="limiter-menu-desktop container">
          <!-- Logo desktop -->
          <router-link to="/" class="logo">
            <img src="@/assets/images/icons/logo-01.png" alt="IMG-LOGO" />
          </router-link>

          <!-- Menu desktop -->
          <div class="menu-desktop">
            <ul class="main-menu">
              <li class="active-menu">
                <router-link to="/" @click.native="scrollToSection($event, 'slider-section')"
                  >Inicio</router-link
                >
              </li>

              <li>
                <a href="#product-section" @click="scrollToSection($event, 'product-section')"
                  >Tienda</a
                >
              </li>

              <li>
                <a href="#banner-section" @click="scrollToSection($event, 'banner-section')"
                  >Categorías</a
                >
              </li>
              <li>
                <a href="#footer-section" @click="scrollToSection($event, 'footer-section')"
                  >Contacto</a
                >
              </li>
            </ul>
          </div>

          <!-- Icon header -->
          <div class="wrap-icon-header flex-w flex-r-m">
            <div class="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 js-show-modal-search">
              <i class="zmdi zmdi-search"></i>
            </div>

            <!-- Componente del carrito -->
            <div class="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11">
              <CarritoWidget />
            </div>

            <div
              v-if="isLoggedIn"
              class="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11"
              @click="authStore.logout"
            >
              <i class="zmdi zmdi-power"></i>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores'
import CarritoWidget from '@/components/CarritoWidget.vue'

const authStore = useAuthStore()
const isLoggedIn = computed(() => !!authStore.token)

// Estado para el navbar dinámico
const isTransparent = ref(true)

// Función para manejar el scroll y cambiar el estilo del navbar
const handleScroll = () => {
  const scrollPosition = window.scrollY

  // Si estamos al inicio de la página (en el slider), navbar transparente
  if (scrollPosition < 50) {
    isTransparent.value = true
  } else {
    isTransparent.value = false
  }
}

// Función para scroll suave a las secciones
const scrollToSection = (event: Event, sectionId: string) => {
  event.preventDefault()

  const element = document.getElementById(sectionId)
  if (element) {
    // Calcular la altura del header para el offset
    const header = document.querySelector('header')
    const headerHeight = header ? header.offsetHeight : 0

    // Obtener la posición del elemento menos la altura del header
    const elementPosition = element.offsetTop - headerHeight

    // Scroll suave a la posición
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    })

    // Cerrar menú móvil si está abierto
    const menuMobile = document.querySelector('.menu-mobile')
    if (menuMobile) {
      menuMobile.classList.remove('show-menu-mobile')
    }

    // Remover clase active de todos los elementos del menú
    const menuItems = document.querySelectorAll('.main-menu li, .main-menu-m li')
    menuItems.forEach((item) => item.classList.remove('active-menu'))

    // Agregar clase active al elemento clickeado
    const clickedElement = (event.target as HTMLElement).closest('li')
    if (clickedElement) {
      clickedElement.classList.add('active-menu')
    }
  }
}

onMounted(() => {
  // Agregar listener para el scroll
  window.addEventListener('scroll', handleScroll)
  // Ejecutar una vez al cargar para establecer el estado inicial
  handleScroll()

  // Esperar a que jQuery esté disponible
  setTimeout(() => {
    const $ = (window as any).$
    if ($) {
      // Funcionalidad del carrito
      $('.js-show-cart').on('click', function () {
        $('.js-panel-cart').addClass('show-header-cart')
      })

      $('.js-hide-cart').on('click', function () {
        $('.js-panel-cart').removeClass('show-header-cart')
      })

      // Funcionalidad del modal de búsqueda
      $('.js-show-modal-search').on('click', function () {
        $('.js-hide-modal-search').addClass('show-modal-search')
      })

      $('.js-hide-modal-search').on('click', function () {
        $('.js-hide-modal-search').removeClass('show-modal-search')
      })

      // Funcionalidad del menú móvil
      $('.btn-show-menu-mobile').on('click', function (this: HTMLElement) {
        $(this).toggleClass('is-active')
        $('.menu-mobile').slideToggle()
      })

      console.log('Funcionalidades del NavBar inicializadas')
    }
  }, 1000)
})

onUnmounted(() => {
  // Limpiar el listener del scroll
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Estilos para navegación suave */
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: transparent;
  /* Transparente por defecto (slider) */
  transition: all 0.3s ease;
}

/* Fondo blanco para otras secciones */
.navbar-solid {
  background: white !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
}

/* Asegurar que el contenedor también tenga fondo blanco cuando es sólido */
.navbar-solid .container-menu-desktop {
  background: white !important;
}

/* El top-bar también debe tener fondo cuando es sólido */
.navbar-solid .top-bar {
  background: white !important;
}

/* Asegurar que el contenido no quede oculto detrás del header fijo */
:deep(#slider-section) {
  padding-top: 0;
}

/* Estilo para enlaces activos */
.main-menu li.active-menu > a,
.main-menu-m li.active-menu > a {
  color: #717fe0 !important;
}

/* Transición suave para los enlaces */
.main-menu a,
.main-menu-m a {
  transition: color 0.3s ease;
}

.main-menu a:hover,
.main-menu-m a:hover {
  color: #717fe0 !important;
}

/* Estilo especial para el enlace de checkout */
.checkout-link {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  padding: 8px 16px !important;
  border-radius: 20px !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
}

.checkout-link:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
  color: white !important;
}

/* Mejoras para el menú móvil */
.menu-mobile {
  transition: transform 0.3s ease;
}

.show-menu-mobile .menu-mobile {
  transform: translateX(0);
}

/* Animación para el scroll suave */
html {
  scroll-behavior: smooth;
}

/* Offset para las secciones cuando hay header fijo */
div[id*='-section'] {
  scroll-margin-top: 120px;
  /* Ajusta según la altura de tu header */
}

@media (max-width: 991px) {
  div[id*='-section'] {
    scroll-margin-top: 80px;
    /* Menos offset en móvil */
  }
}
</style>
