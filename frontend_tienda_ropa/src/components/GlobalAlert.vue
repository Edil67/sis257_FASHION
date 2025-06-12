<template>
  <div
    v-if="visible"
    :class="['alert', alertType, 'position-fixed', positionClass, 'shadow']"
    style="z-index: 2000; min-width: 300px; max-width: 90vw"
    role="alert"
  >
    <ul class="mb-0" v-if="Array.isArray(message)">
      <li v-for="(msg, i) in message" :key="i">{{ msg }}</li>
    </ul>
    <span v-else>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  message: string | string[]
  type?: string // 'success', 'danger', etc.
  duration?: number // ms
  position?: 'top-center' | 'top-end' | 'top-start'
}>()

const visible = ref(!!props.message)
const alertType = computed(() => `alert-${props.type || 'danger'}`)

const positionClass = computed(() => {
  switch (props.position) {
    case 'top-end':
      return 'top-0 end-0 m-3'
    case 'top-start':
      return 'top-0 start-0 m-3'
    default:
      return 'top-0 start-50 translate-middle-x m-3'
  }
})

watch(
  () => props.message,
  (val) => {
    visible.value = !!val
    if (val && props.duration !== 0) {
      setTimeout(() => (visible.value = false), props.duration || 3500)
    }
  },
  { immediate: true },
)
</script>
