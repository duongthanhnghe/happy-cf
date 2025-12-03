<script lang="ts" setup>
import { ref, watch } from "vue"
import { ROUTES } from '@/shared/constants/routes'
import { useCategoryList } from "@/composables/news/useCategoryList"
import { useMainStore } from "@/stores/client/news/useMainStore"
import { COLUMN } from "@/shared/constants/column"

definePageMeta({
  middleware: ROUTES.PUBLIC.NEWS.children?.MAIN.middleware || '',
})

const { getListCategory } = useCategoryList()

const store = useMainStore()
const valueChangePage = ref<boolean|null>(null)

watch(valueChangePage, (newVal) => {
  if(newVal !== null) store.handleChangePage(newVal)
  valueChangePage.value = null
})

</script>

<template>
  <NewsBreadcrumb :list="getListCategory"/>
  
  <div class="container pt-section pb-section">
    <LoadingData v-if="store.loading && !store.getListItems"/>
    <div v-else-if="store.getListItems && store.getListItems.length > 0" :class="COLUMN.ROW">
      <div v-for="(item, index) in store.getListItems" :class="index === 0 ? 'col-12 mb-md' : COLUMN.NEWS">
        <NewsItemTemplate2 :item="item" :listView="index === 0 ? true:false" />
      </div>
    </div>
    <NoData v-else/>

    <template v-if="store.getTotalPages && store.getTotalPages.length > 1">
      <div class="flex gap-sm justify-end">
        <Pagination :totalPages="store.getTotalPages" v-model:page="store.page" v-model:valueChangePage="valueChangePage" />
      </div>
    </template>
  </div>
</template>
