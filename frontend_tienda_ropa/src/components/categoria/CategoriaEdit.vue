<script setup lang="ts">
import { onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import router from '@/router'

const props = defineProps<{
  ENDPOINT_API: string
}>()

const ENDPOINT = props.ENDPOINT_API ?? ''
const nombre = ref('')

const id = router.currentRoute.value.params['id']

async function editarCategoria() {
  await http
    .patch(`${ENDPOINT}/${id}`, {
      nombre: nombre.value
    })

    .then(() => router.push('/categorias'))
}

async function getCategoria() {
  await http.get(`${ENDPOINT}/${id}`).then((response) => {
    nombre.value = response.data.nombre
  })
}

function goBack() {
  router.go(-1)
}

onMounted(() => {
  getCategoria()
})
</script>

<template>
  <div class="container">
    <div class="row">
      <h2>Editar Categoria</h2>
    </div>

    <div class="row">
      <form @submit.prevent="editarCategoria">
        <div class="form-floating mb-3">
          <input type="text" class="form-control" v-model="nombre" placeholder="Nombre" required />
          <label for="nombre">Nombre</label>
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
