<script setup lang="ts">
import type { Empleado } from '@/models/empleado'
import type { Usuario } from '@/models/usuario'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { computed, ref, watch } from 'vue'

// Definición del endpoint de empleados
const ENDPOINT = 'empleados'

// Props recibidas desde el componente padre
const props = defineProps({
  mostrar: Boolean,
  empleado: {
    type: Object as () => Empleado,
    default: () => ({}) as Empleado
  },
  modoEdicion: Boolean // Indica si es modo edición
})

// Emitimos eventos 'guardar', 'close' y 'eliminar' para acciones
const emit = defineEmits(['guardar', 'close', 'eliminar'])

// Empleado local para manejar los cambios y categorías
const empleado = ref<Empleado>({ ...props.empleado })
const usuarios = ref<Usuario[]>([])

// Sincroniza el empleado local con el prop `empleado`
watch(
  () => props.empleado,
  (newVal) => {
    empleado.value = { ...newVal }
  },
  { immediate: true }
)

// Computed para manejar la visibilidad del diálogo
const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close') // Cerrar diálogo si cambia el valor
  }
})

// Función para obtener categorías del backend
async function obtenerUsuarios() {
  try {
    const response = await http.get('usuarios') // Asume que esta es la ruta de la API
    usuarios.value = response.data
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

// Función para guardar o actualizar el empleado
async function handleSave() {
  try {
    const body = {
      idUsuario: empleado.value.usuario?.id,
      nombres:empleado.value.nombres,
      apellidos:empleado.value.apellidos,
      cargo:empleado.value.cargo,
    }

    if (props.modoEdicion) {
      // Actualiza el empleado si está en modo edición
      await http.patch(`${ENDPOINT}/${empleado.value.id}`, body)
    } else {
      // Crea un nuevo empleado
      await http.post(ENDPOINT, body)
      // Aumentar stock de la categoría correspondiente si es necesario

    }

    emit('guardar') // Emite el evento guardar
    empleado.value = {} as Empleado // Resetea el empleado
    dialogVisible.value = false // Cierra el diálogo
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al guardar el empleado')
  }
}

// Función para eliminar un empleado y disminuir su stock




// Carga las categorías cuando se muestra el diálogo
watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) obtenerUsuarios()
  }
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="dialogVisible" :header="props.modoEdicion ? 'Editar Empleado' : 'Crear Empleado'" style="width: 25rem">
      <!-- Selector para la categoría -->
      <div class="flex items-center gap-4 mb-4">
        <label for="usuario" class="font-semibold w-4">Usuario</label>
        <Select
          id="usuario"
          v-model="empleado.usuario"
          :options="usuarios"
          optionLabel="nombreUsuario"
          class="flex-auto"
          placeholder="Seleccione un Usuario"
        />
      </div>

      <!-- Campo de descripción del empleado -->



      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-4">Nombres</label>
        <InputText
          id="nombre"
          v-model="empleado.nombres"
          class="flex-auto"
          autocomplete="off"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="apellidos" class="font-semibold w-4">Apellidos</label>
        <InputText
          id="apellidos"
          v-model="empleado.apellidos"
          class="flex-auto"
          autocomplete="off"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="cargo" class="font-semibold w-4">Cargo</label>
        <InputText
          id="cargo"
          v-model="empleado.cargo"
          class="flex-auto"
          autocomplete="off"
        />
      </div>



      <div class="flex items-center gap-4 mb-4">
        <label for="stock" class="font-semibold w-4">Fecha de Contratacion</label>
        <InputText
          id="FechaContratacion"
          v-model="empleado.fechaContratacion"
          class="flex-auto"
          :min="0"
        />
      </div>



      <!-- Botones de acción -->
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" @click="dialogVisible = false"></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
        <Button v-if="props.modoEdicion" type="button" label="Eliminar" icon="pi pi-trash" severity="danger" @click="handleDelete"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
