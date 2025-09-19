// middleware/settings.global.ts
import { useSettingStore } from '@/stores/shared/setting/useSettingStore'

export default defineNuxtRouteMiddleware(async () => {
  const storeSetting = useSettingStore()

  if (!storeSetting.detailData) {
    await storeSetting.fetchSetting(true)
  }
})
