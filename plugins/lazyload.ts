import { defineNuxtPlugin } from '#app'
import VueLazyLoad from 'vue3-lazy'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueLazyLoad, {
    loading: '/assets/logo.png',
    error: '/assets/logo.png'
  })
})
