<script setup lang="ts">
import { ref } from 'vue'
import http from '@/plugins/axios'
import router from '@/router'

const props = defineProps<{
  ENDPOINT_API: string
}>()

const ENDPOINT = props.ENDPOINT_API ?? ''
const nombreUsuario = ref('')
const email = ref('')

async function crearUsuario() {
  await http
    .post(ENDPOINT, {
      nombreUsuario: nombreUsuario.value,
      email: email.value,
    })
    .then(() => router.push('/usuarios'))
}

function goBack() {
  router.go(-1)
}
</script>

<template>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><RouterLink to="/">Inicio</RouterLink></li>
        <li class="breadcrumb-item">
          <RouterLink to="/usuarios">Usuarios</RouterLink>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Crear</li>
      </ol>
    </nav>

    <div class="row">
      <h2>Crear Nuevo Usuario</h2>
    </div>

    <div class="row">
      <form @submit.prevent="crearUsuario">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            v-model="nombreUsuario"
            placeholder="Nombre de Usuario"
            required
          />
          <label for="nombreUsuario">Nombre de Usuario </label>
        </div>

        <div class="form-floating">
          <input type="text" class="form-control" v-model="email" placeholder="E-mail" required />
          <label for="email">E-mail</label>
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

<style></style>
