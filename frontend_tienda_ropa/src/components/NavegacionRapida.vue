<template>
  <div class="navegacion-rapida">
    <div class="nav-item" v-if="$route.path !== '/'">
      <router-link to="/" class="nav-link">
        <i class="fas fa-home"></i>
        <span>Inicio</span>
      </router-link>
    </div>
    
    <div class="nav-item" v-if="$route.path !== '/checkout' && !carritoStore.estaVacio">
      <router-link to="/checkout" class="nav-link checkout">
        <i class="fas fa-shopping-cart"></i>
        <span>Checkout</span>
        <div class="badge" v-if="carritoStore.cantidadItems > 0">
          {{ carritoStore.cantidadItems }}
        </div>
      </router-link>
    </div>

    <!-- Información de carrito en checkout -->
    <div class="nav-item" v-if="$route.path === '/checkout'">
      <div class="carrito-info">
        <i class="fas fa-box"></i>
        <span>{{ carritoStore.cantidadItems }} productos</span>
        <span class="total">{{ carritoStore.formatearPrecio(carritoStore.totalCarrito) }}</span>
      </div>
    </div>

    <!-- Botón para continuar comprando desde checkout -->
    <div class="nav-item" v-if="$route.path === '/checkout'">
      <router-link to="/#product-section" class="nav-link continue">
        <i class="fas fa-plus"></i>
        <span>Seguir comprando</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCarritoStore } from '@/stores/carrito'

const carritoStore = useCarritoStore()
</script>

<style scoped>
.navegacion-rapida {
  position: fixed;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  z-index: 500;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  background: white;
  border-radius: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.nav-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  position: relative;
  font-size: 0.9rem;
  font-weight: 500;
}

.nav-link:hover {
  color: #007bff;
}

.nav-link.checkout {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.nav-link.checkout:hover {
  color: white;
  background: linear-gradient(135deg, #218838 0%, #1ea688 100%);
}

.nav-link.continue {
  background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%);
  color: white;
}

.nav-link.continue:hover {
  color: white;
  background: linear-gradient(135deg, #138496 0%, #6610f2 100%);
}

.nav-link i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.7rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.carrito-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #333;
  font-size: 0.9rem;
  font-weight: 500;
  background: #f8f9fa;
}

.carrito-info i {
  color: #007bff;
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.total {
  color: #28a745;
  font-weight: 600;
  margin-left: auto;
}

/* Animación de entrada */
.nav-item {
  animation: slideInLeft 0.5s ease-out forwards;
}

.nav-item:nth-child(2) {
  animation-delay: 0.1s;
}

.nav-item:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .navegacion-rapida {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    top: auto;
    transform: none;
    flex-direction: row;
    justify-content: space-around;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 25px;
    padding: 0.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .nav-item {
    flex: 1;
    margin: 0;
    border-radius: 20px;
  }
  
  .nav-link span {
    display: none;
  }
  
  .nav-link {
    justify-content: center;
    padding: 0.75rem;
  }
  
  .carrito-info {
    justify-content: center;
    padding: 0.75rem;
  }
  
  .carrito-info span:first-of-type {
    display: none;
  }
}

@media (max-width: 480px) {
  .navegacion-rapida {
    left: 0.5rem;
    right: 0.5rem;
  }
  
  .nav-link {
    padding: 0.5rem;
  }
}
</style>
