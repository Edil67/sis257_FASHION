<script setup lang="ts">
import { onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import router from '@/router'

const props = defineProps<{
  ENDPOINT_API: string
}>()

const ENDPOINT = props.ENDPOINT_API ?? ''
const nombreUsuario = ref('')
const email = ref('')

const id = router.currentRoute.value.params['id']

async function editarUsuario() {
  await http
    .patch(`${ENDPOINT}/${id}`, {
      nombreUsuario: nombreUsuario.value,
      email: email.value,
    })

    .then(() => router.push('/usuarios'))
}

async function getUsuario() {
  await http.get(`${ENDPOINT}/${id}`).then((response) => {
    ;(nombreUsuario.value = response.data.nombreUsuario), (email.value = response.data.email)
  })
}

function goBack() {
  router.go(-1)
}

onMounted(() => {
  getUsuario()
})
</script>

<template>
  <div class="container">
    <div class="row">
      <h2>Editar Usuario</h2>
    </div>

    <div class="row">
      <form @submit.prevent="editarUsuario">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            v-model="nombreUsuario"
            placeholder="Nombre de Usuario "
            required
          />
          <label for="nombreUsuario">Nombre de Usuario</label>
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
