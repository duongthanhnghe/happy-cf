import type { Ref } from 'vue'

export function useTableUtils (
  search: Ref<string>,
  searchInput: Ref<string>,
) {

  const handleSearch = (clear = true) => {
    if(clear) search.value = searchInput.value.trim()
    else {
      search.value = ''
      searchInput.value = ''
    }
  }

  return {
    handleSearch,
  }
}
