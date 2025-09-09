<script lang="ts" setup>
import { useNewsCategoryDetail } from '@/composables/news/useNewsCategoryDetail'
import { ROUTES } from '@/shared/constants/routes'

definePageMeta({
  middleware: ROUTES.PUBLIC.NEWS.children?.CATEGORY.middleware || [],
})

const { getDetailNewsCategoryApi } = useNewsCategoryDetail()
const category = getDetailNewsCategoryApi

</script>

<template>
  <div v-if="category">
    <h1>{{ category.categoryName }}</h1>
    <p>{{ category.description }}</p>
  </div>
</template>
