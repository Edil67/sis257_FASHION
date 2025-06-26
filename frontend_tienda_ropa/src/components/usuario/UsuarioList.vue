<script setup lang="ts">
import type { Usuario } from '@/models/usuario' //hace referencia al modelo USUARIO
import { onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import router from '@/router'
import PaginacionTabla from '../PaginacionTabla.vue'
import { usePaginacion } from '@/composables/usePaginacion'

const props = defineProps<{
  ENDPOINT_API: string
}>()

const ENDPOINT = props.ENDPOINT_API ?? ''
var usuarios = ref<Usuario[]>([])

// Implementar paginación
const {
  datosPaginados: usuariosPaginados,
  totalRegistros,
  onCambioPagina,
  onCambioRecordsPorPagina,
} = usePaginacion(usuarios, { recordsPorPaginaInicial: 5 })

async function getUsuarios() {
  usuarios.value = await http.get(ENDPOINT).then((response) => response.data)
}

function toEdit(id: number) {
  router.push(`/usuarios/editar/${id}`)
}

async function toDelete(id: number) {
  var r = confirm('¿Está seguro que se desea eliminar el Usuario?')
  if (r == true) {
    await http.delete(`${ENDPOINT}/${id}`).then(() => getUsuarios())
  }
}

onMounted(() => {
  getUsuarios()
})
</script>

<template>
  <div class="container">
    <div class="row">
      <h2>Lista de Usuarios</h2>
      <div class="col-12">
        <RouterLink to="/usuarios/crear"
          ><font-awesome-icon icon="fa-solid fa-plus" title="Crear Nuevo"
        /></RouterLink>
      </div>
    </div>

    <div class="table-container">
      <div class="table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Nombre de Usuario</th>
              <th>E-mail</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(usuario, index) in usuariosPaginados.values()" :key="usuario.id">
              <td>{{ usuarios.indexOf(usuario) + 1 }}</td>
              <td class="username-cell">{{ usuario.nombreUsuario }}</td>
              <td class="email-cell">{{ usuario.email }}</td>
              <td class="actions-cell">
                <button class="action-btn edit-btn" @click="toEdit(usuario.id)">
                  <font-awesome-icon icon="fa-solid fa-edit" title="Editar" />
                </button>
                <button class="action-btn delete-btn" @click="toDelete(usuario.id)">
                  <font-awesome-icon icon="fa-solid fa-trash" title="Eliminar" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Componente de paginación -->
    <PaginacionTabla
      :total-registros="totalRegistros"
      :records-por-pagina-inicial="5"
      @cambio-pagina="onCambioPagina"
      @cambio-records-por-pagina="onCambioRecordsPorPagina"
    />
  </div>
</template>

<style scoped>
.table-container {
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Poppins-Regular', Arial, sans-serif;
  background: #fff;
}

.admin-table thead {
  background: linear-gradient(135deg, #717fe0 0%, #6c7ae0 100%);
}

.admin-table thead th {
  padding: 1rem 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  position: relative;
}

.admin-table thead th:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 25%;
  height: 50%;
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.admin-table tbody tr {
  transition: all 0.3s ease;
}

.admin-table tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

.admin-table tbody tr:hover {
  background-color: #e0e7ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(113, 127, 224, 0.15);
}

.admin-table tbody td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #374151;
  vertical-align: middle;
}

.admin-table tbody td:first-child {
  font-weight: 600;
  color: #6c7ae0;
}

.username-cell {
  font-weight: 600;
  color: #374151;
}

.email-cell {
  color: #059669;
  font-weight: 500;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.action-btn {
  padding: 0.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.edit-btn {
  background: #3b82f6;
  color: white;
}

.edit-btn:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .table-container {
    padding: 1rem;
    margin: 0.5rem 0;
  }

  .admin-table thead th,
  .admin-table tbody td {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }

  .actions-cell {
    flex-direction: column;
    gap: 0.25rem;
  }
}

@media (max-width: 640px) {
  .admin-table {
    font-size: 0.75rem;
  }

  .admin-table thead th,
  .admin-table tbody td {
    padding: 0.5rem 0.25rem;
  }
}
</style>
