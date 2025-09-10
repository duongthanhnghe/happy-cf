

  import type { Ref } from 'vue'
  import { computed } from "vue" 
  
  export function usePagination(page: Ref<string>, totalPages: Ref<number | undefined>) {

    const handleChangePage = (next = false) => {
      const currentPage = Number(page.value)
      if(next) {
        page.value = String(currentPage + 1)
      } else {
        page.value = String(currentPage - 1)
      }
    }

    const getTotalPages = computed(() => {
      if(!totalPages.value) return []
      return Array.from({ length: totalPages.value }, (_, i) => String(i + 1));
    });

    return {
      handleChangePage,
      getTotalPages,
    }
  }