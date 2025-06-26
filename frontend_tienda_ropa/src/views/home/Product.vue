<template>
  <!-- Producto -->
  <section class="bg0 p-t-23 p-b-140">
    <div class="container">
      <div class="p-b-10">
        <h3 class="ltext-103 cl5">Vista General del Producto</h3>

        <!-- Información de filtrado -->
        <div class="flex-w flex-sb-m p-t-10">
          <div class="flex-w flex-l-m">
            <span class="stext-102 cl6">
              <template v-if="categoriaSeleccionada === null">
                Mostrando {{ productosAMostrar.length }} de
                {{ productosFiltrados.length }} productos
              </template>
              <template v-else>
                Mostrando {{ productosAMostrar.length }} de
                {{ productosFiltrados.length }} productos en "{{
                  categorias.find((c) => c.id === categoriaSeleccionada)?.nombre
                }}"
              </template>
            </span>
          </div>
        </div>
      </div>

      <div class="flex-w flex-sb-m p-b-52">
        <div class="flex-w flex-l-m filter-tope-group m-tb-10">
          <button
            class="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5"
            :class="{ 'how-active1': categoriaSeleccionada === null }"
            data-filter="*"
            @click="filtrarPorCategoria(null)"
          >
            Todos los Productos
          </button>

          <template v-if="cargando">
            <span class="stext-106 cl6 m-r-32 m-tb-5">Cargando categorías...</span>
          </template>

          <button
            v-for="categoria in categorias"
            :key="categoria.id"
            class="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5"
            :class="{ 'how-active1': categoriaSeleccionada === categoria.id }"
            :data-filter="`.categoria-${categoria.id}`"
            @click="filtrarPorCategoria(categoria.id)"
          >
            {{ categoria.nombre }}
          </button>
        </div>
      </div>

      <div class="row isotope-grid">
        <!-- Indicador de carga de productos -->
        <div v-if="cargandoProductos" class="col-12 text-center p-t-50 p-b-50">
          <span class="stext-106 cl6">Cargando productos...</span>
        </div>

        <!-- Mensaje cuando no hay productos -->
        <div v-else-if="productosAMostrar.length === 0" class="col-12 text-center p-t-50 p-b-50">
          <span class="stext-106 cl6">No se encontraron productos en esta categoría.</span>
        </div>

        <!-- Productos dinámicos -->
        <div
          v-for="producto in productosAMostrar"
          :key="producto.id"
          class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item"
          :class="`categoria-${producto.categoria.id}`"
        >
          <!-- Block2 -->
          <div class="product-card">
            <div class="product-image-container">
              <img :src="producto.imagenes" :alt="producto.nombre" class="product-image" />

              <!-- Badge de categoría -->
              <div class="category-badge">
                {{ producto.categoria.nombre }}
              </div>

              <!-- Badge de stock -->
              <div
                class="stock-badge"
                :class="{ 'low-stock': producto.stock <= 5, 'out-of-stock': producto.stock === 0 }"
              >
                <i class="fas fa-boxes"></i>
                {{ producto.stock }}
              </div>

              <div class="product-overlay">
                <button
                  v-if="producto.stock > 0"
                  @click="agregarAlCarrito(producto)"
                  class="add-to-cart-btn"
                >
                  <i class="fas fa-shopping-cart"></i>
                  Agregar al carrito
                </button>
                <div v-else class="out-of-stock-message">
                  <i class="fas fa-times-circle"></i>
                  Sin stock disponible
                </div>
              </div>
            </div>

            <div class="product-info-card">
              <div class="product-main-info">
                <h4 class="product-title">
                  {{ producto.nombre }}
                </h4>

                <div class="product-price">Bs {{ Number(producto.precio).toFixed(2) }}</div>
              </div>

              <!-- Información detallada del producto -->
              <div class="product-details">
                <div class="product-attributes">
                  <div class="attribute-item">
                    <span class="attribute-label">
                      <i class="fas fa-tag"></i>
                      Talla:
                    </span>
                    <span class="attribute-value talla-badge">{{ producto.talla }}</span>
                  </div>

                  <div class="attribute-item">
                    <span class="attribute-label">
                      <i class="fas fa-palette"></i>
                      Color:
                    </span>
                    <span class="attribute-value">
                      {{ producto.color }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load more -->
      <div v-if="hayMasProductos" class="flex-c-m flex-w w-full p-t-45">
        <button
          @click="cargarMasProductos"
          class="flex-c-m stext-101 cl5 size-103 bg2 bor1 hov-btn1 p-lr-15 trans-04"
          style="border: none; background: inherit"
        >
          Cargar más
        </button>
      </div>

      <!-- Mensaje cuando se han mostrado todos los productos -->
      <div v-else-if="productosAMostrar.length > 0" class="flex-c-m flex-w w-full p-t-45">
        <span class="stext-101 cl6">Se han mostrado todos los productos</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Categoria } from '@/models/categoria'
import type { Producto } from '@/models/producto'
import { useCarritoStore } from '@/stores/carrito'
import axios from '@/plugins/axios'

// Store del carrito
const carritoStore = useCarritoStore()

// Estado reactivo
const categorias = ref<Categoria[]>([])
const productos = ref<Producto[]>([])
const cargando = ref(false)
const cargandoProductos = ref(false)
const categoriaSeleccionada = ref<number | null>(null)
const productosPorPagina = 16
const paginaActual = ref(1)

// Función para agregar al carrito
const agregarAlCarrito = (producto: Producto) => {
  if (producto.stock > 0) {
    carritoStore.agregarAlCarrito(producto, 1)
    // Puedes agregar una notificación aquí
    console.log(`${producto.nombre} agregado al carrito`)
  }
}

// Función para cargar las categorías desde el API
const cargarCategorias = async () => {
  try {
    cargando.value = true
    const response = await axios.get('/categorias')
    categorias.value = response.data
  } catch (error) {
    console.error('Error al cargar las categorías:', error)
  } finally {
    cargando.value = false
  }
}

// Función para cargar los productos desde el API
const cargarProductos = async () => {
  try {
    cargandoProductos.value = true
    const response = await axios.get('/productos')
    productos.value = response.data
  } catch (error) {
    console.error('Error al cargar los productos:', error)
  } finally {
    cargandoProductos.value = false
  }
}

// Productos filtrados por categoría
const productosFiltrados = computed(() => {
  if (categoriaSeleccionada.value === null) {
    return productos.value
  }
  return productos.value.filter((producto) => producto.categoria.id === categoriaSeleccionada.value)
})

// Productos a mostrar (paginados)
const productosAMostrar = computed(() => {
  const inicio = 0
  const fin = paginaActual.value * productosPorPagina
  return productosFiltrados.value.slice(inicio, fin)
})

// Verificar si hay más productos para cargar
const hayMasProductos = computed(() => {
  return productosAMostrar.value.length < productosFiltrados.value.length
})

// Función para filtrar por categoría
const filtrarPorCategoria = (categoriaId: number | null) => {
  categoriaSeleccionada.value = categoriaId
  paginaActual.value = 1 // Resetear paginación al cambiar filtro

  // Scroll suave hacia el inicio de los productos
  const productGrid = document.querySelector('.isotope-grid')
  if (productGrid) {
    productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Función para cargar más productos
const cargarMasProductos = () => {
  if (hayMasProductos.value) {
    paginaActual.value++
  }
}

// Función para obtener color hexadecimal aproximado
const getColorHex = (colorName: string): string => {
  const colores: { [key: string]: string } = {
    rojo: '#dc3545',
    azul: '#007bff',
    verde: '#28a745',
    amarillo: '#ffc107',
    negro: '#343a40',
    blanco: '#f8f9fa',
    gris: '#6c757d',
    rosa: '#e83e8c',
    morado: '#6f42c1',
    naranja: '#fd7e14',
    cafe: '#8B4513',
    café: '#8B4513',
    marrón: '#8B4513',
    marron: '#8B4513',
    beige: '#F5F5DC',
    celeste: '#87CEEB',
    turquesa: '#40E0D0',
    violeta: '#8A2BE2',
    dorado: '#FFD700',
    plateado: '#C0C0C0',
    coral: '#FF7F50',
    salmon: '#FA8072',
    lima: '#32CD32',
    oliva: '#808000',
  }

  const colorLower = colorName.toLowerCase().trim()
  return colores[colorLower] || '#6c757d' // Color gris por defecto
}

// Cargar datos al montar el componente
onMounted(() => {
  cargarCategorias()
  cargarProductos()
})
</script>

<style scoped>
/* Tarjeta de producto moderna */
.product-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Contenedor de imagen uniforme */
.product-image-container {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: #f8f9fa;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* Badges */
.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
}

.stock-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #28a745;
  color: white;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 2;
}

.stock-badge.low-stock {
  background: #ffc107;
  color: #212529;
}

.stock-badge.out-of-stock {
  background: #dc3545;
}

/* Overlay de acciones */
.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 3;
}

.product-image-container:hover .product-overlay {
  opacity: 1;
  visibility: visible;
}

.add-to-cart-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-to-cart-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.out-of-stock-message {
  background: rgba(220, 53, 69, 0.95);
  color: white;
  padding: 14px 24px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Información del producto */
.product-info-card {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-main-info {
  text-align: center;
}

.product-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
  line-height: 1.3;
  height: 2.6em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  font-size: 1.3rem;
  font-weight: 800;
  color: #e74c3c;
  text-align: center;
}

/* Detalles del producto */
.product-details {
  flex: 1;
}

.product-attributes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attribute-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.attribute-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
}

.attribute-label i {
  width: 14px;
  text-align: center;
}

.attribute-value {
  font-weight: 600;
  font-size: 0.85rem;
}

.talla-badge {
  background: #f8f9fa;
  color: #495057;
  padding: 4px 12px;
  border-radius: 20px;
  border: 2px solid #dee2e6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
}

.color-badge {
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: capitalize;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.3);
  min-width: 60px;
  text-align: center;
}

/* Acciones del producto */
.product-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f1f3f4;
}

.product-actions button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #f8f9fa;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.product-actions button:hover {
  background: #007bff;
  color: white;
  transform: translateY(-2px);
}

.btn-wishlist:hover {
  background: #e74c3c;
}

.btn-quick-view:hover {
  background: #17a2b8;
}

.btn-compare:hover {
  background: #28a745;
}

/* Responsive design */
@media (max-width: 768px) {
  .product-image-container {
    height: 220px;
  }

  .product-info-card {
    padding: 16px;
    gap: 12px;
  }

  .product-title {
    font-size: 1rem;
  }

  .product-price {
    font-size: 1.1rem;
  }

  .add-to-cart-btn,
  .out-of-stock-message {
    padding: 12px 20px;
    font-size: 0.8rem;
  }

  .attribute-item {
    padding: 6px 0;
  }

  .attribute-label,
  .attribute-value {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .product-image-container {
    height: 200px;
  }

  .product-info-card {
    padding: 12px;
  }

  .category-badge,
  .stock-badge {
    font-size: 0.7rem;
    padding: 4px 8px;
  }

  .product-actions {
    gap: 6px;
  }

  .product-actions button {
    width: 35px;
    height: 35px;
    font-size: 0.8rem;
  }
}

/* Animaciones adicionales */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.isotope-item {
  animation: fadeInUp 0.6s ease-out;
}

/* Estados de carga */
.product-card.loading {
  pointer-events: none;
  opacity: 0.7;
}

.product-card.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
