<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import http from '@/plugins/axios'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import type { Producto } from '@/models/producto'
import type { Cliente } from '@/models/cliente'
import type { Empleado } from '@/models/empleado'

const clientes = ref<Cliente[]>([])
const productos = ref<Producto[]>([])
const empleados = ref<Empleado[]>([])
const detallesVenta = ref<
  Array<{
    cantidad: number
    precioUnitario: number
    totalVenta: number
    idCliente: string
    idProducto: string
    descripcion?: string
    stock?: number
    descuento: number
  }>
>([])

const props = defineProps<{
  ENDPOINT_API: string
  empleadoId: number
}>()

const router = useRouter()
const selectedClienteId = ref<string>('')
const crearClienteModal = ref<boolean>(false)

const nombres = ref('')
const apellidos = ref('')
const direccion = ref('')
const telefono = ref('')
const email = ref('')
const dineroRecibido = ref<number>(0)
const fechaCreacion = ref(new Date().toISOString().substring(0, 10))

async function getClientes() {
  clientes.value = await http.get('clientes').then((response) => response.data)
}

async function getProductos() {
  productos.value = await http.get('productos').then((response) => response.data)
}

async function getEmpleados() {
  empleados.value = await http.get('empleados').then((response) => response.data)
}

onMounted(() => {
  getClientes()
  getProductos()
  getEmpleados() // Asegúrate de llamar a getEmpleados aquí o en otro lugar adecuado
})

function mostrarTotalVenta() {
  const sumaTotalVenta = detallesVenta.value
    .reduce((total, venta) => total + venta.totalVenta, 0)
    .toFixed(2)
  alert(`La suma total de las ventas es: ${sumaTotalVenta}`)
}

function agregarDetalle() {
  detallesVenta.value.push({
    cantidad: 0,
    precioUnitario: 0,
    totalVenta: 0.0,
    idCliente: selectedClienteId.value,
    idProducto: '',
    descripcion: '',
    stock: 0
  })
}

watch(
  detallesVenta,
  async (detalles) => {
    for (let i = 0; i < detalles.length; i++) {
      const detalle = detalles[i]
      if (detalle.idProducto) {
        const producto = productos.value.find((p) => p.id === detalle.idProducto)
        if (producto) {
          detalle.precioUnitario = producto.precioUnitario
          detalle.totalVenta = detalle.cantidad * detalle.precioUnitario
          detalle.stock = producto.stock - detalle.cantidad // Disminuir el stock en tiempo real
        }
      }
    }
  },
  { deep: true }
)

async function crearDetalles() {
  const data = {
    clienteId: selectedClienteId.value,
    empleadoId: props.empleadoId,
    detallesVenta: detallesVenta.value,
    fechaCreacion: fechaCreacion.value // Añadir la fecha a los detalles de la venta
  }
  await http
    .post(`${props.ENDPOINT_API}/detalles`, data)
    .then((response) => {
      console.log(response)
      getProductos() // Recargar la lista de productos después de la venta
    })
    .catch((error) => {
      console.error(error)
    })
}

function goBack() {
  router.go(-1)
}

function calcularTotalVenta() {
  return detallesVenta.value.reduce((total, detalle) => total + detalle.totalVenta, 0).toFixed(2)
}

function calcularCambio() {
  const totalVenta = parseFloat(calcularTotalVenta())
  return (dineroRecibido.value - totalVenta).toFixed(2)
}

function crearCliente() {
  const nuevoCliente = {
    nombres: nombres.value,
    apellidos: apellidos.value,
    direccion: direccion.value,
    telefono: telefono.value,
    email: email.value
  }
  http
    .post('clientes', nuevoCliente)
    .then(() => {
      crearClienteModal.value = false
      getClientes() // Recargar la lista de clientes después de agregar uno nuevo
    })
    .catch((error) => {
      console.error(error)
    })
}
</script>

<template>
  <div class="container calculadora1">
    <div class="row">
      <div class="col-12 text-center mt-3 mb-3">
        <h2 class="titulo">Nueva Venta</h2>
      </div>
    </div>

    <div class="row">
      <form @submit.prevent="crearDetalles">
        <div class="form-floating mb-3">
          <select v-model="selectedClienteId" class="form-select" required>
            <option v-for="cliente in clientes" :value="cliente.id" :key="cliente.id">
              {{ cliente.nombres + ' ' + cliente.apellidos }}
            </option>
          </select>
          <label for="cliente" class="h11">Cliente</label>
          <button type="button" class="btn btn-link" @click="crearClienteModal = true">
            Registrar Cliente
          </button>
        </div>

        <!-- Empleado ID y Fecha de Creación -->
        <div class="form-floating mb-3">
          <select v-model="props.empleadoId" class="form-select" required>
            <option v-for="empleado in empleados" :value="empleado.id" :key="empleado.id">
              {{ empleado.nombres + ' ' + empleado.apellidos }}
            </option>
          </select>
          <label for="empleadoId">Empleado</label>
        </div>

        <div class="form-floating mb-3">
          <input type="date" class="form-control" :value="fechaCreacion" readonly />
          <label for="fechaCreacion">Fecha de Creación</label>
        </div>

        <!-- Detalles de la venta -->
        <div v-for="(detalle, index) in detallesVenta" :key="index" class="row align-items-center">
          <div class="col">
            <div class="form-floating mb-3">
              <select v-model="detalle.idProducto" class="form-select" required>
                <option v-for="producto in productos" :value="producto.id" :key="producto.id">
                  {{ producto.nombre }} (Bs.{{ producto.precioUnitario }})
                </option>
              </select>
              <label for="producto">Producto</label>
            </div>
            <div v-if="detalle.stock !== undefined" class="floating-info mb-3">
              <p>Stock: {{ detalle.stock }} <i class="fas fa-box"></i></p>
            </div>
          </div>
          <div class="col">
            <div class="form-floating mb-3">
              <input
                type="number"
                class="form-control"
                v-model="detalle.cantidad"
                placeholder="Cantidad"
                required
              />
              <label for="cantidad">Cantidad</label>
            </div>
          </div>
          <div class="col">
            <div class="form-floating mb-3">
              <input
                type="number"
                class="form-control"
                :value="detalle.precioUnitario"
                placeholder="Precio Unitario"
                step="0.01"
                readonly
              />
              <label for="precioUnitario">Precio por Unidad (Bs.)</label>
            </div>
          </div>
          <div class="col">
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                :value="
                  detalle.totalVenta.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
                "
                placeholder="totalVenta"
                readonly
              />
              <label for="totalVenta">Total (Bs.)</label>
            </div>
          </div>
        </div>

        <!-- Botones para agregar producto, guardar venta y cancelar -->
        <div class="text-center mt-3">
          <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
            <div class="btn-group me-2" role="group" aria-label="First group">
              <button
                type="button"
                class="btn btn-primary btn-lg producto"
                @click="agregarDetalle"
                :disabled="!selectedClienteId"
              >
                Agregar Producto
              </button>
            </div>
            <div class="btn-group" role="group" aria-label="Second group">
              <button
                type="submit"
                class="btn btn-primary btn-lg guardar"
                :disabled="!selectedClienteId"
              >
                Guardar Venta
              </button>
              <button type="button" class="btn btn-link"></button>
              <button type="button" class="btn btn-primary btn-lg cancelar" @click="goBack">
                Cancelar Venta
              </button>
            </div>
          </div>
        </div>

        <!-- Sección para mostrar el total de la venta y calcular el cambio -->
        <div class="text-center mt-3 col-md-6 calculadora">
          <h3 class="titulo">Calculadora</h3>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              :value="calcularTotalVenta()"
              placeholder="Total de Venta"
              readonly
            />
            <label for="totalVenta">Total (Bs.)</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="number"
              class="form-control"
              v-model.number="dineroRecibido"
              placeholder="Dinero Recibido"
            />
            <label for="dineroRecibido">Dinero Recibido (Bs.)</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              :value="calcularCambio()"
              placeholder="Cambio"
              readonly
            />
            <label for="cambio">Cambio (Bs.)</label>
          </div>
        </div>
      </form>
    </div>

    <!-- Modal para crear nuevo cliente -->
    <div v-if="crearClienteModal" class="modal fade show" style="display: block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Crear Nuevo Cliente</h5>
            <button type="button" class="btn-close" @click="crearClienteModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="nombre"
                v-model="nombres"
                placeholder="Nombre"
                required
              />
              <label for="nombre">Nombres</label>
            </div>
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="apellido"
                v-model="apellidos"
                placeholder="Apellido"
                required
              />
              <label for="apellido">Apellidos</label>
            </div>
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="direccion"
                v-model="direccion"
                placeholder="Dirección"
                maxlength="20"
                required
              />
              <label for="direccion">Dirección</label>
            </div>

            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="telefono"
                v-model="telefono"
                placeholder="Teléfono"
                maxlength="20"
                required
              />
              <label for="telefono">Número de Celular</label>
            </div>

            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="email"
                v-model="email"
                placeholder="E-Mail"
                maxlength="20"
                required
              />
              <label for="email">E-mail</label>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="crearClienteModal = false">
                Cancelar
              </button>
              <button type="button" class="btn btn-primary" @click="crearCliente">
                Crear Cliente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Estilo para las columnas del formulario */
.col-md-6 {
  flex: 1;
  min-width: 200px; /* Ancho mínimo para las columnas */
}
/* Estilos para el modal */
.modal.fade.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  max-width: 500px;
  margin: 1.75rem auto;
}

.cancelar {
  background-color: #ff0000;
  border-color: #ff0000;
  color: white; /* Cambia el color del texto a blanco para mayor contraste */
}

.cancelar:hover {
  background-color: #ff2000; /* Color más oscuro al pasar el mouse */
  border-color: #ff2000;
}

.guardar {
  background-color: green;
  border-color: green;
  color: white; /* Cambia el color del texto a blanco para mayor contraste */
}

.guardar:hover {
  background-color: green; /* Color más oscuro al pasar el mouse */
  border-color: green;
}

.producto {
  background-color: purple;
  border-color: purple;
  color: white; /* Cambia el color del texto a blanco para mayor contraste */
}

.producto:hover {
  background-color: purple; /* Color más oscuro al pasar el mouse */
  border-color: purple;
}

/* Ajustar el tamaño de la casilla de selección */
.form-select {
  background-color: #a9a9a9; /* Color plomo oscuro */
  color: #000000; /* Letras negras */
  max-width: 500px; /* Ancho máximo para la casilla de selección */
}

/* Estilos para las entradas de datos (inputs) */
.form-control {
  background-color: #a9a9a9; /* Color plomo oscuro */
  color: #000000; /* Letras negras */
}

label {
  color: #000000;
}
.titulo {
  color: black;
}

.calculadora {
  background-color: #4e73df; /* Color de fondo azul claro */
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 1); /* Sombra suave */
  margin-bottom: 20px; /* Espacio inferior */
}

.calculadora .titulo {
  margin-top: 0;
  font-size: 1.5rem;
  color: #333; /* Color del texto */
}

.calculadora1 {
  background-color: #f8de81; /* Color de fondo azul claro */
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 1); /* Sombra suave */
  margin-bottom: 20px; /* Espacio inferior */
}

.calculadora1 .titulo {
  margin-top: 0;
  font-size: 1.5rem;
  color: #333; /* Color del texto */
}
</style>
