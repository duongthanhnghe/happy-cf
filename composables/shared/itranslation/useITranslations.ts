import { useNuxtApp } from '#app'
import { translationTypeMap } from "@/utils/translationTypeMap"

export function useITranslations() {
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n

  const t = (key: string, params?: Record<string, any>) => {
    const text = i18n.t(key, params) as string
    const type = translationTypeMap[key] || "text"

    return { text, type, key }
  }

  const locale = () => i18n.locale.value

  const setLocale = (newLocale: string) => {
    if (newLocale !== "vi" && newLocale !== "en") return
    
    i18n.locale.value = newLocale
    
    localStorage.setItem("NUXT-LOCALE", newLocale)
  }

  return {
    t,
    locale,
    setLocale,
    i18n,
  }
}