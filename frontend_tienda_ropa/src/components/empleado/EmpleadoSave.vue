<script setup lang="ts">
import type { Empleado } from '@/models/empleado'
import type { Usuario } from '@/models/usuario'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
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
      idUsuario: empleado.value.usuario?.id,
      nombres: empleado.value.nombres,
      apellidos: empleado.value.apellidos,
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
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-4">Nombres</label>
        <InputText id="nombre" v-model="empleado.nombres" class="flex-auto" autocomplete="off" />
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
        <InputText id="cargo" v-model="empleado.cargo" class="flex-auto" autocomplete="off" />
      </div>
      <!-- Campo de fecha eliminado -->
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
        <Button
          v-if="props.modoEdicion"
          type="button"
          label="Eliminar"
          icon="pi pi-trash"
          severity="danger"
          @click="emit('eliminar')"
        ></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
