<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/plugins/axios'
import type { Venta } from '@/models/venta'
import type { Cliente } from '@/models/cliente'

const route = useRoute()
const router = useRouter()

const props = defineProps<{ ENDPOINT_API: string }>()
const ENDPOINT = props.ENDPOINT_API ?? ''
const venta = ref<Venta | null>(null)
const clientes = ref<Cliente[]>([])
const detallesVenta = ref<any[]>([])

async function cargarVenta() {
  try {
    const response = await http.get(`${ENDPOINT}/${route.params.id}`)
    venta.value = response.data
    // Pobla los detalles para edición
    detallesVenta.value = response.data.ventadetalles.map((detalle: any) => ({
      id: detalle.id,
      idProducto: detalle.producto?.id,
      cantidad: detalle.cantidad,
      precioUnitario: detalle.precioUnitario,
      subtotal: detalle.subtotal,
    }))
  } catch (error) {
    console.error('Error al cargar la venta:', error)
  }
}

async function actualizarVenta() {
  try {
    await http.patch(`${ENDPOINT}/${venta.value?.id}`, {
      idCliente: venta.value?.cliente.id,
      totalVenta: venta.value?.totalVenta,
      detallesVenta: detallesVenta.value.map((d) => ({
        idProducto: d.idProducto,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal,
      })),
    })
    router.push('/ventas')
  } catch (error) {
    console.error('Error al actualizar la venta:', error)
  }
}

async function getClientes() {
  try {
    const response = await http.get('clientes')
    clientes.value = response.data
  } catch (error) {
    console.error('Error al obtener los clientes:', error)
  }
}

onMounted(() => {
  getClientes()
  cargarVenta()
})

function goBack() {
  router.go(-1)
}
</script>

<template>
  <div class="container" v-if="venta && venta.cliente">
    <div class="row">
      <h2>Editar Venta</h2>
    </div>

    <div class="row">
      <form @submit.prevent="actualizarVenta">
        <div class="form-floating mb-3">
          <select class="form-select" v-model="venta.cliente" required>
            <option value="" disabled>Seleccione un cliente</option>
            <option v-for="cliente in clientes" :key="cliente.id" :value="cliente">
              {{ cliente.nombres }}
            </option>
          </select>
          <label for="cliente">Cliente</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            v-model="venta.totalVenta"
            placeholder="Total de Venta"
            required
          />
          <label for="totalVenta">Total de Venta</label>
        </div>

        <!-- Detalles de la venta -->
        <div v-for="(detalle, idx) in detallesVenta" :key="detalle.id" class="mb-2">
          <div>
            Producto ID: {{ detalle.idProducto }}<br />
            Cantidad: <input type="number" v-model.number="detalle.cantidad" min="1" /> Precio
            Unitario:
            <input type="number" v-model.number="detalle.precioUnitario" min="0" step="0.01" />
            Subtotal: {{ detalle.subtotal }}
          </div>
        </div>

        <div class="text-center mt-3">
          <button type="submit" class="btn btn-primary btn-lg">Guardar</button>
        </div>
      </form>
    </div>
    <div class="text-left">
      <button class="btn btn-link" @click="goBack">Volver</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}

button {
  margin-top: 10px;
}
</style>
