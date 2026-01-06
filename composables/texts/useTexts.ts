import { computed } from 'vue'
import { useITranslations } from '@/composables/shared/itranslation/useITranslations'

export function useTexts<T extends readonly string[]>(keys: T) {
  const { t, locale } = useITranslations()

  const texts = computed(() => {
    locale()

    const result = {} as Record<T[number], ReturnType<typeof t>>

    keys.forEach((key) => {
      result[key] = t(key)
    })

    return result
  })

  return texts
}
