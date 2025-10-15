declare module '*.scss';
declare module '*.css';

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.webp';
declare module '*.gif';

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare global {
  const useCookie: typeof import('#app')['useCookie'];
  const useAsyncData: typeof import('#app')['useAsyncData'];
  const useLazyAsyncData: typeof import('#app')['useLazyAsyncData'];
  const useNuxtData: typeof import('#app')['useNuxtData'];
  const refreshNuxtData: typeof import('#app')['refreshNuxtData'];
  const clearNuxtData: typeof import('#app')['clearNuxtData'];
}

export {};
