<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import router from '@/router'
import type { Empleado } from '@/models/empleado'
import type { Usuario } from '@/models/usuario'

const props = defineProps<{
  ENDPOINT_API: string
}>()

const ENDPOINT = props.ENDPOINT_API ?? ''

const empleado = ref<Empleado>({
  id: 0,
  nombres: '',

  apellidos: '',

  cargo: 'admin',


  fechaContratacion: new Date(),

  usuario: {
    id: 0,
    nombreUsuario: ''
  }
})

const usuarios = ref<Usuario[]>([])

async function crearEmpleado() {
  try {
    await http.post(ENDPOINT, {
      idUsuario: empleado.value.usuario.id,
      nombres: empleado.value.nombres,
      apellidos: empleado.value.apellidos,
      cargo: empleado.value.cargo,
      fechaContratacion: empleado.value.fechaContratacion
    })
    router.push('/empleados')
  } catch (error) {
    console.error('Error al crear el empleado:', error)
  }
}

async function getUsuarios() {
  try {
    const response = await http.get('usuarios')
    usuarios.value = response.data
  } catch (error) {
    console.error('Error al obtener las usuarios:', error)
  }
}

onMounted(() => {
  getUsuarios()
})

function goBack() {
  router.go(-1)
}
</script>

<template>
  <div class="container" v-if="empleado && empleado.usuario">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><RouterLink to="/">Inicio</RouterLink></li>
        <li class="breadcrumb-item">
          <RouterLink to="/usuarios">Empleados</RouterLink>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Crear</li>
      </ol>
    </nav>

    <div class="row">
      <h2>Crear Nuevo Empleado</h2>
    </div>

    <div class="row">
      <form @submit.prevent="crearEmpleado">
        <div class="form-floating mb-3">
          <select class="form-select" v-model="empleado.usuario" required>
            <option value="" disabled>Seleccione un usuario</option>
            <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario">
              {{ usuario.nombreUsuario }}
            </option>
          </select>
          <label for="usuario">Usuario</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            v-model="empleado.nombres"
            placeholder="Nombres"
            required
          />
          <label for="nombres">Nombres</label>
        </div>

        <div class="form-floating mb-2">
          <input
            type="text"
            class="form-control"
            v-model="empleado.apellidos"
            placeholder="Apellidos"
            required
          />
          <label for="apellidos">Apellidos</label>
        </div>

        <div class="form-floating mb-2">
          <input
            type="text"
            class="form-control"
            v-model="empleado.cargo"
            placeholder="Cargo"
            required
          />
          <label for="cargo">Cargo</label>
        </div>

        <div class="form-floating mb-2">
          <input
            type="date"
            class="form-control"
            v-model="empleado.fechaContratacion"
            placeholder="Fecha de Contratación"
            required
          />
          <label for="fechaContratacion">Fecha de Contratación</label>
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
