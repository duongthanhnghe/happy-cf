import { apiConfig } from '@/config/api.config'
import { computed, ref } from 'vue'
export const useUploadImage = () => {

  const urlUploadImage = ref<string>('')

  const uploadImage = async (file: File, endPoint: string) => {
    try {
      if (!file) return null
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${apiConfig.baseApiURL}${endPoint}`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload file')
      }

      const data = await response.json()
      urlUploadImage.value = data.url
      console.log('File uploaded successfully:', data.url)
      return data
    } catch (err) {
      console.error('Error uploading file:', err)
      throw err
    }
  }

  const getUrlUpLoadedImage = computed(() => urlUploadImage.value);

  return { uploadImage, getUrlUpLoadedImage }
}
