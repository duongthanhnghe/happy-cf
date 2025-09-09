import { watch } from "vue"
import { generateSlug } from "@/utils/global"

interface SeoFields {
  titleSEO?: string
  slug?: string
}

interface SeoWatcherOptions<T> {
  sourceKey: keyof T    // title, categoryName…
  autoTitleSEO?: boolean
  autoSlug?: boolean
}

export function useSeoWatchers<T extends SeoFields & Record<string, any>>(
  item: T,
  options: SeoWatcherOptions<T>
) {
  const { sourceKey, autoTitleSEO = true, autoSlug = true } = options

  // khi thay đổi source field → cập nhật SEO
  watch(
    () => item[sourceKey],
    (newValue: string, oldValue: string) => {
      if (!newValue) return

      if (autoTitleSEO && (!item.titleSEO || item.titleSEO === oldValue)) {
        item.titleSEO = newValue
      }

      if (autoSlug && (!item.slug || item.slug === generateSlug(oldValue))) {
        item.slug = generateSlug(newValue)
      }
    }
  )

  // khi người dùng gõ slug thủ công → chuẩn hóa
  // if (autoSlug) {
    watch(() => item.slug, (newValue: string | undefined) => {
        if (!newValue) return
        const normalized = generateSlug(newValue)
        if (normalized !== newValue) {
          item.slug = normalized
        }
      }
    )
  // }
}
