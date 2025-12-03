<script lang="ts" setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const searchValue = ref("")

const onChangeSearch = () => {
  const value = searchValue.value.trim()
  if (!value) return

  router.push({
    path: "/blog/search",
    query: { search: value }
  })
}
</script>

<template>
  <v-text-field
    v-model="searchValue"
    label="Tìm kiếm bài viết..."
    variant="outlined"
    prepend-inner-icon="mdi-magnify"
    @keydown.enter="onChangeSearch"
    clearable
    required
    hide-details
    >
  </v-text-field>
</template>
