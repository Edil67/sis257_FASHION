<script setup lang="ts">
import type { VentaDetalle } from '@/models/ventaDetalle'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { onMounted, ref } from 'vue'

const ENDPOINT = 'ventaDetalles'
let ventaDetalles = ref<VentaDetalle[]>([])
const emit = defineEmits(['edit'])
const ventaDetalleDelete = ref<VentaDetalle | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)

async function obtenerLista() {
  ventaDetalles.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(ventaDetalle: VentaDetalle) {
  emit('edit', ventaDetalle)
}


function mostrarEliminarConfirm(ventaDetalle: VentaDetalle) {
  ventaDetalleDelete.value = ventaDetalle
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${ventaDetalleDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })


function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Venta</th>
          <th>Productos</th>
          <th>Cantidad</th>
          <th>Subtotal </th>
          <th>Fecha de VentaDetalle</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ventaDetalle, index) in ventaDetalles" :key="ventaDetalle.id">
          <td>{{ index + 1 }}</td>
          <td>{{ ventaDetalle.venta.totalVenta }}</td>
          <td>{{ ventaDetalle.producto.nombre }}</td>
          <td>{{ ventaDetalle.cantidad }}</td>
          <td>{{ ventaDetalle.Subtotal }}</td>
          <td>{{ formatDate(ventaDetalle. fechaCreacion) }}</td>



          <td>
            <Button
              icon="pi pi-pencil"
              aria-label="Editar"
              text
              @click="emitirEdicion(ventaDetalle)"
            />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(ventaDetalle)"
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
