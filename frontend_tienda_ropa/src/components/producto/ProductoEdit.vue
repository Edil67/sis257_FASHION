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
  precio: 0,
  stock: 0,
  talla: '',
  color: '',
  imagenes: '',
  fechaCreacion: '',
  fechaModificacion: '',
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
      precio: Number(producto.value.precio),
      stock: producto.value.stock,
      talla: producto.value.talla,
      color: producto.value.color,
      imagenes: producto.value.imagenes,
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
            v-model="producto.precio"
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

        <div class="form-floating mb-3">
          <select class="form-select" v-model="producto.talla" required>
            <option value="" disabled>Seleccione una talla</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
          <label for="talla">Talla</label>
        </div>
        <div class="form-floating mb-3">
          <select class="form-select" v-model="producto.color" required>
            <option value="" disabled>Seleccione un color</option>
            <option value="Blanco">Blanco</option>
            <option value="Negro">Negro</option>
            <option value="Azul">Azul</option>
            <option value="Rojo">Rojo</option>
            <option value="Verde">Verde</option>
            <option value="Amarillo">Amarillo</option>
            <option value="Rosa">Rosa</option>
            <option value="Gris">Gris</option>
            <option value="Marrón">Marrón</option>
            <option value="Violeta">Violeta</option>
          </select>
          <label for="color">Color</label>
        </div>
        <div class="form-floating mb-3">
          <input
            type="url"
            class="form-control"
            v-model="producto.imagenes"
            placeholder="URL Imagen"
            required
          />
          <label for="imagenes">URL Imagen</label>
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
