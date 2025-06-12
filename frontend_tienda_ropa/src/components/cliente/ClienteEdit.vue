<script setup lang="ts">
import { onMounted, ref } from 'vue'
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

const id = router.currentRoute.value.params['id']

async function editarCliente() {
  await http
    .patch(`${ENDPOINT}/${id}`, {
      nombres: nombres.value,
      apellidos: apellidos.value,
      direccion: direccion.value,
      telefono: telefono.value,
      email: email.value
    })

    .then(() => router.push('/clientes'))
}

async function getCliente() {
  await http.get(`${ENDPOINT}/${id}`).then((response) => {
    ;(nombres.value = response.data.nombres),
      (apellidos.value = response.data.apellidos),
      (direccion.value = response.data.direccion),
      (telefono.value = response.data.telefono),
      (email.value = response.data.email)
  })
}

function goBack() {
  router.go(-1)
}

onMounted(() => {
  getCliente()
})
</script>

<template>
  <div class="container">
    <div class="row">
      <h2>Editar Cliente</h2>
    </div>

    <div class="row">
      <form @submit.prevent="editarCliente">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            v-model="nombres"
            placeholder="Nombres"
            required
          />
          <label for="nombres">Nombres</label>
        </div>

        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            v-model="apellidos"
            placeholder="Apellidos"
            required
          />
          <label for="apellidos"> Apellidos</label>
        </div>

        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            v-model="direccion"
            placeholder="Dirección"
            required
          />
          <label for="direccion">Dirección</label>
        </div>

        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            v-model="telefono"
            placeholder="Telefono"
            required
          />
          <label for="telefono">Telefono</label>
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
