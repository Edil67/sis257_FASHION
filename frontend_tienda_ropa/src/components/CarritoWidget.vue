<template>
  <div class="carrito-container">
    <!-- Icono del carrito con badge -->
    <div class="carrito-icono" @click="router.push('/checkout')">
      <i class="fas fa-shopping-cart"></i>
      <span v-if="carritoStore.cantidadItems > 0" class="badge">
        {{ carritoStore.cantidadItems }}
      </span>
    </div>

    <!-- Dropdown del carrito -->
    <div v-if="mostrarCarrito" class="carrito-dropdown" ref="carritoDropdown">
      <div class="carrito-header">
        <h3>Mi Carrito</h3>
        <button @click="cerrarCarrito" class="btn-cerrar">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div v-if="carritoStore.estaVacio" class="carrito-vacio">
        <i class="fas fa-shopping-cart carrito-vacio-icon"></i>
        <p>Tu carrito está vacío</p>
        <small>¡Agrega algunos productos!</small>
      </div>

      <div v-else class="carrito-contenido">
        <!-- Items del carrito -->
        <div class="carrito-items">
          <div v-for="item in carritoStore.items" :key="item.id" class="carrito-item">
            <div class="item-imagen">
              <img
                :src="item.producto.imagenes || '/placeholder-product.jpg'"
                :alt="item.producto.nombre"
              />
            </div>

            <div class="item-detalles">
              <h4>{{ item.producto.nombre }}</h4>
              <p class="item-info">{{ item.producto.talla }} - {{ item.producto.color }}</p>
              <p class="item-precio">{{ carritoStore.formatearPrecio(item.producto.precio) }}</p>
            </div>

            <div class="item-controles">
              <div class="cantidad-controles">
                <button
                  @click="carritoStore.actualizarCantidad(item.id, item.cantidad - 1)"
                  class="btn-cantidad"
                  :disabled="item.cantidad <= 1"
                >
                  -
                </button>
                <span class="cantidad">{{ item.cantidad }}</span>
                <button
                  @click="carritoStore.actualizarCantidad(item.id, item.cantidad + 1)"
                  class="btn-cantidad"
                >
                  +
                </button>
              </div>
              <button
                @click="carritoStore.removerDelCarrito(item.id)"
                class="btn-remover"
                title="Eliminar del carrito"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>

            <div class="item-subtotal">
              {{ carritoStore.formatearPrecio(item.subtotal) }}
            </div>
          </div>
        </div>

        <!-- Total y botones -->
        <div class="carrito-footer">
          <div class="total">
            <strong>Total: {{ carritoStore.formatearPrecio(carritoStore.totalCarrito) }}</strong>
          </div>

          <div class="carrito-acciones">
            <button @click="carritoStore.vaciarCarrito()" class="btn btn-outline">
              Vaciar carrito
            </button>
            <button @click="irACheckout" class="btn btn-primary">Proceder al pago</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div v-if="mostrarCarrito" class="carrito-overlay" @click="cerrarCarrito"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCarritoStore } from '@/stores/carrito'

const router = useRouter()
const carritoStore = useCarritoStore()

const mostrarCarrito = ref(false)
const carritoDropdown = ref<HTMLElement>()

function toggleCarrito() {
  mostrarCarrito.value = !mostrarCarrito.value
}

function cerrarCarrito() {
  mostrarCarrito.value = false
}

function irACheckout() {
  cerrarCarrito()
  router.push('/checkout')
}

// Cerrar carrito al hacer click fuera
function handleClickOutside(event: Event) {
  if (carritoDropdown.value && !carritoDropdown.value.contains(event.target as Node)) {
    cerrarCarrito()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.carrito-container {
  position: relative;
}

.carrito-icono {
  position: relative;
  cursor: pointer;
  padding: 10px;
  font-size: 1.5rem;
  color: #333;
  transition: color 0.3s ease;
}

.carrito-icono:hover {
  color: #007bff;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
  min-width: 18px;
  text-align: center;
  font-weight: bold;
}

.carrito-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 400px;
  max-height: 600px;
  overflow-y: auto;
  z-index: 1000;
}

.carrito-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.carrito-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.carrito-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.btn-cerrar {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  padding: 4px;
}

.btn-cerrar:hover {
  color: #dc3545;
}

.carrito-vacio {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.carrito-vacio-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.carrito-contenido {
  max-height: 400px;
  overflow-y: auto;
}

.carrito-items {
  padding: 1rem;
}

.carrito-item {
  display: grid;
  grid-template-columns: 60px 1fr auto auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.carrito-item:last-child {
  border-bottom: none;
}

.item-imagen img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.item-detalles h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.item-info {
  font-size: 0.8rem;
  color: #666;
  margin: 0.25rem 0;
}

.item-precio {
  font-weight: bold;
  color: #007bff;
  margin: 0;
  font-size: 0.9rem;
}

.item-controles {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.cantidad-controles {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cantidad {
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.btn-cantidad:hover:not(:disabled) {
  background: #f8f9fa;
}

.btn-cantidad:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cantidad {
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.btn-remover {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 4px;
  font-size: 0.8rem;
}

.btn-remover:hover {
  color: #c82333;
}

.item-subtotal {
  font-weight: bold;
  font-size: 0.9rem;
  text-align: right;
}

.carrito-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  background: #f8f9fa;
}

.total {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.carrito-acciones {
  display: flex;
  gap: 0.5rem;
}

.btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
}

.btn-outline {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.btn-outline:hover {
  background: #f8f9fa;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

/* Responsive */
@media (max-width: 480px) {
  .carrito-dropdown {
    width: 300px;
    right: -50px;
  }

  .carrito-item {
    grid-template-columns: 50px 1fr auto;
    gap: 0.5rem;
  }

  .item-subtotal {
    grid-column: 1 / -1;
    text-align: center;
    margin-top: 0.5rem;
  }
}
</style>
