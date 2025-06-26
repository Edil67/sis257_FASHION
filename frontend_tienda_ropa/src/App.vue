<template>
  <Toast position="top-right" />
  <GlobalNotifications />
  <router-view />
</template>
<script setup lang="ts">
import { Toast } from 'primevue';
import GlobalNotifications from '@/components/GlobalNotifications.vue';
</script>


<style>
@import '@fortawesome/fontawesome-free/css/all.css';
@import '@/assets/vendor/bootstrap/css/bootstrap.min.css';
@import '@/assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css';
@import '@/assets/fonts/iconic/css/material-design-iconic-font.min.css';
@import '@/assets/fonts/linearicons-v1.0.0/icon-font.min.css';
@import '@/assets/vendor/animate/animate.css';
@import '@/assets/vendor/css-hamburgers/hamburgers.min.css';
@import '@/assets/vendor/animsition/css/animsition.min.css';
@import '@/assets/vendor/select2/select2.min.css';
@import '@/assets/vendor/daterangepicker/daterangepicker.css';
@import '@/assets/vendor/slick/slick.css';
@import '@/assets/vendor/MagnificPopup/magnific-popup.css';
@import '@/assets/vendor/perfect-scrollbar/perfect-scrollbar.css';
@import '@/assets/css/util.css';
@import '@/assets/css/main.css';
</style>
