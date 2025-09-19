import { ref } from "vue"
import { defineStore } from "pinia"

export const useFileSelectContextStore = defineStore("FileSelectContext", () => {
  const context = ref<string | null>(null)

  function setContext(value: string | null) {
    context.value = value
  }

  return {
    context,
    setContext
  }
})
