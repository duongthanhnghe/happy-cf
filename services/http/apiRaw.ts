import { useRuntimeConfig } from "#app"

export const apiRaw = (path: string) => {
  const config = useRuntimeConfig()
  return `${config.public.apiAdminBase}${path}`
}
