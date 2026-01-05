import { useState } from "nuxt/app"

export const useSeoTitle = () => {
  return useState<string | null>('seo-title', () => null)
}
