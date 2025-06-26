import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.min.css'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

// Importar jQuery y hacerlo disponible globalmente
import $ from 'jquery'
;(window as any).$ = $
;(window as any).jQuery = $

// Importar otras dependencias
import 'select2'
import 'select2/dist/css/select2.min.css'
import swal from 'sweetalert'
;(window as any).swal = swal
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import PerfectScrollbar from 'perfect-scrollbar'
;(window as any).PerfectScrollbar = PerfectScrollbar
import 'magnific-popup'
import 'magnific-popup/dist/magnific-popup.css'

// Importar Slick Carousel después de jQuery
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel'

import moment from 'moment'
;(window as any).moment = moment
import 'daterangepicker'
import 'daterangepicker/daterangepicker.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(ToastService)
app.use(router)
app.directive('tooltip', Tooltip)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: false || 'none',
      cssLayer: false,
    },
  },
})

app.mount('#app')
