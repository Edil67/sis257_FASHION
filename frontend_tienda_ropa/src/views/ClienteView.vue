<script setup lang="ts">
import ClienteList from '@/components/cliente/Cliente.List.vue'
import ClienteSave from '@/components/cliente/Cliente.Save.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref<boolean>(false)
const clienteListRef = ref<typeof ClienteList | null>(null)
const clienteEdit = ref<any>(null)

function hableCreate() {
  clienteEdit.value = null // Reinicia clienteEdit para creación
  mostrarDialog.value = true
}

function handleEdit(cliente: any) {
  clienteEdit.value = { ...cliente } // Crea una copia del cliente para evitar modificar el original
  mostrarDialog.value = true
}

function handleCloseDialog() {
  clienteEdit.value = null // Resetea el valor al cerrar
  mostrarDialog.value = false
}

function handleGuardar() {
  clienteListRef.value?.obtenerLista() // Refresca la lista tras guardar
}
</script>

<template>
  <div class="m-8">
    <h1>Clientes</h1>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="hableCreate" />
    <ClienteList ref="clienteListRef" @edit="handleEdit" />
    <ClienteSave
      :mostrar="mostrarDialog"
      :cliente="clienteEdit"
      :modoEdicion="!!clienteEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
