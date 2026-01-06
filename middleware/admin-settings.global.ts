import { useBaseInformationStore } from '@/stores/admin/setting/useBaseInformationStore'
import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  if (to.path.startsWith('/admin')) {
    const storeSetting = useBaseInformationStore()

    if (!storeSetting.detailData) {
      await storeSetting.fetchBaseInformation(true)
    }
  }
})
