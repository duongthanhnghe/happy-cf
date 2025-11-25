import { defineNuxtPlugin } from '#app'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default defineNuxtPlugin((nuxtApp) => {
  NProgress.configure({
    showSpinner: false,
    speed: 700,
    trickleSpeed: 200,
  })

  const router = nuxtApp.$router

  router.beforeEach(() => {
    NProgress.start()
  })

  router.afterEach(() => {
    NProgress.done()
  })
})
