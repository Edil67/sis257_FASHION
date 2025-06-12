<script setup lang="ts">
import type { Cliente } from '@/models/cliente' //hace referencia al modelo cliente
import { onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import router from '@/router'

const props = defineProps<{
  ENDPOINT_API: string
}>()

const ENDPOINT = props.ENDPOINT_API ?? ''
var clientes = ref<Cliente[]>([])

async function getClientes() {
  clientes.value = await http.get(ENDPOINT).then((response) => response.data)
}

function toEdit(id: number) {
  router.push(`/clientes/editar/${id}`)
}

async function toDelete(id: number) {
  var r = confirm('¿Está seguro que se desea eliminar el Cliente?')
  if (r == true) {
    await http.delete(`${ENDPOINT}/${id}`).then(() => getclientes())
  }
}

onMounted(() => {
  getClientes()
})
</script>

<template>
  <div class="container">
    <div class="row">
      <h2>Lista de Clientes</h2>
      <div class="col-12">
        <RouterLink to="/clientes/crear"
          ><font-awesome-icon icon="fa-solid fa-plus" title="Crear Nuevo"
        /></RouterLink>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">N°</th>
            <th scope="col">Nombres</th>
            <th scope="col">Apellidos</th>
            <th scope="col">Direccion</th>
            <th scope="col">Teléfono</th>
            <th scope="col">E-mail</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(cliente, index) in clientes.values()" :key="cliente.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ cliente.nombres }}</td>
            <td>{{ cliente.apellidos }}</td>
            <td>{{ cliente.direccion }}</td>
            <td>{{ cliente.telefono }}</td>
            <td>{{ cliente.email }}</td>

            <td>
              <button class="btn btn-link" @click="toEdit(cliente.id)">
                <font-awesome-icon icon="fa-solid fa-edit" title="Editar" />
              </button>

              <!-- <button class="btn btn-link" @click="toDelete(cliente.id)"
              ><font-awesome-icon icon="fa-solid fa-trash" title="Elimnar" /></button> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table th {
  background-color: white; /* Color plomo */
  border: 1px solid #000000; /* Bordes negros */
}
.table td {
  background-color: rgba(227, 155, 20); /* Color plomo */
  border: 1px solid #000000; /* Bordes negros */
}

.table td {
  color: #000000; /* Texto oscuro para las celdas */
}
.btn {
  color: #000000;
}
</style>
