<script setup lang="ts">
import CategoriaList from '@/components/categoria/CategoriaList.vue'
import CategoriaSave from '@/components/categoria/CategoriaSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref<boolean>(false)
const categoriaListRef = ref<typeof CategoriaList | null>(null)
const categoriaEdit = ref<any>(null)

function hableCreate() {
  categoriaEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(categoria: any) {
  categoriaEdit.value = categoria
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  categoriaListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="admin-view">
    <div class="header-section">
      <h1 class="view-title">
        <i class="pi pi-tags"></i>
        Categorías
      </h1>
      <Button label="Crear Nuevo" icon="pi pi-plus" class="create-btn" @click="hableCreate" />
    </div>
    <CategoriaList ref="categoriaListRef" @edit="handleEdit" />
    <CategoriaSave
      :mostrar="mostrarDialog"
      :categoria="categoriaEdit"
      :modoEdicion="!!categoriaEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped>
.admin-view {
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
  margin-top: 10%;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.view-title {
  font-family: 'Poppins-Bold', Arial, sans-serif;
  font-size: 2rem;
  color: #374151;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.view-title i {
  color: #717fe0;
  font-size: 1.75rem;
}

.create-btn {
  background: linear-gradient(135deg, #717fe0 0%, #6c7ae0 100%);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(113, 127, 224, 0.3);
}

@media (max-width: 768px) {
  .admin-view {
    padding: 1rem;
  }

  .header-section {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .view-title {
    font-size: 1.5rem;
  }
}
</style>
