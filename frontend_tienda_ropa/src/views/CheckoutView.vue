<template>
    <div class="checkout-container">
        <!-- Header -->
        <div class="checkout-header">
            <router-link to="/" class="back-link">
                <i class="fas fa-arrow-left"></i>
                Volver a la tienda
            </router-link>
            <h1>Finalizar Compra</h1>
        </div>

        <div class="checkout-content">
            <!-- Carrito vacío -->
            <div v-if="carritoStore.estaVacio" class="carrito-vacio">
                <i class="fas fa-shopping-cart vacio-icon"></i>
                <h2>Tu carrito está vacío</h2>
                <p>¡Agrega algunos productos para continuar!</p>
                <router-link to="/" class="btn btn-primary">
                    Ir a comprar
                </router-link>
            </div>

            <!-- Checkout con productos -->
            <div v-else class="checkout-grid">
                <!-- Columna izquierda: Formulario -->
                <div class="checkout-form">
                    <div class="form-section">
                        <h2>Información de contacto</h2>
                        <form @submit.prevent="procesarPago">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="nombre">Nombre *</label>
                                    <input type="text" id="nombre" v-model="datosCliente.nombre" required
                                        placeholder="Ingresa tu nombre">
                                </div>
                                <div class="form-group">
                                    <label for="apellido">Apellido *</label>
                                    <input type="text" id="apellido" v-model="datosCliente.apellido" required
                                        placeholder="Ingresa tu apellido">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" v-model="datosCliente.email"
                                        placeholder="ejemplo@correo.com">
                                </div>
                                <div class="form-group">
                                    <label for="telefono">Teléfono *</label>
                                    <input type="tel" id="telefono" v-model="datosCliente.telefono" required
                                        placeholder="70123456">
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="ci">Carnet de Identidad</label>
                                <input type="text" id="ci" v-model="datosCliente.ci" placeholder="12345678 LP">
                            </div>

                            <div class="form-group">
                                <label for="direccion">Dirección de entrega</label>
                                <textarea id="direccion" v-model="datosCliente.direccion" rows="3"
                                    placeholder="Calle, número, zona, ciudad..."></textarea>
                            </div>

                            <h3>Método de pago</h3>
                            <div class="payment-methods">
                                <div v-for="metodo in metodosPago" :key="metodo.value" class="payment-option"
                                    :class="{ active: metodoPagoSeleccionado === metodo.value }"
                                    @click="metodoPagoSeleccionado = metodo.value">
                                    <div class="payment-header">
                                        <input type="radio" :value="metodo.value" v-model="metodoPagoSeleccionado"
                                            :id="metodo.value">
                                        <label :for="metodo.value">
                                            <i :class="metodo.icon"></i>
                                            {{ metodo.label }}
                                        </label>
                                    </div>
                                    <p class="payment-description">{{ metodo.description }}</p>
                                </div>
                            </div>

                            <!-- Información del pago según método -->
                            <div v-if="metodoPagoSeleccionado === 'qr'" class="payment-info">
                                <h4>Pago por QR</h4>
                                <div class="qr-payment">
                                    <div class="qr-code">
                                        <img src="/qr.png" alt="Código QR" />
                                        <p>Escanea el código QR con tu app bancaria</p>
                                    </div>
                                    <div class="qr-details">
                                        <p><strong>Monto a pagar:</strong> {{
                                            carritoStore.formatearPrecio(carritoStore.totalCarrito) }}</p>
                                        <p><strong>Concepto:</strong> Compra en Fashion Store</p>
                                        <p><strong>Referencia:</strong> #{{ referenciaVenta }}</p>
                                    </div>
                                </div>
                                <div class="upload-voucher">
                                    <label for="comprobanteQR">Subir comprobante de pago:</label>
                                    <input type="file" id="comprobanteQR" accept="image/*" @change="subirComprobanteQR">
                                </div>
                            </div>

                            <div v-if="metodoPagoSeleccionado === 'transferencia'" class="payment-info">
                                <h4>Transferencia Bancaria</h4>
                                <div class="bank-details">
                                    <div class="bank-info">
                                        <h5>Datos bancarios:</h5>
                                        <p><strong>Banco:</strong> Banco Nacional de Bolivia</p>
                                        <p><strong>Cuenta:</strong> 1234567890</p>
                                        <p><strong>Titular:</strong> Fashion Store EIRL</p>
                                        <p><strong>Monto:</strong> {{
                                            carritoStore.formatearPrecio(carritoStore.totalCarrito) }}</p>
                                        <p><strong>Referencia:</strong> #{{ referenciaVenta }}</p>
                                    </div>
                                    <div class="upload-voucher">
                                        <label for="comprobante">Subir comprobante de pago:</label>
                                        <input type="file" id="comprobante" accept="image/*" @change="subirComprobante">
                                    </div>
                                </div>
                            </div>

                            <div v-if="metodoPagoSeleccionado === 'efectivo'" class="payment-info">
                                <h4>Pago en Efectivo</h4>
                                <p>Realiza el pago en efectivo al momento de la entrega o recojo del producto.</p>
                                <div class="form-group">
                                    <label for="montoPagado">Monto que pagarás:</label>
                                    <input type="number" id="montoPagado" v-model.number="montoPagado"
                                        :min="carritoStore.totalCarrito" step="0.01" placeholder="0.00">
                                    <p v-if="cambio > 0" class="cambio">
                                        <strong>Cambio: {{ carritoStore.formatearPrecio(cambio) }}</strong>
                                    </p>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary btn-finalizar" :disabled="procesandoPago">
                                <i v-if="procesandoPago" class="fas fa-spinner fa-spin"></i>
                                {{ procesandoPago ? 'Procesando...' : 'Finalizar Compra' }}
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Columna derecha: Resumen del pedido -->
                <div class="orden-resumen">
                    <h2>Resumen del pedido</h2>

                    <div class="productos-resumen">
                        <div v-for="item in carritoStore.items" :key="item.id" class="producto-resumen">
                            <div class="producto-imagen">
                                <img :src="item.producto.imagenes" :alt="item.producto.nombre">
                                <span class="cantidad-badge">{{ item.cantidad }}</span>
                            </div>
                            <div class="producto-detalles">
                                <h4>{{ item.producto.nombre }}</h4>
                                <p>{{ item.producto.talla }} - {{ item.producto.color }}</p>
                                <p class="precio">{{ carritoStore.formatearPrecio(item.subtotal) }}</p>

                                <!-- Controles de cantidad -->
                                <div class="cantidad-controles">
                                    <button @click="disminuirCantidad(item)" class="btn-cantidad"
                                        :disabled="item.cantidad <= 1">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <span class="cantidad-actual">{{ item.cantidad }}</span>
                                    <button @click="aumentarCantidad(item)" class="btn-cantidad"
                                        :disabled="item.cantidad >= item.producto.stock">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Botón para vaciar carrito -->
                        <div v-if="!carritoStore.estaVacio" class="acciones-carrito">
                            <button @click="confirmarVaciarCarrito" class="btn btn-outline-danger btn-vaciar">
                                <i class="fas fa-trash-alt"></i>
                                Vaciar carrito
                            </button>
                        </div>
                    </div>

                    <div class="resumen-totales">
                        <div class="total-line">
                            <span>Subtotal:</span>
                            <span>{{ carritoStore.formatearPrecio(carritoStore.totalCarrito) }}</span>
                        </div>
                        <div class="total-line">
                            <span>Envío:</span>
                            <span>Gratis</span>
                        </div>
                        <div class="total-line total-final">
                            <span><strong>Total:</strong></span>
                            <span><strong>{{ carritoStore.formatearPrecio(carritoStore.totalCarrito) }}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCarritoStore } from '@/stores/carrito'
import type { DatosCheckout } from '@/models/carrito'
import axios from '@/plugins/axios'

const router = useRouter()
const carritoStore = useCarritoStore()

// Estado del componente
const datosCliente = ref<DatosCheckout>({
    metodoPago: 'efectivo',
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    direccion: '',
    ci: ''
})

const metodoPagoSeleccionado = ref<string>('efectivo')
const montoPagado = ref<number>(0)
const procesandoPago = ref<boolean>(false)
const referenciaVenta = ref<string>('')

// Computed
const cambio = computed(() => {
    return montoPagado.value > carritoStore.totalCarrito ? montoPagado.value - carritoStore.totalCarrito : 0
})

// Métodos de pago disponibles
const metodosPago = [
    {
        value: 'efectivo',
        label: 'Efectivo',
        icon: 'fas fa-money-bill-alt',
        description: 'Pago en efectivo al momento de la entrega'
    },
    {
        value: 'qr',
        label: 'QR',
        icon: 'fas fa-qrcode',
        description: 'Pago inmediato con código QR'
    },
    {
        value: 'transferencia',
        label: 'Transferencia',
        icon: 'fas fa-university',
        description: 'Transferencia bancaria'
    }
]

// Funciones
function generarReferencia() {
    return `FASHION-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

function subirComprobante(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
        console.log('Comprobante subido:', file.name)
        // Aquí puedes manejar la subida del archivo
    }
}

async function procesarPago() {
    if (!datosCliente.value.nombre || !datosCliente.value.apellido || !datosCliente.value.telefono) {
        alert('Por favor completa los campos obligatorios (nombre, apellido, teléfono)')
        return
    }

    if (metodoPagoSeleccionado.value === 'efectivo' && montoPagado.value < carritoStore.totalCarrito) {
        alert('El monto pagado debe ser mayor o igual al total')
        return
    }

    procesandoPago.value = true

    try {
        // Paso 1: Crear cliente
        const clienteData = {
            nombre: datosCliente.value.nombre,
            apellido: datosCliente.value.apellido,
            telefono: datosCliente.value.telefono,
            direccion: datosCliente.value.direccion || ''
        }

        console.log('Creando cliente:', clienteData)
        const clienteResponse = await axios.post('/clientes', clienteData)
        const clienteId = clienteResponse.data.id

        console.log('Cliente creado con ID:', clienteId)

        // Paso 2: Crear venta con el ID del cliente
        const ventaData = {
            idCliente: clienteId,
            metodoPago: metodoPagoSeleccionado.value,
            detalles: carritoStore.items.map(item => ({
                idProducto: item.producto.id,
                cantidad: item.cantidad
            })),
            montoPagado: metodoPagoSeleccionado.value === 'efectivo' ? montoPagado.value : carritoStore.totalCarrito,
            cambio: metodoPagoSeleccionado.value === 'efectivo' ? cambio.value : 0
        }

        console.log('Datos de venta:', ventaData)
        const ventaResponse = await axios.post('/ventas', ventaData)
        
        console.log('Venta creada:', ventaResponse.data)
        
        // Mostrar notificación de éxito
        mostrarNotificacion({
            tipo: 'success',
            titulo: '¡Compra exitosa!',
            mensaje: `Venta procesada correctamente. ID: ${ventaResponse.data.id}`,
            duracion: 4000
        })

        // Actualizar referencia de venta
        referenciaVenta.value = ventaResponse.data.id.toString()

        // Vaciar carrito
        carritoStore.vaciarCarrito()

        // Redirect a página de confirmación
        router.push({
            name: 'ConfirmacionCompra',
            params: { referencia: referenciaVenta.value }
        })

    } catch (error: any) {
        console.error('Error al procesar la venta:', error)
        
        let mensajeError = 'Error al procesar el pago. Inténtalo nuevamente.'
        
        if (error.response?.data?.message) {
            mensajeError = error.response.data.message
        } else if (error.message) {
            mensajeError = error.message
        }
        
        mostrarNotificacion({
            tipo: 'error',
            titulo: 'Error en la compra',
            mensaje: mensajeError,
            duracion: 5000
        })
        
        alert(mensajeError)
    } finally {
        procesandoPago.value = false
    }
}

// Funciones para gestión del carrito
function aumentarCantidad(item: any) {
    if (item.cantidad < item.producto.stock) {
        carritoStore.actualizarCantidad(item.id, item.cantidad + 1)
        mostrarNotificacion({
            tipo: 'info',
            mensaje: `Cantidad actualizada: ${item.cantidad + 1}`,
            duracion: 2000
        })
    } else {
        mostrarNotificacion({
            tipo: 'warning',
            mensaje: 'No hay más stock disponible',
            duracion: 2500
        })
    }
}

function disminuirCantidad(item: any) {
    if (item.cantidad > 1) {
        carritoStore.actualizarCantidad(item.id, item.cantidad - 1)
        mostrarNotificacion({
            tipo: 'info',
            mensaje: `Cantidad actualizada: ${item.cantidad - 1}`,
            duracion: 2000
        })
    }
}

function eliminarProducto(item: any) {
    if (confirm(`¿Estás seguro de eliminar "${item.producto.nombre}" del carrito?`)) {
        carritoStore.removerDelCarrito(item.id)
        mostrarNotificacion({
            tipo: 'success',
            mensaje: `${item.producto.nombre} eliminado del carrito`,
            duracion: 2500
        })
    }
}

function confirmarVaciarCarrito() {
    carritoStore.vaciarCarrito()
    mostrarNotificacion({
        tipo: 'info',
        mensaje: 'Carrito vaciado completamente',
        duracion: 3000
    })
}

// Función para mostrar notificaciones
function mostrarNotificacion(notificacion: {
    tipo: 'success' | 'error' | 'warning' | 'info'
    titulo?: string
    mensaje: string
    duracion?: number
}) {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mostrar-notificacion', {
            detail: notificacion
        }))
    }
}

onMounted(() => {
    referenciaVenta.value = generarReferencia()
    montoPagado.value = carritoStore.totalCarrito
})
</script>

<style scoped>
.checkout-container {
    min-height: 100vh;
    background: #f8f9fa;
    padding: 2rem 0;
}

.checkout-header {
    text-align: center;
    margin-bottom: 2rem;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    text-decoration: none;
    margin-bottom: 1rem;
    transition: color 0.3s ease;
}

.back-link:hover {
    color: #007bff;
}

.checkout-header h1 {
    margin: 0;
    color: #333;
}

.checkout-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.carrito-vacio {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 8px;
}

.vacio-icon {
    font-size: 4rem;
    color: #ccc;
    margin-bottom: 1rem;
}

.checkout-grid {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
}

.checkout-form,
.orden-resumen {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-section h2,
.orden-resumen h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #007bff;
}

.payment-methods {
    margin-bottom: 1.5rem;
}

.payment-option {
    border: 2px solid #eee;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.payment-option:hover {
    border-color: #007bff;
}

.payment-option.active {
    border-color: #007bff;
    background: #f8f9ff;
}

.payment-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.payment-header input[type="radio"] {
    width: auto;
}

.payment-header label {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: 500;
}

.payment-description {
    margin: 0.5rem 0 0 2rem;
    color: #666;
    font-size: 0.9rem;
}

.payment-info {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

.qr-payment {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
    align-items: center;
}

.qr-code {
    text-align: center;
}

.qr-code img {
    width: 150px;
    height: 150px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.bank-details {
    display: grid;
    gap: 1.5rem;
}

.bank-info p {
    margin: 0.25rem 0;
}

.cambio {
    color: #28a745;
    font-size: 1.1rem;
    margin-top: 0.5rem;
}

.btn-finalizar {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
}

.productos-resumen {
    margin-bottom: 1.5rem;
}

.producto-resumen {
    display: flex;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
}

.producto-resumen:last-child {
    border-bottom: none;
}

.producto-imagen {
    position: relative;
    flex-shrink: 0;
}

.producto-imagen img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
}

.cantidad-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #007bff;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.producto-detalles h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
}

.producto-detalles p {
    margin: 0.25rem 0;
    color: #666;
    font-size: 0.8rem;
}

.producto-detalles .precio {
    color: #007bff;
    font-weight: 600;
}

.resumen-totales {
    border-top: 1px solid #eee;
    padding-top: 1rem;
}

.total-line {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.total-final {
    font-size: 1.1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 2px solid #eee;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #0056b3;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Controles de cantidad en checkout */
.cantidad-controles {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding: 0.5rem 0;
}

.btn-cantidad {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    transition: all 0.2s ease;
}

.btn-cantidad:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #007bff;
    color: #007bff;
}

.btn-cantidad:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f8f9fa;
}

.cantidad-actual {
    font-weight: 600;
    padding: 0 0.75rem;
    min-width: 40px;
    text-align: center;
    background: #f8f9fa;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
}

.btn-eliminar {
    width: 30px;
    height: 30px;
    border: 1px solid #dc3545;
    background: white;
    color: #dc3545;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    transition: all 0.2s ease;
    margin-left: auto;
}

.btn-eliminar:hover {
    background: #dc3545;
    color: white;
}

/* Acciones del carrito */
.acciones-carrito {
    padding: 1rem 0;
    border-top: 1px solid #eee;
    margin-top: 1rem;
}

.btn-outline-danger {
    background: transparent;
    border: 1px solid #dc3545;
    color: #dc3545;
}

.btn-outline-danger:hover {
    background: #dc3545;
    color: white;
}

.btn-vaciar {
    width: 100%;
    font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
    .checkout-grid {
        grid-template-columns: 1fr;
    }

    .form-row {
        grid-template-columns: 1fr;
    }

    .qr-payment {
        grid-template-columns: 1fr;
        text-align: center;
    }
}
</style>
