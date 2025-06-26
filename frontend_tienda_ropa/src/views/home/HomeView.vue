<script setup lang="ts">
import Footer from './Footer.vue'
import NavBar from './NavBar.vue'
import Slider from './Slider.vue'
import Banner from './Banner.vue'
import Product from './Product.vue'
import CarritoFlotante from '@/components/CarritoFlotante.vue'
</script>

<template class="animsition">
  <NavBar />

  <div id="slider-section">
    <Slider />
  </div>

  <div id="banner-section">
    <Banner />
  </div>

  <div id="product-section">
    <Product />
  </div>

  <div id="footer-section">
    <Footer />
  </div>

  <!-- Carrito flotante -->
  <CarritoFlotante />
</template>
