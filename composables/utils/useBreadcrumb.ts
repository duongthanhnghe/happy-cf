import type { BreadcrumbConfig } from '@/server/types/common/breadcrumb'
import { computed, type MaybeRef, unref } from 'vue'

export function useBreadcrumb(config: {
  base?: MaybeRef<BreadcrumbConfig['base']>
  parents?: MaybeRef<BreadcrumbConfig['parents']>
  current: MaybeRef<BreadcrumbConfig['current']>
}) {
  return computed(() => {
    const base = unref(config.base) ?? [{ label: 'Trang chủ', path: '/' }]
    const parents = unref(config.parents) ?? []
    const current = unref(config.current)

    return [...base, ...parents, current].map((item, index, arr) => ({
      ...item,
      isCurrent: index === arr.length - 1,
    }))
  })
}