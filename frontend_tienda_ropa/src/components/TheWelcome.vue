<script setup lang="ts">
import { ref } from 'vue';
import Carousel from 'primevue/carousel';
import Card from 'primevue/card';

// Tasa de cambio de USD a Bs (modifica según la tasa actual)
const exchangeRate = 25;

const featuredProducts = ref([
  {
    id: 1,
    name: 'Vestido Floral',
    description: 'Vestido ligero con estampado floral, ideal para primavera',
    price: 40.99,
    image: 'https://www.kaoaofficial.com/cdn/shop/files/03-08-2023_25.jpg?v=1697552034'
  },
  {
    id: 2,
    name: 'Chaqueta de Cuero',
    description: 'Chaqueta negra de cuero sintético con diseño moderno',
    price: 119.99,
    image: 'https://m.media-amazon.com/images/I/81b1i-o-LhL._AC_SL1500_.jpg'
  },
  {
    id: 3,
    name: 'Camisa Casual Blanca',
    description: 'Camisa blanca oversize con estilo urbano',
    price: 19.99,
    image: 'https://moonandrain.com/wp-content/uploads/2023/06/23S19-CMBCTD004_4.jpg'
  }
]);

const newArrivals = ref([
  {
    id: 4,
    name: 'Falda Plisada Rosa',
    description: 'Falda midi plisada en tono pastel',
    price: 24.99,
    image: 'https://fameoncentral.com/cdn/shop/products/MEL558_PINK37.jpg?v=1726990782&width=1500'
  },
  {
    id: 5,
    name: 'Pantalón Palazzo',
    description: 'Pantalón amplio y elegante para cualquier ocasión',
    price: 34.99,
    image: 'https://julio.com/media/catalog/product/1/4/pantalon-palazzo-tiro-alto-nuezUZQf.jpg?quality=80&bg-color=255,255,255&height=638&width=508&canvas=508:638'
  }
]);
</script>

<template>
  <div class="bg-[#fdfaf6] text-gray-800 min-h-screen">
    <!-- Sección Principal / Hero -->
    <div
      class="hero-section text-center px-4 py-20 md:px-6 lg:px-8"
      style="background-image: url('https://images.unsplash.com/photo-1620781284907-56c798e06f64?auto=format&fit=crop&w=1600&q=80'); background-size: cover; background-position: center;"
    >
      <div class="bg-black bg-opacity-50 py-16 px-6 rounded-xl inline-block">
        <h1 class="text-5xl font-bold text-white mb-4">Fashion Boutique</h1>
        <p class="text-xl text-gray-100 mb-6">Estilo moderno y exclusivo para cada día</p>
      </div>
    </div>

    <!-- Productos Destacados -->
    <div class="max-w-6xl mx-auto px-4 py-10">
      <h2 class="text-center text-3xl font-semibold text-neutral-800 mb-8">Productos Destacados</h2>
      <Carousel :value="featuredProducts" :numVisible="3" :numScroll="1" class="justify-center">
        <template #item="slotProps">
          <div class="p-3 flex justify-center">
            <Card class="rounded-2xl shadow-md max-w-xs w-full">
              <template #header>
                <img :src="slotProps.data.image" :alt="slotProps.data.name" class="w-full h-80 object-cover rounded-t-2xl" />
              </template>
              <template #title>{{ slotProps.data.name }}</template>
              <!-- Mostrar precio convertido a Bolivianos (Bs) -->
              <template #subtitle>Bs. {{ (slotProps.data.price * exchangeRate).toFixed(2) }}</template>
              <template #content>
                <p class="text-sm text-gray-600">{{ slotProps.data.description }}</p>
              </template>
            </Card>
          </div>
        </template>
      </Carousel>
    </div>

    <!-- Novedades -->
    <div class="max-w-5xl mx-auto px-4 py-10">
      <h2 class="text-center text-3xl font-semibold text-neutral-800 mb-8">Novedades</h2>
      <Carousel :value="newArrivals" :numVisible="2" :numScroll="1" class="justify-center">
        <template #item="slotProps">
          <div class="p-3 flex justify-center">
            <Card class="rounded-2xl shadow-md max-w-xs w-full">
              <template #header>
                <img :src="slotProps.data.image" :alt="slotProps.data.name" class="w-full h-80 object-cover rounded-t-2xl" />
              </template>
              <template #title>{{ slotProps.data.name }}</template>
              <!-- Mostrar precio convertido a Bolivianos (Bs) -->
              <template #subtitle>Bs. {{ (slotProps.data.price * exchangeRate).toFixed(2) }}</template>
              <template #content>
                <p class="text-sm text-gray-600">{{ slotProps.data.description }}</p>
              </template>
            </Card>
          </div>
        </template>
      </Carousel>
    </div>

    <!-- Por qué elegirnos -->
    <div class="max-w-6xl mx-auto px-4 py-16">
      <h2 class="text-center text-3xl font-semibold text-neutral-800 mb-12">¿Por qué elegirnos?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        <div>
          <div class="text-4xl text-neutral-700 mb-4">
            <i class="pi pi-star-fill"></i>
          </div>
          <h3 class="text-lg font-semibold mb-2">Tendencias Exclusivas</h3>
          <p class="text-gray-600">Seleccionamos las últimas tendencias del mundo de la moda.</p>
        </div>
        <div>
          <div class="text-4xl text-neutral-700 mb-4">
            <i class="pi pi-check-circle"></i>
          </div>
          <h3 class="text-lg font-semibold mb-2">Calidad Garantizada</h3>
          <p class="text-gray-600">Cada prenda pasa por un estricto control de calidad.</p>
        </div>
        <div>
          <div class="text-4xl text-neutral-700 mb-4">
            <i class="pi pi-send"></i>
          </div>
          <h3 class="text-lg font-semibold mb-2">Envío Rápido</h3>
          <p class="text-gray-600">Recibe tus compras en tiempo récord en todo el país.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  background-size: cover;
  background-position: center;
}
</style>