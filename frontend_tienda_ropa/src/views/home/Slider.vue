<script setup lang="ts">
import { onMounted, nextTick } from 'vue';

// Importar las imágenes correctamente con Vite
import slide01 from '@/assets/images/slide-01.jpg';
import slide02 from '@/assets/images/slide-02.jpg';
import slide03 from '@/assets/images/slide-03.jpg';

// Configuración de slides
const slides = [
  {
    image: slide01,
    subtitle: "Colección de Mujeres 2025",
    title: "NUEVA TEMPORADA",
    animations: {
      subtitle: { appear: "fadeInDown", delay: 0 },
      title: { appear: "fadeInUp", delay: 800 },
      button: { appear: "zoomIn", delay: 1600 }
    }
  },
  {
    image: slide02,
    subtitle: "Nueva Temporada para Hombres",
    title: "Chaquetas",
    animations: {
      subtitle: { appear: "rollIn", delay: 0 },
      title: { appear: "lightSpeedIn", delay: 800 },
      button: { appear: "slideInUp", delay: 1600 }
    }
  },
  {
    image: slide03,
    subtitle: "Colección de Hombres 2025",
    title: "Nuevas Llegadas",
    animations: {
      subtitle: { appear: "rotateInDownLeft", delay: 0 },
      title: { appear: "rotateInUpRight", delay: 800 },
      button: { appear: "rotateIn", delay: 1600 }
    }
  }
];

onMounted(async () => {
  // Esperamos a que Vue renderice el componente completamente
  await nextTick();

  // Esperamos un poco más para asegurar que jQuery esté disponible
  setTimeout(() => {
    const $ = (window as any).$;
    if ($) {
      console.log('Inicializando slider con jQuery');

      // Inicializar Slick slider
      $('.slick1').slick({
        autoplay: true,
        autoplaySpeed: 6000,
        arrows: true,
        dots: false,
        infinite: true,
        speed: 1000,
        fade: true,
        cssEase: 'linear',
        prevArrow: '<button class="arrow-slick1 prev-slick1"><i class="zmdi zmdi-chevron-left"></i></button>',
        nextArrow: '<button class="arrow-slick1 next-slick1"><i class="zmdi zmdi-chevron-right"></i></button>'
      });

      // Función para activar animaciones en la diapositiva activa
      function activateSlideAnimations() {
        $('.slick1 .slick-active .layer-slick1').each(function (index: number) {
          const $element = $(this as any);
          const animationName = $element.attr('data-appear');
          const delay = $element.attr('data-delay') || '0';

          setTimeout(() => {
            $element.removeClass('visible-false').addClass('animated ' + animationName);
          }, parseInt(delay));
        });
      }

      // Función para resetear animaciones
      function resetSlideAnimations() {
        $('.layer-slick1').removeClass('animated fadeInDown fadeInUp zoomIn rollIn lightSpeedIn slideInUp rotateInDownLeft rotateInUpRight rotateIn').addClass('visible-false');
      }

      // Activar animaciones en la primera diapositiva
      setTimeout(() => {
        activateSlideAnimations();
      }, 500);

      // Eventos del slider
      $('.slick1').on('beforeChange', function (event: any, slick: any, currentSlide: any, nextSlide: any) {
        resetSlideAnimations();
      });

      $('.slick1').on('afterChange', function (event: any, slick: any, currentSlide: any) {
        setTimeout(() => {
          activateSlideAnimations();
        }, 100);
      });

      console.log('Slider inicializado correctamente');
    } else {
      console.error('jQuery no está disponible para inicializar el slider');
    }
  }, 1000);
});
</script>


<template>
  <!-- Slider -->
  <section class="section-slide">
    <div class="wrap-slick1">
      <div class="slick1">
        <div 
          v-for="(slide, index) in slides" 
          :key="index"
          class="item-slick1" 
          :style="{ backgroundImage: `url(${slide.image})` }"
        >
          <div class="container h-full">
            <div class="flex-col-l-m h-full p-t-100 p-b-30 respon5">
              <div 
                class="layer-slick1 animated visible-false" 
                :data-appear="slide.animations.subtitle.appear" 
                :data-delay="slide.animations.subtitle.delay"
              >
                <span class="ltext-101 cl2 respon2">
                  {{ slide.subtitle }}
                </span>
              </div>

              <div 
                class="layer-slick1 animated visible-false" 
                :data-appear="slide.animations.title.appear" 
                :data-delay="slide.animations.title.delay"
              >
                <h2 class="ltext-201 cl2 p-t-19 p-b-43 respon1">
                  {{ slide.title }}
                </h2>
              </div>

              <div 
                class="layer-slick1 animated visible-false" 
                :data-appear="slide.animations.button.appear" 
                :data-delay="slide.animations.button.delay"
              >
                <a href="product.html" class="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04">
                  Comprar Ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Estilos para el slider */
.section-slide {
  position: relative;
  z-index: 1;
}

.wrap-slick1 {
  position: relative;
}

.slick1 {
  position: relative;
}

.item-slick1 {
  height: 100vh;
  min-height: 600px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  position: relative;
  display: flex !important;
  align-items: center;
}

/* Flechas del slider */
:deep(.arrow-slick1) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.5);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.arrow-slick1:hover) {
  background: rgba(255, 255, 255, 0.6);
  color: #333;
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-50%) scale(1.1);
}

:deep(.prev-slick1) {
  left: 30px;
}

:deep(.next-slick1) {
  right: 30px;
}

/* Slick dots si decides usarlos */
:deep(.slick-dots) {
  bottom: 30px;
  text-align: center;
}

:deep(.slick-dots li button:before) {
  color: white;
  font-size: 12px;
}

:deep(.slick-dots li.slick-active button:before) {
  color: #717fe0;
}

/* Contenido del slider */
.layer-slick1 {
  animation-duration: 1s;
  animation-fill-mode: both;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.layer-slick1.animated {
  opacity: 1;
  transform: translateY(0);
}

.layer-slick1.visible-false {
  opacity: 0;
  transform: translateY(30px);
}

/* Efectos de fade para las animaciones */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
    opacity: 1;
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@keyframes rollIn {
  from {
    opacity: 0;
    transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes lightSpeedIn {
  from {
    transform: translate3d(100%, 0, 0) skewX(-30deg);
    opacity: 0;
  }
  60% {
    transform: skewX(20deg);
    opacity: 1;
  }
  80% {
    transform: skewX(-5deg);
    opacity: 1;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translate3d(0, 100%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes rotateInDownLeft {
  from {
    transform-origin: left bottom;
    transform: rotate3d(0, 0, 1, -45deg);
    opacity: 0;
  }
  to {
    transform-origin: left bottom;
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes rotateInUpRight {
  from {
    transform-origin: right bottom;
    transform: rotate3d(0, 0, 1, 90deg);
    opacity: 0;
  }
  to {
    transform-origin: right bottom;
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes rotateIn {
  from {
    transform-origin: center;
    transform: rotate3d(0, 0, 1, -200deg);
    opacity: 0;
  }
  to {
    transform-origin: center;
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

/* Clases de animación */
.fadeInDown {
  animation-name: fadeInDown;
}

.fadeInUp {
  animation-name: fadeInUp;
}

.zoomIn {
  animation-name: zoomIn;
}

.rollIn {
  animation-name: rollIn;
}

.lightSpeedIn {
  animation-name: lightSpeedIn;
}

.slideInUp {
  animation-name: slideInUp;
}

.rotateInDownLeft {
  animation-name: rotateInDownLeft;
}

.rotateInUpRight {
  animation-name: rotateInUpRight;
}

.rotateIn {
  animation-name: rotateIn;
}

/* Mejoras visuales adicionales */
.slick1 .slick-slide {
  outline: none;
}

.slick1 .slick-slide img {
  display: block;
  width: 100%;
  height: auto;
}

/* Responsive */
@media (max-width: 991px) {
  :deep(.prev-slick1),
  :deep(.next-slick1) {
    display: none !important;
  }
}

@media (max-width: 767px) {
  .item-slick1 {
    height: 70vh;
    min-height: 500px;
  }
  
  :deep(.arrow-slick1) {
    width: 45px;
    height: 45px;
    font-size: 16px;
  }
  
  :deep(.prev-slick1) {
    left: 15px;
  }
  
  :deep(.next-slick1) {
    right: 15px;
  }
}

@media (max-width: 576px) {
  .item-slick1 {
    height: 60vh;
    min-height: 400px;
  }
}
</style>
