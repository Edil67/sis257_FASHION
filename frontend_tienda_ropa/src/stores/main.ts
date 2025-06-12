import { defineStore } from 'pinia'
import { getTokenFromLocalStorage } from '@/helpers'
import http from '@/plugins/axios'
import router from '@/router'

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') || '',
    token: getTokenFromLocalStorage(),
    returnUrl: null || '',
  }),
  getters: {},
  actions: {
    async login(nombreUsuario: string, clave: string) {
      await http.post('auth/login', { nombreUsuario, clave }).then((response) => {
        this.user = response.data.nombreUsuario
        this.token = response.data.access_token

        localStorage.setItem('user', this.user || '')
        localStorage.setItem('token', this.token || '')

        router.push(this.returnUrl || '/')
      })
    },
    logout() {
      localStorage.clear()
      this.$reset()
      router.push('login')
    },
  },
})

export { useAuthStore }
