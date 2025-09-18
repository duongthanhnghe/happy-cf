import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'

export const useFirstLoaderStore = defineStore('FirstLoaderStore', () => {
  const loaderActive = ref(false)

  if (process.client) {
    onMounted(() => {
      loaderActive.value = true
    })
  }

  return { loaderActive }
})
