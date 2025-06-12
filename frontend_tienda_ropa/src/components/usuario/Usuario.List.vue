<script setup lang="ts">
import type { Usuario } from '@/models/usuario';
import http from '@/plugins/axios';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { onMounted, ref } from 'vue';

const ENDPOINT = 'usuarios';
let usuarios = ref<Usuario[]>([]);
const emit = defineEmits(['edit']);
const usuarioDelete = ref<Usuario | null>(null);
const mostrarConfirmDialog = ref<boolean>(false);

async function obtenerLista() {
  try {
    const response = await http.get(ENDPOINT);
    usuarios.value = response.data;
  } catch (error) {
    console.error('Error al obtener la lista de usuarios:', error);
  }
}

function emitirEdicion(usuario: Usuario) {
  emit('edit', usuario);
}

function mostrarEliminarConfirm(usuario: Usuario) {
  usuarioDelete.value = usuario;
  mostrarConfirmDialog.value = true;
}

async function eliminar() {
  try {
    if (usuarioDelete.value) {
      await http.delete(`${ENDPOINT}/${usuarioDelete.value.id}`);
      obtenerLista();
      mostrarConfirmDialog.value = false;
    }
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
  }
}

onMounted(() => {
  obtenerLista();
});
defineExpose({ obtenerLista });

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
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
          <th>Nombre de Usuario</th>
          <th>Clave</th>
          <th>Fecha de Registro</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(usuario, index) in usuarios" :key="usuario.id">
          <td>{{ index + 1 }}</td>
          <td>{{ usuario.nombreUsuario }}</td>
          <td>{{ usuario.clave }}</td>
          <td>{{ formatDate(usuario.fechaCreacion) }}</td>
          <td>
            <!-- <Button
              icon="pi pi-pencil"
              aria-label="Editar"
              text
              @click="emitirEdicion(usuario)"
            /> -->
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(usuario)"
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
