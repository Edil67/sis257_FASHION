<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { onMounted, ref } from 'vue'
import PaginacionTabla from '../PaginacionTabla.vue'
import { usePaginacion } from '@/composables/usePaginacion'

const ENDPOINT = 'productos'
let productos = ref<Producto[]>([])
const emit = defineEmits(['edit'])
const productoDelete = ref<Producto | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)

// Implementar paginación
const {
  datosPaginados: productosPaginados,
  totalRegistros,
  onCambioPagina,
  onCambioRecordsPorPagina
} = usePaginacion(productos, { recordsPorPaginaInicial: 5 })

async function obtenerLista() {
  productos.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(producto: Producto) {
  emit('edit', producto)
}

function mostrarEliminarConfirm(producto: Producto) {
  productoDelete.value = producto
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${productoDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Los meses son de 0 a 11
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Función para calcular el número de fila global
function obtenerNumeroFila(index: number): number {
  const paginaActual = Math.floor(productos.value.indexOf(productosPaginados.value[index]) / 5) + 1
  const recordsPorPagina = 5
  return (paginaActual - 1) * recordsPorPagina + index + 1
}
</script>

<template>
  <div class="table-container">
    <div class="table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Nro.</th>
            <th>Categoria</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio (c/u)</th>
            <th>Stock</th>
            <th>Talla</th>
            <th>Color</th>
            <th>Imagen</th>
            <th>Fecha de Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(producto, index) in productosPaginados" :key="producto.id">
            <td>{{ productos.indexOf(producto) + 1 }}</td>
            <td>{{ producto.categoria?.nombre }}</td>
            <td class="product-name">{{ producto.nombre }}</td>
            <td class="description-cell">{{ producto.descripcion }}</td>
            <td class="price-cell">{{ producto.precio }} Bs</td>
            <td class="stock-cell">{{ producto.stock }}</td>
            <td>{{ producto.talla }}</td>
            <td>{{ producto.color }}</td>
            <td class="image-cell">
              <img :src="producto.imagenes" alt="Imagen" class="product-image" />
            </td>
            <td>{{ formatDate(producto.fechaCreacion) }}</td>
            <td class="actions-cell">
              <Button icon="pi pi-pencil" aria-label="Editar" text severity="info" @click="emitirEdicion(producto)" />
              <Button icon="pi pi-trash" aria-label="Eliminar" text severity="danger"
                @click="mostrarEliminarConfirm(producto)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Componente de paginación -->
    <PaginacionTabla
      :total-registros="totalRegistros"
      :records-por-pagina-inicial="5"
      @cambio-pagina="onCambioPagina"
      @cambio-records-por-pagina="onCambioRecordsPorPagina"
    />

    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar Eliminación" :style="{ width: '25rem' }">
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="mostrarConfirmDialog = false" />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.table-container {
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Poppins-Regular', Arial, sans-serif;
  background: #fff;
}

.admin-table thead {
  background: linear-gradient(135deg, #717fe0 0%, #6c7ae0 100%);
}

.admin-table thead th {
  padding: 1rem 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  position: relative;
}

.admin-table thead th:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 25%;
  height: 50%;
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.admin-table tbody tr {
  transition: all 0.3s ease;
}

.admin-table tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

.admin-table tbody tr:hover {
  background-color: #e0e7ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(113, 127, 224, 0.15);
}

.admin-table tbody td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #374151;
  vertical-align: middle;
}

.admin-table tbody td:first-child {
  font-weight: 600;
  color: #6c7ae0;
}

.product-name {
  font-weight: 600;
  color: #374151;
}

.description-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price-cell {
  font-weight: 600;
  color: #059669;
  font-size: 0.95rem;
}

.stock-cell {
  font-weight: 600;
  text-align: center;
}

.color-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.3);
  min-width: 60px;
  text-align: center;
}

.image-cell {
  text-align: center;
  padding: 0.5rem;
}

.product-image {
  max-width: 80px;
  max-height: 80px;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.1);
  border-color: #717fe0;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.actions-cell .p-button {
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.actions-cell .p-button:hover {
  transform: scale(1.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .table-container {
    padding: 1rem;
    margin: 0.5rem 0;
  }

  .admin-table thead th,
  .admin-table tbody td {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }

  .description-cell {
    max-width: 150px;
  }

  .product-image {
    max-width: 60px;
    max-height: 60px;
  }

  .actions-cell {
    flex-direction: column;
    gap: 0.25rem;
  }
}

@media (max-width: 640px) {
  .admin-table {
    font-size: 0.75rem;
  }

  .admin-table thead th,
  .admin-table tbody td {
    padding: 0.5rem 0.25rem;
  }

  .description-cell {
    max-width: 100px;
  }
}
</style>
