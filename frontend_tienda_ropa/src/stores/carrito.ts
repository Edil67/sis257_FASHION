import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ItemCarrito, Carrito, VentaRequest, DatosCheckout } from '@/models/carrito'
import type { Producto } from '@/models/producto'

export const useCarritoStore = defineStore('carrito', () => {
  // Estado
  const items = ref<ItemCarrito[]>([])
  const datosCheckout = ref<DatosCheckout>({
    metodoPago: 'efectivo'
  })

  // Getters
  const carrito = computed<Carrito>(() => ({
    items: items.value,
    total: items.value.reduce((sum, item) => sum + item.subtotal, 0),
    cantidadTotal: items.value.reduce((sum, item) => sum + item.cantidad, 0)
  }))

  const cantidadItems = computed(() => carrito.value.cantidadTotal)
  const totalCarrito = computed(() => carrito.value.total)
  const estaVacio = computed(() => items.value.length === 0)

  // Acciones
  function agregarAlCarrito(producto: Producto, cantidad: number = 1) {
    const itemExistente = items.value.find(item => item.producto.id === producto.id)
    
    if (itemExistente) {
      // Si el producto ya existe, aumentar cantidad
      itemExistente.cantidad += cantidad
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.producto.precio
      
      // Notificación de cantidad actualizada
      mostrarNotificacion({
        tipo: 'info',
        titulo: 'Cantidad actualizada',
        mensaje: `${producto.nombre} - Nueva cantidad: ${itemExistente.cantidad}`,
        duracion: 2500
      })
    } else {
      // Si es nuevo, agregarlo
      const nuevoItem: ItemCarrito = {
        id: `${producto.id}-${Date.now()}`,
        producto,
        cantidad,
        subtotal: producto.precio * cantidad
      }
      items.value.push(nuevoItem)
      
      // Notificación de producto agregado
      mostrarNotificacion({
        tipo: 'success',
        titulo: '¡Agregado al carrito!',
        mensaje: `${producto.nombre} - ${formatearPrecio(producto.precio)}`,
        duracion: 3000
      })
    }
    
    // Guardar en localStorage
    guardarEnStorage()
  }

  function removerDelCarrito(itemId: string) {
    const index = items.value.findIndex(item => item.id === itemId)
    if (index > -1) {
      items.value.splice(index, 1)
      guardarEnStorage()
    }
  }

  function actualizarCantidad(itemId: string, nuevaCantidad: number) {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      if (nuevaCantidad <= 0) {
        removerDelCarrito(itemId)
      } else {
        item.cantidad = nuevaCantidad
        item.subtotal = item.cantidad * item.producto.precio
        guardarEnStorage()
      }
    }
  }

  function vaciarCarrito() {
    items.value = []
    datosCheckout.value = { metodoPago: 'efectivo' }
    guardarEnStorage()
  }

  function obtenerDetallesVenta(): VentaRequest {
    return {
      metodoPago: datosCheckout.value.metodoPago,
      detalles: items.value.map(item => ({
        idProducto: item.producto.id,
        cantidad: item.cantidad
      })),
      montoPagado: totalCarrito.value,
      cambio: 0
    }
  }

  function actualizarDatosCheckout(datos: Partial<DatosCheckout>) {
    datosCheckout.value = { ...datosCheckout.value, ...datos }
    guardarEnStorage()
  }

  // Persistencia en localStorage
  function guardarEnStorage() {
    localStorage.setItem('carrito-fashion', JSON.stringify({
      items: items.value,
      datosCheckout: datosCheckout.value
    }))
  }

  function cargarDesdeStorage() {
    const carritoGuardado = localStorage.getItem('carrito-fashion')
    if (carritoGuardado) {
      try {
        const data = JSON.parse(carritoGuardado)
        items.value = data.items || []
        datosCheckout.value = data.datosCheckout || { metodoPago: 'efectivo' }
      } catch (error) {
        console.error('Error al cargar carrito desde localStorage:', error)
        vaciarCarrito()
      }
    }
  }

  // Formateo de moneda boliviana
  function formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2
    }).format(precio)
  }

  // Función para mostrar notificaciones
  function mostrarNotificacion(notificacion: {
    tipo: 'success' | 'error' | 'warning' | 'info'
    titulo?: string
    mensaje: string
    duracion?: number
  }) {
    // Disparar evento global para notificaciones
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mostrar-notificacion', {
        detail: notificacion
      }))
    }
  }

  // Inicializar al crear el store
  cargarDesdeStorage()

  return {
    // Estado
    items,
    datosCheckout,
    
    // Getters
    carrito,
    cantidadItems,
    totalCarrito,
    estaVacio,
    
    // Acciones
    agregarAlCarrito,
    removerDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    obtenerDetallesVenta,
    actualizarDatosCheckout,
    guardarEnStorage,
    cargarDesdeStorage,
    formatearPrecio
  }
})
