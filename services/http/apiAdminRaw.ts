import { useRuntimeConfig } from "#app"

export const apiAdminRaw = (path: string) => {
  const config = useRuntimeConfig()
  return `${config.public.apiAdminBase}${path}`
}
