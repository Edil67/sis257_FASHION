<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/index'

const nombreUsuario = ref('')
const clave = ref('')
const error = ref(false)
const loading = ref(false)

async function onSubmit() {
  if (loading.value) return
  
  loading.value = true
  error.value = false
  
  const authStore = useAuthStore()
  
  try {
    await authStore.login(nombreUsuario.value, clave.value)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-background">
      <div class="login-overlay"></div>
    </div>
    
    <div class="login-content">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-section">
            <i class="pi pi-shopping-bag logo-icon"></i>
            <h1 class="brand-title">Fashion Store</h1>
          </div>
          <p class="welcome-text">Bienvenido de vuelta</p>
        </div>

        <form class="login-form" @submit.prevent="onSubmit">
          <div class="input-group">
            <label class="input-label">Usuario</label>
            <div class="input-wrapper">
              <i class="pi pi-user input-icon"></i>
              <input
                v-model="nombreUsuario"
                type="text"
                class="form-input"
                placeholder="Ingresa tu usuario"
                :disabled="loading"
                required
                autofocus
              />
            </div>
          </div>

          <div class="input-group">
            <label class="input-label">Contraseña</label>
            <div class="input-wrapper">
              <i class="pi pi-lock input-icon"></i>
              <input 
                v-model="clave" 
                type="password" 
                class="form-input" 
                placeholder="Ingresa tu contraseña"
                :disabled="loading"
                required
              />
            </div>
          </div>

          <div v-if="error" class="error-message">
            <i class="pi pi-exclamation-triangle"></i>
            Usuario y/o contraseña incorrectos
          </div>

          <button 
            type="submit" 
            class="login-button"
            :disabled="loading || !nombreUsuario || !clave"
          >
            <span v-if="loading" class="loading-spinner">
              <i class="pi pi-spinner pi-spin"></i>
            </span>
            <span v-else>
              <i class="pi pi-sign-in"></i>
            </span>
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="login-footer">
          <p class="footer-text">
            Sistema de gestión de inventario y ventas
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

.login-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="50" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="30" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
}

.login-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
}

.login-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: cardSlideIn 0.8s ease-out;
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-section {
  margin-bottom: 1rem;
}

.logo-icon {
  font-size: 3rem;
  color: #717fe0;
  margin-bottom: 1rem;
  display: block;
  animation: iconFloat 3s ease-in-out infinite;
}

.brand-title {
  font-family: 'Poppins-Bold', Arial, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #374151;
  margin: 0;
  letter-spacing: -0.02em;
}

.welcome-text {
  color: #6b7280;
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
  font-weight: 400;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  font-size: 1rem;
  z-index: 1;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: #fff;
  color: #374151;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  outline: none;
  border-color: #717fe0;
  box-shadow: 0 0 0 3px rgba(113, 127, 224, 0.1);
  transform: translateY(-1px);
}

.form-input:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 8px;
  animation: errorShake 0.5s ease-in-out;
}

.login-button {
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #717fe0 0%, #6c7ae0 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-family: inherit;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(113, 127, 224, 0.3);
  background: linear-gradient(135deg, #6c7ae0 0%, #717fe0 100%);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.footer-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

/* Animaciones */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes cardSlideIn {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes errorShake {
  0%, 20%, 40%, 60%, 80%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem;
  }
  
  .brand-title {
    font-size: 1.75rem;
  }
  
  .logo-icon {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
  
  .brand-title {
    font-size: 1.5rem;
  }
  
  .form-input {
    padding: 0.875rem 0.875rem 0.875rem 2.75rem;
  }
  
  .login-button {
    padding: 0.875rem 1rem;
  }
}

/* Estados de hover mejorados */
.form-input:hover:not(:disabled) {
  border-color: #d1d5db;
}

.input-wrapper:hover .input-icon {
  color: #6b7280;
}

/* Mejoras de accesibilidad */
.login-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(113, 127, 224, 0.3);
}

.form-input:focus + .input-icon {
  color: #717fe0;
}

/* Efectos de glassmorphism mejorados */
.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 24px;
  pointer-events: none;
}
</style>
