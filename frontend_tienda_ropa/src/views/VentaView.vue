<script setup lang="ts">
import VentaList from '@/components/venta/VentaList.vue'
import VentaSave from '@/components/venta/VentaSave.vue'
import { ref } from 'vue'

const mostrarDialog = ref<boolean>(false)
const ventaListRef = ref<typeof VentaList | null>(null)
const ventaEdit = ref<any>(null)

function handleEdit(venta: any) {
  ventaEdit.value = venta
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  ventaListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="admin-view">
    <div class="header-section">
      <h1 class="view-title">
        <i class="pi pi-shopping-cart"></i>
        Ventas
      </h1>
    </div>
    <VentaList ref="ventaListRef" @edit="handleEdit" />
    <VentaSave
      :mostrar="mostrarDialog"
      :venta="ventaEdit"
      :modoEdicion="!!ventaEdit"
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
  justify-content: flex-start;
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
