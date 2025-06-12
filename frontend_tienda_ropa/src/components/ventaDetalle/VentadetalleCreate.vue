<script setup lang="ts">
import { ref, onMounted, defineProps } from "vue";
import http from "@/plugins/axios";
import router from "@/router";
import type { Ventadetalle } from '@/models/ventadetalle';
import type { Producto } from '@/models/producto';
import type { Venta } from '@/models/venta';
import type { Cliente } from '@/models/cliente'; // Asegúrate de importar el tipo Cliente si es necesario

const props = defineProps<{
  ENDPOINT_API: string;
}>();

const ENDPOINT = props.ENDPOINT_API ?? "";

const ventadetalle = ref<Ventadetalle>({
  id: 0,
  cantidad: '', // Asegúrate que cantidad y subtotal sean números
  subtotal: '',
  venta: {
    id: 0,
    totalVenta: 0,
    fechaCreacion: Date,
    cantidad:0,
    precioUnitario: 0,
    totalVenta: 0;



    cliente: {
      id: 0,
      nombres: ''
    } as Cliente
  },
  producto: {
    id: 0,
    nombre: ''
  } as Producto // Aquí deberías tipar correctamente producto según el tipo Producto
});

const productos = ref<Producto[]>([]);
const ventas = ref<Venta[]>([]);

async function crearVentadetalle() {
  try {
    await http.post(ENDPOINT, {
      idVenta: ventadetalle.value.venta.id,
      idProducto: ventadetalle.value.producto.id
    });
    router.push("/ventadetalles");
  } catch (error) {
    console.error("Error al crear el detalle de venta:", error);
  }
}

async function getProductos() {
  try {
    const response = await http.get<Producto[]>('productos'); // Asegúrate de tipar correctamente la respuesta
    productos.value = response.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
}

async function getVentas() {
  try {
    const response = await http.get<Venta[]>('ventas'); // Asegúrate de tipar correctamente la respuesta
    ventas.value = response.data;
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
  }
}

onMounted(() => {
  getProductos();
  getVentas();
});

function goBack() {
  router.go(-1);
}
</script>

<template>
  <div class="container" v-if="ventadetalle && ventadetalle.producto && ventadetalle.venta">
    <div class="row">
      <h2>Crear Nuevo Detalle de Venta</h2>
    </div>

    <div class="row">
      <form @submit.prevent="crearVentadetalle">
        <div class="form-floating mb-3">
          <select class="form-select" v-model="ventadetalle.venta" required>
            <option value="" disabled>Seleccione una venta</option>
            <option v-for="venta in ventas" :key="venta.id" :value="venta">
              Cliente - {{ venta.cliente.nombres }}
            </option>
          </select>
          <label for="venta">Venta</label>
        </div>

        <div class="form-floating mb-3">
          <select class="form-select" v-model="ventadetalle.producto" required>
            <option value="" disabled>Seleccione un producto</option>
            <option v-for="producto in productos" :key="producto.id" :value="producto">
              {{ producto.nombre }}
            </option>
          </select>
          <label for="producto">Producto</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="number"
            class="form-control"
            v-model="ventadetalle.cantidad"
            placeholder="Cantidad"
            required
          />
          <label for="cantidad">Cantidad</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="number"
            class="form-control"
            v-model="ventadetalle.subtotal"
            placeholder="Subtotal"
            required
          />
          <label for="subtotal">Subtotal</label>
        </div>

        <div class="text-center mt-3">
          <button type="submit" class="btn btn-primary btn-lg">Guardar</button>
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
