import { defineNuxtPlugin } from '#app'
import { Cloudinary } from '@cloudinary/url-gen'

export default defineNuxtPlugin(() => {
  const cloudinary = new Cloudinary({
    cloud: {
      cloudName: useRuntimeConfig().public.cloudinaryCloudName
    }
  })

  return {
    provide: {
      cloudinary
    }
  }
})