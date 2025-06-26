<template>
  <transition-group name="notificacion" tag="div" class="notificaciones-container">
    <div 
      v-for="notif in notificaciones" 
      :key="notif.id"
      :class="['notificacion', `notificacion-${notif.tipo}`]"
    >
      <div class="notificacion-icon">
        <i :class="obtenerIcono(notif.tipo)"></i>
      </div>
      
      <div class="notificacion-content">
        <h4 v-if="notif.titulo">{{ notif.titulo }}</h4>
        <p>{{ notif.mensaje }}</p>
      </div>
      
      <button @click="cerrarNotificacion(notif.id)" class="btn-cerrar">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Notificacion {
  id: string
  tipo: 'success' | 'error' | 'warning' | 'info'
  titulo?: string
  mensaje: string
  duracion?: number
}

const notificaciones = ref<Notificacion[]>([])

function obtenerIcono(tipo: string): string {
  const iconos = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  }
  return iconos[tipo as keyof typeof iconos] || iconos.info
}

function agregarNotificacion(notificacion: Omit<Notificacion, 'id'>) {
  const id = Date.now().toString()
  const nuevaNotificacion: Notificacion = {
    ...notificacion,
    id,
    duracion: notificacion.duracion || 3000
  }
  
  notificaciones.value.push(nuevaNotificacion)
  
  // Auto cerrar después de la duración especificada
  if (nuevaNotificacion.duracion > 0) {
    setTimeout(() => {
      cerrarNotificacion(id)
    }, nuevaNotificacion.duracion)
  }
}

function cerrarNotificacion(id: string) {
  const index = notificaciones.value.findIndex(n => n.id === id)
  if (index > -1) {
    notificaciones.value.splice(index, 1)
  }
}

// Event listener global para notificaciones
function handleGlobalNotification(event: CustomEvent) {
  agregarNotificacion(event.detail)
}

onMounted(() => {
  window.addEventListener('mostrar-notificacion', handleGlobalNotification as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('mostrar-notificacion', handleGlobalNotification as EventListener)
})

// Exponer función para usar desde otros componentes
defineExpose({
  agregarNotificacion
})
</script>

<style scoped>
.notificaciones-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}

.notificacion {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
  min-width: 300px;
}

.notificacion-success {
  border-left-color: #28a745;
}

.notificacion-error {
  border-left-color: #dc3545;
}

.notificacion-warning {
  border-left-color: #ffc107;
}

.notificacion-info {
  border-left-color: #007bff;
}

.notificacion-icon {
  flex-shrink: 0;
  font-size: 1.25rem;
}

.notificacion-success .notificacion-icon {
  color: #28a745;
}

.notificacion-error .notificacion-icon {
  color: #dc3545;
}

.notificacion-warning .notificacion-icon {
  color: #ffc107;
}

.notificacion-info .notificacion-icon {
  color: #007bff;
}

.notificacion-content {
  flex: 1;
}

.notificacion-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.notificacion-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

.btn-cerrar {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-cerrar:hover {
  background: #f1f1f1;
  color: #666;
}

/* Animaciones */
.notificacion-enter-active {
  transition: all 0.3s ease-out;
}

.notificacion-leave-active {
  transition: all 0.3s ease-in;
}

.notificacion-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.notificacion-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.notificacion-move {
  transition: transform 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .notificaciones-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .notificacion {
    min-width: auto;
  }
}
</style>
