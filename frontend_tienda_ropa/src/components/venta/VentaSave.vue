<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import type { Empleado } from '@/models/empleado'
import type { Producto } from '@/models/producto'
import type { ventaDetalle } from '@/models/ventaDetalle'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { ref, computed, watch, onMounted } from 'vue'

const ENDPOINT = 'ventas'

const props = defineProps({
  mostrar: Boolean,
  venta: {
    type: Object,
    default: () => ({}),
  },
  modoEdicion: Boolean,
})

const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const clientes = ref<Cliente[]>([])
const empleados = ref<Empleado[]>([])
const productos = ref<Producto[]>([])
const venta = ref({
  cliente: null as Cliente | null,
  empleado: null as Empleado | null,
  ventaDetalles: [] as ventaDetalle[],
  totalVenta: 0,
  estado: 'pendiente' as string,
  metodoPago: 'efectivo' as string,
})

const estadosDisponibles = ref([
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Confirmada', value: 'confirmada' },
])

const metodosPago = ref([
  { label: 'Efectivo', value: 'efectivo' },
  { label: 'Tarjeta', value: 'tarjeta' },
  { label: 'Transferencia', value: 'transferencia' },
  { label: 'QR', value: 'qr' },
  { label: 'Otro', value: 'otro' },
])

const detalle = ref({
  producto: null as Producto | null,
  cantidad: 1,
  precioUnitario: 0,
  subtotal: 0,
})

async function obtenerClientes() {
  clientes.value = (await http.get('clientes')).data
}
async function obtenerEmpleados() {
  empleados.value = (await http.get('empleados')).data
}
async function obtenerProductos() {
  productos.value = (await http.get('productos')).data
}

onMounted(() => {
  obtenerClientes()
  obtenerEmpleados()
  obtenerProductos()
})

// Inicializar datos cuando se abre el modal en modo edición
watch(() => props.mostrar, (newVal) => {
  if (newVal) {
    if (props.modoEdicion && props.venta) {
      venta.value = {
        cliente: props.venta.cliente,
        empleado: props.venta.empleado,
        ventaDetalles: props.venta.ventaDetalles || [],
        totalVenta: props.venta.totalVenta,
        estado: props.venta.estado || 'pendiente',
        metodoPago: props.venta.metodoPago || 'efectivo',
      }
    } else {
      venta.value = {
        cliente: null,
        empleado: null,
        ventaDetalles: [],
        totalVenta: 0,
        estado: 'pendiente',
        metodoPago: 'efectivo',
      }
    }
  }
})

watch(
  () => detalle.value.producto,
  (nuevo) => {
    if (nuevo) {
      detalle.value.precioUnitario = nuevo.precio
      detalle.value.cantidad = 1
      detalle.value.subtotal = nuevo.precio
    }
  },
)

function agregarDetalle() {
  if (detalle.value.producto && detalle.value.cantidad > 0) {
    detalle.value.subtotal = detalle.value.cantidad * detalle.value.precioUnitario
    venta.value.ventaDetalles.push({
      ...detalle.value,
      id: 0,
      venta: undefined,
    })
    venta.value.totalVenta = venta.value.ventaDetalles.reduce((sum, d) => sum + d.subtotal, 0)
    detalle.value = { producto: null, cantidad: 1, precioUnitario: 0, subtotal: 0 }
  }
}

function eliminarDetalle(index: number) {
  venta.value.ventaDetalles.splice(index, 1)
  venta.value.totalVenta = venta.value.ventaDetalles.reduce((sum, d) => sum + d.subtotal, 0)
}

async function handleSave() {
  try {
    if (props.modoEdicion) {
      // En modo edición, solo permitir cambiar el estado
      const body = {
        estado: venta.value.estado,
      }
      await http.patch(`${ENDPOINT}/${props.venta.id}`, body)
    } else {
      // En modo creación, crear nueva venta con estado pendiente
      const body = {
        idCliente: venta.value.cliente?.id,
        idEmpleado: venta.value.empleado?.id,
        totalVenta: venta.value.totalVenta,
        metodoPago: venta.value.metodoPago,
        estado: 'pendiente',
        detalles: venta.value.ventaDetalles.map((d) => ({
          idProducto: d.producto?.id,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          subtotal: d.subtotal,
        })),
      }
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al guardar la venta')
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="dialogVisible" :header="props.modoEdicion ? 'Editar Estado de Venta' : 'Crear Venta'"
      :modal="true" :draggable="false" style="max-width: 900px; width: 100%"
      contentStyle="overflow-x: auto; padding: 2rem;">
      <!-- Modo Edición: Solo cambiar estado -->
      <div v-if="props.modoEdicion" class="estado-edicion">
        <div class="info-venta mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">Información de la Venta</h3>
          <p><strong>Cliente:</strong> {{ props.venta?.cliente?.nombre || '' }} {{ props.venta?.cliente?.apellido || ''
          }}</p>
          <p><strong>Empleado:</strong> {{ props.venta?.empleado?.nombres || '' }}</p>
          <p><strong>Total:</strong> {{ props.venta?.totalVenta?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) }} Bs.</p>
          <p><strong>Estado Actual:</strong> {{ props.venta?.estado || 'pendiente' }}</p>
        </div>

        <div class="flex flex-wrap items-center gap-4 mb-4">
          <label class="font-semibold w-32">Nuevo Estado</label>
          <Select v-model="venta.estado" :options="estadosDisponibles" optionLabel="label" optionValue="value"
            placeholder="Seleccione el estado" class="flex-1 min-w-[200px]" />
        </div>
      </div>

      <!-- Modo Creación: Formulario completo -->
      <div v-else class="venta-creacion">
        <!-- Select Cliente -->
        <div class="flex flex-wrap items-center gap-4 mb-4">
          <label class="font-semibold w-32">Cliente</label>
          <Select v-model="venta.cliente" :options="clientes" optionLabel="nombres" placeholder="Seleccione un cliente"
            class="flex-1 min-w-[200px]" />
        </div>
        <!-- Select Empleado -->
        <div class="flex flex-wrap items-center gap-4 mb-4">
          <label class="font-semibold w-32">Empleado</label>
          <Select v-model="venta.empleado" :options="empleados" optionLabel="nombres"
            placeholder="Seleccione un empleado" class="flex-1 min-w-[200px]" />
        </div>
        <!-- Select Método de Pago -->
        <div class="flex flex-wrap items-center gap-4 mb-4">
          <label class="font-semibold w-32">Método de Pago</label>
          <Select v-model="venta.metodoPago" :options="metodosPago" optionLabel="label" optionValue="value"
            placeholder="Seleccione método de pago" class="flex-1 min-w-[200px]" />
        </div>
        <!-- Agregar Detalle de Producto -->
        <div class="flex flex-wrap items-center gap-4 mb-4">
          <label class="font-semibold w-32">Producto</label>
          <Select v-model="detalle.producto" :options="productos" optionLabel="nombre"
            placeholder="Seleccione un producto" class="flex-1 min-w-[200px]" />
          <InputNumber v-model="detalle.cantidad" :min="1" placeholder="Cantidad" class="w-28" />
          <InputNumber v-model="detalle.precioUnitario" :min="0" placeholder="Precio" class="w-32" disabled />
          <Button label="Agregar" @click="agregarDetalle" />
        </div>
        <!-- Tabla de Detalles -->
        <div class="overflow-x-auto mb-4">
          <table class="w-full text-sm">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(d, i) in venta.ventaDetalles" :key="i">
                <td>{{ d.producto?.nombre }}</td>
                <td>{{ d.cantidad }}</td>
                <td>{{ d.precioUnitario }}</td>
                <td>{{ d.subtotal }}</td>
                <td>
                  <Button icon="pi pi-trash" severity="danger" @click="eliminarDetalle(i)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-end mb-4">
          <span class="font-bold text-lg">Total Venta: {{ venta.totalVenta }}</span>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary"
          @click="dialogVisible = false"></Button>
        <Button type="button" :label="props.modoEdicion ? 'Actualizar Estado' : 'Guardar'" icon="pi pi-save"
          @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.estado-edicion .info-venta {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.info-venta p {
  margin-bottom: 0.5rem;
  color: #374151;
}

/* Opcional: mejora la tabla en pantallas pequeñas */
@media (max-width: 600px) {
  table {
    font-size: 0.85rem;
  }

  th,
  td {
    padding: 0.25rem;
  }
}
</style>
