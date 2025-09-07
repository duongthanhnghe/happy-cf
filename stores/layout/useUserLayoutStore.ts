  import { defineStore } from 'pinia'
  import { ref } from 'vue'

  export type HeaderTypeLeft = 'name' | 'logo' | 'address'

  export const useLayoutStore = defineStore('Layout', () => {

    const headerTypeLeft = ref<HeaderTypeLeft>('name')

    function setHeaderTypeLeft(type: HeaderTypeLeft) {
      headerTypeLeft.value = type
    }

    return {
      headerTypeLeft,
      setHeaderTypeLeft
    }
  })
