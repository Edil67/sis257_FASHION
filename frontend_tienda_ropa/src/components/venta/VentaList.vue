<script setup lang="ts">
import type { Venta } from '@/models/venta'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { onMounted, ref } from 'vue'

const ENDPOINT = 'ventas'
let ventas = ref<Venta[]>([])
const emit = defineEmits(['edit'])
const ventaDelete = ref<Venta | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)

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

async function eliminar() {
  await http.delete(`${ENDPOINT}/${ventaDelete.value?.id}`)
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
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Empleado</th>
          <th>Cantidad</th>
          <th>Total</th>
          <th>Fecha de Venta</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(venta, index) in ventas" :key="venta.id">
          <td>{{ index + 1 }}</td>
          <td>{{ venta.cliente.nombres }}</td>
          <td>{{ venta.empleado.nombres }}</td>
          <td>{{ venta.totalVenta }}</td>
          <td>{{ formatDate(venta.fechaCreacion) }}</td>

          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(venta)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(venta)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
