<script setup lang="ts">
import type { Empleado } from '@/models/empleado'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { onMounted, ref } from 'vue'

const ENDPOINT = 'empleados'
let empleados = ref<Empleado[]>([])
const emit = defineEmits(['edit'])
const empleadoDelete = ref<Empleado | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)

async function obtenerLista() {
  empleados.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(empleado: Empleado) {
  emit('edit', empleado)
}


function mostrarEliminarConfirm(empleado: Empleado) {
  empleadoDelete.value = empleado
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${empleadoDelete.value?.id}`)
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
          <th>Usuario</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Cargo</th>
          <th>Fecha de Contrato</th>
          <th>Fecha de Registro</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(empleado, index) in empleados" :key="empleado.id">
          <td>{{ index + 1 }}</td>
          <td>{{ empleado.usuario.nombre }}</td>
          <td>{{ empleado.nombres }}</td>
          <td>{{ empleado.apellidos }}</td>
          <td>{{ empleado.cargo }}</td>
          <td>{{ formatDate(empleado. fechaContratacion) }}</td>
          <td>{{formatDate(empleado. fechaCreacion)  }}</td>



          <td>
            <Button
              icon="pi pi-pencil"
              aria-label="Editar"
              text
              @click="emitirEdicion(empleado)"
            />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(empleado)"
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
