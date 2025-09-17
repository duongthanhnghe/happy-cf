declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare global {
  const useCookie: typeof import('#app')['useCookie']
  const useAsyncData: typeof import('#app')['useAsyncData']
  const useLazyAsyncData: typeof import('#app')['useLazyAsyncData']
  const useNuxtData: typeof import('#app')['useNuxtData']
  const refreshNuxtData: typeof import('#app')['refreshNuxtData']
  const clearNuxtData: typeof import('#app')['clearNuxtData']
}
export {}