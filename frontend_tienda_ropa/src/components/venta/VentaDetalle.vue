<script setup lang="ts">
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { ref, computed, watch } from 'vue'

interface DetalleVenta {
  id: number
  cantidad: string
  precioUnitario: string
  subtotal: string
  fechaCreacion: string
  fechaAnulacion: string | null
  fechaEliminacion: string | null
  producto: {
    id: number
    nombre: string
    descripcion: string
    precio: string
    stock: number
    talla: string
    color: string
    imagenes: string
    fechaCreacion: string
    fechaModificacion: string
    fechaEliminacion: string | null
    idCategoria: number
  }
}

const props = defineProps({
  mostrar: Boolean,
  ventaId: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const detalles = ref<DetalleVenta[]>([])
const loading = ref(false)

async function obtenerDetalles() {
  if (!props.ventaId) return

  loading.value = true
  try {
    const response = await http.get(`ventas/${props.ventaId}/detalles`)
    detalles.value = response.data
  } catch (error) {
    console.error('Error al obtener detalles:', error)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.mostrar,
  (newVal) => {
    if (newVal && props.ventaId) {
      obtenerDetalles()
    }
  },
)

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}

function formatCurrency(amount: string): string {
  return parseFloat(amount).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    header="Detalles de la Venta"
    :modal="true"
    :draggable="false"
    style="max-width: 1000px; width: 100%"
    content-style="padding: 2rem;"
  >
    <div v-if="loading" class="text-center p-4">
      <i class="pi pi-spinner pi-spin text-2xl"></i>
      <p class="mt-2">Cargando detalles...</p>
    </div>

    <div v-else-if="detalles.length === 0" class="text-center p-4">
      <p>No se encontraron detalles para esta venta.</p>
    </div>

    <div v-else class="detalles-container">
      <div class="table-wrapper">
        <table class="detalles-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Imagen</th>
              <th>Descripción</th>
              <th>Talla</th>
              <th>Color</th>
              <th>Cantidad</th>
              <th>Precio Unitario (Bs.)</th>
              <th>Subtotal (Bs.)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detalle in detalles" :key="detalle.id">
              <td class="producto-cell">
                {{ detalle.producto.nombre }}
              </td>
              <td class="imagen-cell">
                <img
                  :src="detalle.producto.imagenes"
                  :alt="detalle.producto.nombre"
                  class="producto-imagen"
                  @error="$event.target.src = '/qr-placeholder.svg'"
                />
              </td>
              <td class="descripcion-cell">
                {{ detalle.producto.descripcion }}
              </td>
              <td class="text-center">
                {{ detalle.producto.talla }}
              </td>
              <td class="text-center">
                {{ detalle.producto.color }}
              </td>
              <td class="text-center cantidad-cell">
                {{ formatCurrency(detalle.cantidad) }}
              </td>
              <td class="text-right precio-cell">
                {{ formatCurrency(detalle.precioUnitario) }}
              </td>
              <td class="text-right subtotal-cell">
                {{ formatCurrency(detalle.subtotal) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="7" class="text-right font-bold">TOTAL VENTA:</td>
              <td class="text-right font-bold total-amount">
                {{
                  formatCurrency(
                    detalles.reduce((sum, d) => sum + parseFloat(d.subtotal), 0).toString(),
                  )
                }}
                Bs.
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <template #footer>
      <Button
        label="Cerrar"
        icon="pi pi-times"
        @click="dialogVisible = false"
        severity="secondary"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.detalles-container {
  max-height: 70vh;
  overflow-y: auto;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.detalles-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Poppins-Regular', Arial, sans-serif;
  background: #fff;
  min-width: 800px;
}

.detalles-table thead {
  background: linear-gradient(135deg, #717fe0 0%, #6c7ae0 100%);
  position: sticky;
  top: 0;
  z-index: 1;
}

.detalles-table thead th {
  padding: 1rem 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
}

.detalles-table tbody tr {
  transition: all 0.3s ease;
}

.detalles-table tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

.detalles-table tbody tr:hover {
  background-color: #e0e7ff;
}

.detalles-table tbody td,
.detalles-table tfoot td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #374151;
  vertical-align: middle;
}

.producto-cell {
  font-weight: 600;
  color: #374151;
  max-width: 200px;
}

.imagen-cell {
  width: 80px;
  text-align: center;
}

.producto-imagen {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
}

.descripcion-cell {
  max-width: 250px;
  word-wrap: break-word;
  line-height: 1.4;
}

.cantidad-cell {
  font-weight: 600;
  color: #059669;
}

.precio-cell {
  font-weight: 600;
  color: #374151;
}

.subtotal-cell {
  font-weight: 700;
  color: #059669;
  font-size: 1rem;
}

.total-row {
  background-color: #f3f4f6;
}

.total-amount {
  font-size: 1.1rem;
  color: #059669;
  font-weight: 800;
}

@media (max-width: 768px) {
  .detalles-table {
    font-size: 0.8rem;
    min-width: 600px;
  }

  .detalles-table thead th,
  .detalles-table tbody td,
  .detalles-table tfoot td {
    padding: 0.75rem 0.5rem;
  }

  .producto-imagen {
    width: 40px;
    height: 40px;
  }
}
</style>
