<template>
  <div class="confirmacion-container">
    <!-- Navegación rápida -->
    <NavegacionRapida />

    <div class="confirmacion-content">
      <!-- Icono de éxito -->
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>

      <!-- Mensaje principal -->
      <div class="success-message">
        <h1>¡Compra realizada con éxito!</h1>
        <p>Tu pedido ha sido procesado correctamente</p>
      </div>

      <!-- Detalles del pedido -->
      <div class="order-details">
        <h2>Detalles del pedido</h2>
        <div class="detail-item">
          <span class="label">Número de referencia:</span>
          <span class="value">#{{ referencia }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Fecha:</span>
          <span class="value">{{ fechaActual }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Estado:</span>
          <span class="value status-procesando">Procesando</span>
        </div>
      </div>

      <!-- Información adicional -->
      <div class="info-adicional">
        <div class="info-card">
          <i class="fas fa-shipping-fast"></i>
          <h3>Entrega</h3>
          <p>
            Tu pedido será procesado y te contactaremos para coordinar la entrega en las próximas 24
            horas.
          </p>
        </div>

        <div class="info-card">
          <i class="fas fa-headset"></i>
          <h3>Soporte</h3>
          <p>
            ¿Tienes alguna pregunta? Contáctanos al teléfono <strong>+591 70123456</strong> o por
            WhatsApp.
          </p>
        </div>

        <div class="info-card">
          <i class="fas fa-receipt"></i>
          <h3>Comprobante</h3>
          <p>
            Guarda el número de referencia <strong>#{{ referencia }}</strong> para cualquier
            consulta sobre tu pedido.
          </p>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="action-buttons">
        <router-link to="/" class="btn btn-outline">
          <i class="fas fa-shopping-bag"></i>
          Seguir comprando
        </router-link>

        <button @click="enviarPorWhatsApp" class="btn btn-primary">
          <i class="fab fa-whatsapp"></i>
          Enviar por WhatsApp
        </button>
      </div>

      <!-- Productos recomendados -->
      <div class="productos-relacionados">
        <h2>Te podría interesar</h2>
        <p>Descubre más productos de nuestro catálogo</p>
        <router-link to="/#product-section" class="btn btn-secondary">
          Ver catálogo completo
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NavegacionRapida from '@/components/NavegacionRapida.vue'

const route = useRoute()
const referencia = ref<string>('')
const fechaActual = ref<string>('')

function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function enviarPorWhatsApp() {
  const mensaje = `¡Hola! Mi compra ha sido procesada exitosamente.
  
📋 *Detalles del pedido:*
🔢 Referencia: #${referencia.value}
📅 Fecha: ${fechaActual.value}
📊 Estado: Procesando

Me gustaría confirmar los detalles de entrega. ¡Gracias!`

  const numeroWhatsApp = '+59170123456' // Cambia por tu número
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`
  window.open(url, '_blank')
}

onMounted(() => {
  // Obtener referencia de los parámetros de la ruta
  referencia.value = (route.params.referencia as string) || 'N/A'
  fechaActual.value = formatearFecha(new Date())

  // Confetti o animación de éxito (opcional)
  setTimeout(() => {
    console.log('¡Compra confirmada!')
  }, 500)
})
</script>

<style scoped>
.confirmacion-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.confirmacion-content {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  margin-bottom: 2rem;
}

.success-icon i {
  font-size: 5rem;
  color: #28a745;
  animation: checkmark 0.8s ease-in-out;
}

@keyframes checkmark {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.success-message h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.success-message p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.order-details {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.order-details h2 {
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.detail-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.label {
  font-weight: 500;
  color: #666;
}

.value {
  font-weight: 600;
  color: #333;
}

.status-procesando {
  background: #fff3cd;
  color: #856404;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.info-adicional {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-card {
  text-align: center;
  padding: 1rem;
}

.info-card i {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 1rem;
}

.info-card h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.info-card p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.productos-relacionados {
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.productos-relacionados h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.productos-relacionados p {
  color: #666;
  margin-bottom: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-primary {
  background: #28a745;
  color: white;
}

.btn-primary:hover {
  background: #218838;
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: #007bff;
  border: 2px solid #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .confirmacion-content {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }

  .success-message h1 {
    font-size: 1.5rem;
  }

  .info-adicional {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .success-icon i {
    font-size: 3.5rem;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
