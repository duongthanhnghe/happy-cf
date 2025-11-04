// middleware/settings.global.ts
import { useBaseInformationStore } from '@/stores/shared/setting/useBaseInformationStore'

export default defineNuxtRouteMiddleware(async () => {
  const storeSetting = useBaseInformationStore()

  if (!storeSetting.detailData) {
    await storeSetting.fetchBaseInformation(true)
  }
})
