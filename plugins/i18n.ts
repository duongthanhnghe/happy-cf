import { createI18n } from "vue-i18n"
import { defineNuxtPlugin } from "#app"
import { translationTypeMap } from "@/utils/translationTypeMap"
import { useAdminITranslationAll } from "@/composables/admin/itranslation/useAdminITranslationAll";

export default defineNuxtPlugin(async (nuxtApp) => {
  const { getListITranslation, fetchListITranslationAll } = useAdminITranslationAll()
  await fetchListITranslationAll(1,9999,'')

  const vi: Record<string, string> = {}
  const en: Record<string, string> = {}

  if (getListITranslation.value?.data) {
    getListITranslation.value.data.forEach((item: any) => {

      translationTypeMap[item.key] = item.type

      vi[item.key] = item.translations.vi || ""
      en[item.key] = item.translations.en || ""
    })
  }

  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: "vi",
    warnHtmlMessage: false,
    messages: { vi, en }
  })

  if (process.client) {
    const savedLocale = localStorage.getItem("NUXT-LOCALE")
    if (savedLocale === "vi" || savedLocale === "en") {
      i18n.global.locale.value = savedLocale
    }

    if (!savedLocale) {
      localStorage.setItem("NUXT-LOCALE", "vi")
    }
  }

  nuxtApp.vueApp.use(i18n)
  nuxtApp.provide("i18n", i18n.global)
})