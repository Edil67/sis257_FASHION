<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import router from '@/router'
import type { Producto } from '@/models/producto'
import type { Categoria } from '@/models/categoria'

const props = defineProps<{
  ENDPOINT_API: string
}>()

const ENDPOINT = props.ENDPOINT_API ?? ''

const producto = ref<Producto>({
  id: 0,
  nombre: '',
  descripcion: '',
  precioUnitario: 0,
  stock: 0,
  categoria: {
    id: 0,
    nombre: '',
  },
})

const categorias = ref<Categoria[]>([])

async function crearProducto() {
  try {
    await http.post(ENDPOINT, {
      idCategoria: producto.value.categoria.id,
      nombre: producto.value.nombre,
      descripcion: producto.value.descripcion,
      precioUnitario: producto.value.precioUnitario,
      stock: producto.value.stock,
    })
    router.push('/productos')
  } catch (error) {
    console.error('Error al crear el producto:', error)
  }
}

async function getCategorias() {
  try {
    const response = await http.get('categorias')
    categorias.value = response.data
  } catch (error) {
    console.error('Error al obtener las categorías:', error)
  }
}

onMounted(() => {
  getCategorias()
})

function goBack() {
  router.go(-1)
}
</script>

<template>
  <div class="container" v-if="producto && producto.categoria">
    <div class="row">
      <h2>Crear Nuevo Producto</h2>
    </div>

    <div class="row">
      <form @submit.prevent="crearProducto">
        <div class="form-floating mb-3">
          <select class="form-select" v-model="producto.categoria" required>
            <option value="" disabled>Seleccione una categoría</option>
            <option v-for="categoria in categorias" :key="categoria.id" :value="categoria">
              {{ categoria.nombre }}
            </option>
          </select>
          <label for="categoria">Categoría</label>
        </div>

        <div class="col-md-6">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              v-model="producto.nombre"
              placeholder="Nombre"
              required
            />
            <label for="nombre">Nombre</label>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-floating mb-2">
            <input
              type="text"
              class="form-control"
              v-model="producto.descripcion"
              placeholder="Descripción"
              required
            />
            <label for="descripcion">Descripción</label>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-floating mb-2">
            <input
              type="number"
              class="form-control"
              v-model="producto.precioUnitario"
              placeholder="Precio Unitario"
              required
            />
            <label for="precioUnitario">Precio Unitario</label>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-floating mb-2">
            <input
              type="number"
              class="form-control"
              v-model="producto.stock"
              placeholder="Stock"
              required
            />
            <label for="stock">Stock</label>
          </div>
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
  max-width: 200px; /* Ancho máximo para la casilla de selección */
}
</style>
