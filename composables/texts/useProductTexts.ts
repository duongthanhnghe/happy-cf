import { useTexts } from "./useTexts"

export const PRODUCT_TEXT_KEYS = [
  'bestseller.desc.main',
] as const

export function useProductTexts() {
  return useTexts(PRODUCT_TEXT_KEYS)
}
