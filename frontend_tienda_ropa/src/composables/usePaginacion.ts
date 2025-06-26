import { computed, ref, type Ref } from 'vue'

export interface UsePaginacionOptions {
  recordsPorPaginaInicial?: number
}

export function usePaginacion<T>(datos: Ref<T[]>, options: UsePaginacionOptions = {}) {
  const { recordsPorPaginaInicial = 5 } = options

  const paginaActual = ref(1)
  const recordsPorPagina = ref(recordsPorPaginaInicial)

  // Datos paginados
  const datosPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * recordsPorPagina.value
    const fin = inicio + recordsPorPagina.value
    return datos.value.slice(inicio, fin)
  })

  // Información de paginación
  const totalRegistros = computed(() => datos.value.length)
  const totalPaginas = computed(() => Math.ceil(totalRegistros.value / recordsPorPagina.value))

  const inicioRegistro = computed(() => {
    if (totalRegistros.value === 0) return 0
    return (paginaActual.value - 1) * recordsPorPagina.value + 1
  })

  const finRegistro = computed(() => {
    if (totalRegistros.value === 0) return 0
    const fin = paginaActual.value * recordsPorPagina.value
    return Math.min(fin, totalRegistros.value)
  })

  // Funciones de navegación
  function irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= totalPaginas.value) {
      paginaActual.value = pagina
    }
  }

  function paginaAnterior() {
    if (paginaActual.value > 1) {
      paginaActual.value--
    }
  }

  function paginaSiguiente() {
    if (paginaActual.value < totalPaginas.value) {
      paginaActual.value++
    }
  }

  function cambiarRecordsPorPagina(nuevaCantidad: number) {
    recordsPorPagina.value = nuevaCantidad
    // Resetear a la primera página cuando cambie el número de registros
    paginaActual.value = 1
  }

  function resetearPaginacion() {
    paginaActual.value = 1
    recordsPorPagina.value = recordsPorPaginaInicial
  }

  // Manejar eventos del componente de paginación
  function onCambioPagina(pagina: number, cantidadPorPagina: number) {
    paginaActual.value = pagina
    recordsPorPagina.value = cantidadPorPagina
  }

  function onCambioRecordsPorPagina(cantidadPorPagina: number) {
    recordsPorPagina.value = cantidadPorPagina
    paginaActual.value = 1
  }

  return {
    // Estado reactivo
    paginaActual,
    recordsPorPagina,
    datosPaginados,

    // Información computada
    totalRegistros,
    totalPaginas,
    inicioRegistro,
    finRegistro,

    // Funciones de navegación
    irAPagina,
    paginaAnterior,
    paginaSiguiente,
    cambiarRecordsPorPagina,
    resetearPaginacion,

    // Manejadores de eventos
    onCambioPagina,
    onCambioRecordsPorPagina,
  }
}
