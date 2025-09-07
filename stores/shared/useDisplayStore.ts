import { ref, computed, onMounted, onUnmounted } from 'vue'
import { defineStore } from 'pinia'

export const useDisplayStore = defineStore('DisplayStore', () => {
  const width = ref(process.server ? 1920 : window.innerWidth)

  const isMobile = computed(() => width.value < 640)
  const isTablet = computed(() => width.value >= 640 && width.value < 1024)
  const isMobileTable = computed(() => width.value < 1024)
  const isLaptop = computed(() => width.value >= 1024)

  const update = () => { width.value = window.innerWidth }

  if (process.client) {
    onMounted(() => {
      update()
      window.addEventListener('resize', update)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', update)
    })
  }

  return { width, isMobile, isTablet, isMobileTable, isLaptop }
})
