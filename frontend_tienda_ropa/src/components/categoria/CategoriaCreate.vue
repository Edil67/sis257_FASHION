<script setup lang="ts">
import { ref } from 'vue'
import http from '@/plugins/axios'
import router from '@/router'

const props = defineProps<{
  ENDPOINT_API: string
}>()

const ENDPOINT = props.ENDPOINT_API ?? ''
const nombre = ref('')
const categorias = ref<string[]>([])

// Fetch existing categories
async function fetchCategorias() {
  try {
    const response = await http.get(ENDPOINT)
    categorias.value = response.data.map((categoria: { nombre: string }) => categoria.nombre)
  } catch (error) {
    console.error('Error fetching categories', error)
  }
}

// Call fetchCategorias when the component is mounted
fetchCategorias()

async function crearCategoria() {
  if (categorias.value.includes(nombre.value)) {
    alert('La categoría ya existe')
    return
  }

  try {
    await http.post(ENDPOINT, {
      nombre: nombre.value,
    })
    router.push('/categorias')
  } catch (error) {
    console.error('Error creating category', error)
  }
}

function goBack() {
  router.go(-1)
}
</script>

<template>
  <div class="container">
    <div class="row">
      <h2>Agregar Nueva Categoria</h2>
    </div>

    <div class="row">
      <form @submit.prevent="crearCategoria">
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
