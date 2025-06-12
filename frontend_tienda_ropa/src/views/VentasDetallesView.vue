<script setup lang="ts">
import VentaDetalleList from '@/components/ventaDetalle/VentaDetalleList.vue'
import VentaDetalleSave from '@/components/ventaDetalle/VentaDetalleSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref<boolean>(false)
const ventaDetalleListRef = ref<typeof VentaDetalleList | null>(null)
const ventaDetalleEdit = ref<any>(null)

function hableCreate() {
  ventaDetalleEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(ventaDetalle: any) {
  ventaDetalleEdit.value = ventaDetalle
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  ventaDetalleListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="m-8">
    <h1>VentaDetalles</h1>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="hableCreate" />
    <VentaDetalleList ref="ventaDetalleListRef" @edit="handleEdit" />
    <VentaDetalleSave
      :mostrar="mostrarDialog"
      :ventaDetalle="ventaDetalleEdit"
      :modoEdicion="!!ventaDetalleEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
