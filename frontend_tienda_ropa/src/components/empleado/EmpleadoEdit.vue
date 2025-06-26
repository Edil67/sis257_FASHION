<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import http from '@/plugins/axios'
import type { Empleado } from '@/models/empleado'
import type { Usuario } from '@/models/usuario'

const props = defineProps<{
  ENDPOINT_API: string
  empleado: Empleado
}>()

const emit = defineEmits(['saved', 'close'])

const ENDPOINT = props.ENDPOINT_API ?? ''
const empleado = ref<Empleado>({ ...props.empleado })
const usuarios = ref<Usuario[]>([])

watch(
  () => props.empleado,
  (nuevo) => {
    empleado.value = { ...nuevo }
  },
  { immediate: true },
)

async function getUsuarios() {
  try {
    const response = await http.get('usuarios')
    usuarios.value = response.data
  } catch (error) {
    console.error('Error al obtener los usuarios:', error)
  }
}

async function actualizarEmpleado() {
  try {
    await http.patch(`${ENDPOINT}/${empleado.value.id}`, {
      nombre: empleado.value.nombre,
      apellido: empleado.value.apellido,
      telefono: empleado.value.telefono,
      direccion: empleado.value.direccion,
      cargo: empleado.value.cargo,
    })
    emit('saved')
  } catch (error) {
    console.error('Error al actualizar el empleado:', error)
  }
}

onMounted(getUsuarios)
</script>

<template>
  <div class="container" v-if="empleado">
    <div class="row">
      <h2>Editar Empleado</h2>
    </div>
    <div class="row">
      <form @submit.prevent="actualizarEmpleado">
        <div class="form-floating mb-3">
          <input type="text" class="form-control" v-model="empleado.nombre" placeholder="Nombres" required />
          <label for="nombres">Nombres</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" v-model="empleado.apellido" placeholder="Apellidos" required />
          <label for="apellidos">Apellidos</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" v-model="empleado.telefono" placeholder="Teléfono" required />
          <label for="telefono">Teléfono</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" v-model="empleado.direccion" placeholder="Dirección" required />
          <label for="direccion">Dirección</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" v-model="empleado.cargo" placeholder="Cargo" required />
          <label for="cargo">Cargo</label>
        </div>
        <!-- Campo de fecha eliminado -->
        <div class="text-center mt-3">
          <button type="submit" class="btn btn-primary btn-lg">Guardar</button>
        </div>
      </form>
    </div>
    <div class="text-left">
      <button class="btn btn-link" @click="$emit('close')">Volver</button>
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
