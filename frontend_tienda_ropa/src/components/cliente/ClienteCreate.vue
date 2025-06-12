<script setup lang="ts">
import { ref } from 'vue'
import http from '@/plugins/axios'
import router from '@/router'

const props = defineProps<{
  ENDPOINT_API: string
}>()

const ENDPOINT = props.ENDPOINT_API ?? ''
const nombres = ref('')
const apellidos = ref('')
const direccion = ref('')
const telefono = ref('')
const email = ref('')

async function crearCliente() {
  await http
    .post(ENDPOINT, {
      nombres: nombres.value,
      apellidos: apellidos.value,
      direccion: direccion.value,
      telefono: telefono.value,
      email: email.value
    })
    .then(() => router.push('/clientes'))
}

function goBack() {
  router.go(-1)
}
</script>

<template>
  <div class="container">
    <div class="row">
      <h2>Crear Nuevo Cliente</h2>
    </div>

    <div class="row">
      <form @submit.prevent="crearCliente">
        <div class="row mb-3">
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                v-model="nombres"
                placeholder="Nombre"
                required
              />
              <label for="nombres">Nombre</label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                v-model="apellidos"
                placeholder="Apellido"
                required
              />
              <label for="apellidos">Apellido</label>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                v-model="direccion"
                placeholder="Direccion"
                required
              />
              <label for="direccion">Direccion</label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                v-model="telefono"
                placeholder="Telefono"
                required
              />
              <label for="telefono">Teléfono</label>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                v-model="email"
                placeholder="Email"
                required
              />
              <label for="email">E-mail</label>
            </div>
          </div>
        </div>
        <div class="text-center mt-3">
          <button type="submit" class="btn btn-primary btn-lg">
            <font-awesome-icon icon="fa-solid fa-save" title="Guardar" />Registrar Cliente
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

/* Estilo para las casillas de ingreso */
.form-control {
  background-color: #a9a9a9; /* Color plomo oscuro */
  color: #000000; /* Letras negras */
  max-width: 100%; /* Ancho máximo para las casillas de ingreso */
}

/* Estilo para las etiquetas */
.form-floating > label {
  color: #000000; /* Letras negras */
}

/* Estilo para las filas del formulario */
.row.mb-3 {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* Estilo para las columnas del formulario */
.col-md-6 {
  flex: 1;
  min-width: 200px; /* Ancho mínimo para las columnas */
}

/* Ajustar el tamaño de la casilla de selección */
.form-select {
  background-color: #a9a9a9; /* Color plomo oscuro */
  color: #000000; /* Letras negras */
  max-width: 400px; /* Ancho máximo para la casilla de selección */
}
</style>
