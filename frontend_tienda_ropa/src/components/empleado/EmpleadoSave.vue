<script setup lang="ts">
import type { Empleado } from '@/models/empleado'
import type { Usuario } from '@/models/usuario'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'empleados'

const props = defineProps({
  mostrar: Boolean,
  empleado: {
    type: Object as () => Empleado,
    default: () => ({}) as Empleado,
  },
  modoEdicion: Boolean,
})

const emit = defineEmits(['guardar', 'close', 'eliminar'])

const empleado = ref<Empleado>({
  ...props.empleado,
})
const usuarios = ref<Usuario[]>([])

const cargos = ref<string[]>(['Gerente', 'Vendedor', 'Cajero', 'Supervisor', 'Almacenista']) // Roles specific to a clothing store

watch(
  () => props.empleado,
  (newVal) => {
    empleado.value = {
      ...newVal,
    }
  },
  { immediate: true },
)

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

async function obtenerUsuarios() {
  try {
    const response = await http.get('usuarios')
    usuarios.value = response.data
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
}

async function handleSave() {
  try {
    const body = {
      nombre: empleado.value.nombre,
      apellido: empleado.value.apellido,
      telefono: empleado.value.telefono,
      direccion: empleado.value.direccion,
      cargo: empleado.value.cargo,
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${empleado.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    empleado.value = {} as Empleado
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al guardar el empleado')
  }
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) obtenerUsuarios()
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Empleado' : 'Crear Empleado'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-4">Nombre</label>
        <InputText id="nombre" v-model="empleado.nombre" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="apellido" class="font-semibold w-4">Apellido</label>
        <InputText id="apellido" v-model="empleado.apellido" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="cargo" class="font-semibold w-4">Cargo</label>
        <select id="cargo" v-model="empleado.cargo" class="flex-auto">
          <option v-for="cargo in cargos" :key="cargo" :value="cargo">{{ cargo }}</option>
        </select>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="telefono" class="font-semibold w-4">Teléfono</label>
        <InputText id="telefono" v-model="empleado.telefono" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="direccion" class="font-semibold w-4">Dirección</label>
        <InputText
          id="direccion"
          v-model="empleado.direccion"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
