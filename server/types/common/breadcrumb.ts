import type { MenuItem } from "./menu-item"

export interface BreadcrumbConfig {
  base?: MenuItem[]
  parents?: MenuItem[]
  current: {
    label: string
    path?: string
  }
}