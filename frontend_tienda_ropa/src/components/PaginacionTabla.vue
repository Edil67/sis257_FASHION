<template>
  <div class="pagination-container">
    <!-- Selector de registros por página -->
    <div class="pagination-controls">
      <div class="records-per-page">
        <label for="recordsSelect">Registros por página:</label>
        <select
          id="recordsSelect"
          v-model="recordsPorPagina"
          @change="cambiarRecordsPorPagina"
          class="records-select"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>

      <!-- Información de registros -->
      <div class="pagination-info">
        Mostrando {{ inicioRegistro }} a {{ finRegistro }} de {{ totalRegistros }} registros
      </div>
    </div>

    <!-- Controles de navegación -->
    <div class="pagination-navigation">
      <button
        @click="irAPagina(1)"
        :disabled="paginaActual === 1"
        class="pagination-btn"
        title="Primera página"
      >
        ❮❮
      </button>

      <button
        @click="irAPagina(paginaActual - 1)"
        :disabled="paginaActual === 1"
        class="pagination-btn"
        title="Página anterior"
      >
        ❮
      </button>

      <!-- Números de página -->
      <div class="page-numbers">
        <button
          v-for="pagina in paginasVisibles"
          :key="pagina"
          @click="irAPagina(pagina)"
          :class="['pagination-btn', { active: pagina === paginaActual }]"
        >
          {{ pagina }}
        </button>
      </div>

      <button
        @click="irAPagina(paginaActual + 1)"
        :disabled="paginaActual === totalPaginas"
        class="pagination-btn"
        title="Página siguiente"
      >
        ❯
      </button>

      <button
        @click="irAPagina(totalPaginas)"
        :disabled="paginaActual === totalPaginas"
        class="pagination-btn"
        title="Última página"
      >
        ❯❯
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  totalRegistros: number
  recordsPorPaginaInicial?: number
  paginaInicial?: number
}

const props = withDefaults(defineProps<Props>(), {
  recordsPorPaginaInicial: 5,
  paginaInicial: 1,
})

const emit = defineEmits<{
  'cambio-pagina': [pagina: number, recordsPorPagina: number]
  'cambio-records-por-pagina': [recordsPorPagina: number]
}>()

const paginaActual = ref(props.paginaInicial)
const recordsPorPagina = ref(props.recordsPorPaginaInicial)

// Cálculos computados
const totalPaginas = computed(() => {
  return Math.ceil(props.totalRegistros / recordsPorPagina.value)
})

const inicioRegistro = computed(() => {
  return (paginaActual.value - 1) * recordsPorPagina.value + 1
})

const finRegistro = computed(() => {
  const fin = paginaActual.value * recordsPorPagina.value
  return Math.min(fin, props.totalRegistros)
})

const paginasVisibles = computed(() => {
  const total = totalPaginas.value
  const actual = paginaActual.value
  const paginas: number[] = []

  // Mostrar máximo 5 páginas visibles
  let inicio = Math.max(1, actual - 2)
  let fin = Math.min(total, inicio + 4)

  // Ajustar el inicio si estamos cerca del final
  if (fin - inicio < 4) {
    inicio = Math.max(1, fin - 4)
  }

  for (let i = inicio; i <= fin; i++) {
    paginas.push(i)
  }

  return paginas
})

// Funciones
function irAPagina(pagina: number) {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaActual.value = pagina
    emit('cambio-pagina', pagina, recordsPorPagina.value)
  }
}

function cambiarRecordsPorPagina() {
  paginaActual.value = 1 // Resetear a la primera página
  emit('cambio-records-por-pagina', recordsPorPagina.value)
  emit('cambio-pagina', 1, recordsPorPagina.value)
}

// Watchers
watch(
  () => props.totalRegistros,
  () => {
    // Si el total de registros cambia y la página actual ya no es válida, ir a la última página válida
    if (paginaActual.value > totalPaginas.value && totalPaginas.value > 0) {
      irAPagina(totalPaginas.value)
    }
  },
)

// Exponer funciones para uso externo
defineExpose({
  irAPagina,
  resetearPagina: () => irAPagina(1),
})
</script>

<style scoped>
.pagination-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.records-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.records-per-page label {
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
}

.records-select {
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #fff;
  font-size: 0.9rem;
  color: #495057;
  cursor: pointer;
}

.records-select:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.pagination-info {
  color: #6c757d;
  font-size: 0.9rem;
}

.pagination-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.pagination-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #dee2e6;
  background-color: #fff;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  min-width: 40px;
  text-align: center;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

.pagination-btn:disabled {
  color: #6c757d;
  background-color: #fff;
  border-color: #dee2e6;
  cursor: not-allowed;
  opacity: 0.6;
}

.pagination-btn.active {
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
}

.pagination-btn.active:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

/* Responsive */
@media (max-width: 768px) {
  .pagination-container {
    padding: 0.75rem;
  }

  .pagination-controls {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .pagination-navigation {
    justify-content: center;
  }

  .pagination-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.85rem;
    min-width: 35px;
  }

  .records-per-page {
    justify-content: center;
  }
}
</style>
