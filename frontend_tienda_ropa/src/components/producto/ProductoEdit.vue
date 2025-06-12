<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/plugins/axios'
import type { Producto } from '@/models/producto'
import type { Categoria } from '@/models/categoria'

const route = useRoute()
const router = useRouter()

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

async function cargarProducto() {
  try {
    const response = await http.get(`${ENDPOINT}/${route.params.id}`)
    producto.value = response.data
  } catch (error) {
    console.error('Error al cargar el producto:', error)
  }
}

async function actualizarProducto() {
  try {
    await http.patch(`${ENDPOINT}/${producto.value.id}`, {
      idCategoria: producto.value.categoria.id,
      nombre: producto.value.nombre,
      descripcion: producto.value.descripcion,
      precioUnitario: producto.value.precioUnitario,
      stock: producto.value.stock,
    })
    router.push('/productos')
  } catch (error) {
    console.error('Error al actualizar el producto:', error)
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
  cargarProducto()
})

function goBack() {
  router.go(-1)
}
</script>

<template>
  <div class="container">
    <div class="row">
      <h2>Editar Producto</h2>
    </div>

    <div class="row">
      <form @submit.prevent="actualizarProducto">
        <div class="form-floating mb-3">
          <select class="form-select" v-model="producto.categoria.id" required>
            <option value="" disabled>Seleccione una categoría</option>
            <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
              {{ categoria.nombre }}
            </option>
          </select>
          <label for="categoria">Categoría</label>
        </div>

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

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            v-model="producto.descripcion"
            placeholder="Descripción"
            required
          />
          <label for="descripcion">Descripción</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="number"
            class="form-control"
            v-model="producto.precioUnitario"
            placeholder="Precio Unitario"
            required
          />
          <label for="precioUnitario">Precio Unitario</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="number"
            class="form-control"
            v-model="producto.stock"
            placeholder="Stock"
            required
          />
          <label for="stock">Stock</label>
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
