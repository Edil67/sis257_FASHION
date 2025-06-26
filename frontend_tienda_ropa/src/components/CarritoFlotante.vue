<template>
  <div class="carrito-flotante" v-if="!carritoStore.estaVacio">
    <button 
      @click="abrirCarrito"
      class="btn-carrito-flotante"
      :class="{ 'pulse': hayNuevosItems }"
    >
      <i class="fas fa-shopping-cart"></i>
      <span class="badge-carrito">{{ carritoStore.cantidadItems }}</span>
    </button>
    
    <!-- Mini preview del carrito -->
    <div v-if="mostrarPreview" class="carrito-preview">
      <div class="preview-header">
        <h4>Carrito de Compras</h4>
        <button @click="cerrarPreview" class="btn-cerrar">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="preview-items">
        <div 
          v-for="item in carritoStore.items.slice(0, 3)" 
          :key="item.id"
          class="preview-item"
        >
          <img :src="item.producto.imagenes" :alt="item.producto.nombre">
          <div class="item-info">
            <span class="nombre">{{ item.producto.nombre }}</span>
            <span class="precio">{{ carritoStore.formatearPrecio(item.subtotal) }}</span>
          </div>
          <span class="cantidad">x{{ item.cantidad }}</span>
        </div>
        
        <div v-if="carritoStore.items.length > 3" class="mas-items">
          +{{ carritoStore.items.length - 3 }} productos más
        </div>
      </div>
      
      <div class="preview-footer">
        <div class="total">
          <strong>Total: {{ carritoStore.formatearPrecio(carritoStore.totalCarrito) }}</strong>
        </div>
        <div class="preview-actions">
          <button @click="irACheckout" class="btn btn-primary">
            <i class="fas fa-credit-card"></i>
            Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCarritoStore } from '@/stores/carrito'

const router = useRouter()
const carritoStore = useCarritoStore()

const mostrarPreview = ref(false)
const hayNuevosItems = ref(false)
const cantidadAnterior = ref(0)

// Detectar cuando se agregan nuevos items para hacer el pulse
watch(() => carritoStore.cantidadItems, (nuevaCantidad) => {
  if (nuevaCantidad > cantidadAnterior.value) {
    hayNuevosItems.value = true
    setTimeout(() => {
      hayNuevosItems.value = false
    }, 2000)
  }
  cantidadAnterior.value = nuevaCantidad
})

function abrirCarrito() {
  mostrarPreview.value = !mostrarPreview.value
}

function cerrarPreview() {
  mostrarPreview.value = false
}

function irACheckout() {
  cerrarPreview()
  router.push('/checkout')
}
</script>

<style scoped>
.carrito-flotante {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 999;
}

.btn-carrito-flotante {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.btn-carrito-flotante:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
}

.btn-carrito-flotante.pulse {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.badge-carrito {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 0.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.carrito-preview {
  position: absolute;
  bottom: 80px;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  width: 350px;
  max-height: 500px;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.preview-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.btn-cerrar {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.btn-cerrar:hover {
  background: #e9ecef;
  color: #333;
}

.preview-items {
  max-height: 250px;
  overflow-y: auto;
  padding: 1rem;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.preview-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.preview-item img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

.item-info {
  flex: 1;
}

.item-info .nombre {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.item-info .precio {
  font-size: 0.8rem;
  color: #007bff;
  font-weight: 600;
}

.cantidad {
  font-size: 0.8rem;
  color: #666;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
}

.mas-items {
  text-align: center;
  color: #666;
  font-size: 0.8rem;
  padding: 0.5rem 0;
  font-style: italic;
}

.preview-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  background: #f8f9fa;
}

.total {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #333;
}

.preview-actions {
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .carrito-flotante {
    bottom: 1rem;
    right: 1rem;
  }
  
  .carrito-preview {
    width: 300px;
    right: -50px;
  }
}

@media (max-width: 480px) {
  .carrito-preview {
    width: 280px;
    right: -60px;
  }
}
</style>
