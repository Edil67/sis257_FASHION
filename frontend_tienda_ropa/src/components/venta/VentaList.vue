<script setup lang="ts">
import type { Venta } from '@/models/venta'
import http from '@/plugins/axios'
import VentaDetalle from './VentaDetalle.vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { onMounted, ref } from 'vue'
import PaginacionTabla from '../PaginacionTabla.vue'
import { usePaginacion } from '@/composables/usePaginacion'

const ENDPOINT = 'ventas'
let ventas = ref<Venta[]>([])
const emit = defineEmits(['edit'])
const ventaDelete = ref<Venta | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const mostrarDetalleDialog = ref<boolean>(false)
const ventaDetalleId = ref<number | null>(null)

// Implementar paginación
const {
  datosPaginados: ventasPaginadas,
  totalRegistros,
  onCambioPagina,
  onCambioRecordsPorPagina
} = usePaginacion(ventas, { recordsPorPaginaInicial: 5 })

async function obtenerLista() {
  ventas.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(venta: Venta) {
  emit('edit', venta)
}

function mostrarEliminarConfirm(venta: Venta) {
  ventaDelete.value = venta
  mostrarConfirmDialog.value = true
}

function mostrarDetalles(ventaId: number) {
  ventaDetalleId.value = ventaId
  mostrarDetalleDialog.value = true
}

function cerrarDetalles() {
  mostrarDetalleDialog.value = false
  ventaDetalleId.value = null
}

async function eliminar() {
  // Usar softRemove en lugar de eliminación completa
  await http.patch(`${ENDPOINT}/${ventaDelete.value?.id}/soft-remove`)
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
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<template>
  <div class="table-container">
    <div class="table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Total Venta (Bs.)</th>
            <th>Método de Pago</th>
            <th>Estado</th>
            <th>Monto Pagado (Bs.)</th>
            <th>Cambio (Bs.)</th>
            <th>Fecha de Venta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(venta, index) in ventasPaginadas" :key="venta.id">
            <td class="client-cell">
              {{ venta.cliente?.nombre || '' }} {{ venta.cliente?.apellido || '' }}
            </td>
            <td class="total-cell">
              {{ venta.totalVenta?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </td>
            <td>
              {{ venta.metodoPago }}
            </td>
            <td>
              {{ venta.estado }}
            </td>
            <td>
              {{ venta.montoPagado?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </td>
            <td>
              {{ venta.cambio?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </td>
            <td>
              {{ formatDate(venta.fechaCreacion) }}
            </td>
            <td class="actions-cell">
              <Button 
                icon="pi pi-eye" 
                aria-label="Ver Detalles" 
                text 
                severity="info" 
                @click="mostrarDetalles(venta.id)" 
              />
              <Button 
                icon="pi pi-pencil" 
                aria-label="Editar" 
                text 
                severity="success" 
                @click="emitirEdicion(venta)" 
              />
              <Button 
                icon="pi pi-trash" 
                aria-label="Eliminar" 
                text 
                severity="danger"
                @click="mostrarEliminarConfirm(venta)" 
              />
            </td>
          </tr>
          <tr v-if="ventasPaginadas.length === 0">
            <td colspan="8" class="no-data">No hay datos disponibles</td>
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

    <VentaDetalle 
      :mostrar="mostrarDetalleDialog"
      :venta-id="ventaDetalleId"
      @close="cerrarDetalles"
    />
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

.client-cell,
.employee-cell {
  font-weight: 600;
  color: #374151;
}

.total-cell {
  font-weight: 700;
  color: #059669;
  font-size: 1rem;
}

.no-data {
  text-align: center;
  font-style: italic;
  color: #6b7280;
  padding: 2rem;
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
}
</style>
