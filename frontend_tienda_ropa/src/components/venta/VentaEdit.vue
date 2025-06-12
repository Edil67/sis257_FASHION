<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/plugins/axios'
import type { Venta } from '@/models/venta'
import type { Cliente } from '@/models/cliente'

const route = useRoute()
const router = useRouter()

const props = defineProps<{
  ENDPOINT_API: string
}>()

const ENDPOINT = props.ENDPOINT_API ?? ''
const venta = ref<Venta>({
  id: 0,
  totalVenta: '',
  cliente: {
    id: 0,
    nombres: ''
  }
})
const clientes = ref<Cliente[]>([])

async function cargarVenta() {
  try {
    const response = await http.get(`${ENDPOINT}/${route.params.id}`)
    venta.value = response.data
  } catch (error) {
    console.error('Error al cargar la venta:', error)
  }
}

async function actualizarVenta() {
  try {
    await http.patch(`${ENDPOINT}/${venta.value.id}`, {
      idCliente: venta.value.cliente.id,
      totalVenta: venta.value.totalVenta
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

        <div class="text-center mt-3">
          <button type="submit" class="btn btn-primary btn-lg">
            <font-awesome-icon icon="fa-solid fa-save" title="Guardar" />
          </button>
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
