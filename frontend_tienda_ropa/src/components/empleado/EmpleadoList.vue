<script setup lang="ts">
import type { Empleado } from '@/models/empleado'
import type { Usuario } from '@/models/usuario'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { onMounted, ref } from 'vue'

const ENDPOINT = 'empleados'
const empleados = ref<Empleado[]>([])
const usuarios = ref<Usuario[]>([])
const emit = defineEmits(['edit'])
const empleadoDelete = ref<Empleado | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)

async function obtenerLista() {
  const [empleadosRes, usuariosRes] = await Promise.all([http.get(ENDPOINT), http.get('usuarios')])
  console.log('Empleados:', empleadosRes.data)
  console.log('Usuarios:', usuariosRes.data)
  usuarios.value = usuariosRes.data
  empleados.value = empleadosRes.data.map((e: any) => ({
    ...e,
    usuario: e.usuario // Si ya viene embebido
      ? e.usuario
      : usuarios.value.find((u) => u.id === e.idUsuario || u.id === e.usuarioId) || {
          nombreUsuario: 'Sin usuario',
        },
  }))
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
  await obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Cargo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="empleado in empleados" :key="empleado.id">
          <td>{{ empleado.usuario?.nombreUsuario || 'Sin usuario' }}</td>
          <td>{{ empleado.nombres }}</td>
          <td>{{ empleado.apellidos }}</td>
          <td>{{ empleado.cargo }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(empleado)" />
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

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background: #f4f4f4;
}
</style>
