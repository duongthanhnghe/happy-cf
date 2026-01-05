<script lang="ts" setup>
import { ref, watch } from "vue"
import { ROUTES } from '@/shared/constants/routes'
import { useCategoryMainStore } from '@/stores/client/news/useCategoryMainStore'
import { useCategoryList } from "@/composables/news/useCategoryList"
import { COLUMN } from "@/shared/constants/column"
import { useRoute } from 'vue-router'
import { useNewsCategoryDetail } from "@/composables/news/useNewsCategoryDetail"
import { useCategoryNewsSEO } from "@/composables/seo/useCategoryNewsSEO"

definePageMeta({
  middleware: ROUTES.PUBLIC.NEWS.children?.CATEGORY.middleware || '',
})

const storeCategoryMain = useCategoryMainStore()

const { fetchDetailNewsCategorySlug, getDetailNewsCategoryApi } = useNewsCategoryDetail()
const { getListCategory, fetchCategoryList } = useCategoryList()
const { setCategoryNewsSEO } = useCategoryNewsSEO()

const route = useRoute()
const slug = route.params.categorySlug as string
const valueChangePage = ref<boolean|null>(null)

const { data, error } = await useAsyncData(
  `post-category-detail-${slug}`,
  async () => {
    const res = await fetchDetailNewsCategorySlug(slug)
    if (res?.data?.id) {
      setCategoryNewsSEO(res.data, ROUTES.PUBLIC.NEWS.children?.MAIN.path || '')

      await storeCategoryMain.fetchInit(res?.data?.id)

      if(!getListCategory.value || getListCategory.value.length === 0) await fetchCategoryList()
    }
    return res
  }
)

const detail = getDetailNewsCategoryApi

watch(valueChangePage, (newVal) => {
  if(newVal !== null) storeCategoryMain.handleChangePage(newVal)
  valueChangePage.value = null
})

</script>

<template>
  <NewsBreadcrumb :list="getListCategory" :headingCategory="detail?.categoryName"/>

  <div class="container pt-section pb-section">
    <LoadingData v-if="storeCategoryMain.loadingListPost && !storeCategoryMain.getListItems"/>
    <div v-else-if="storeCategoryMain.getListItems && storeCategoryMain.getListItems.length > 0" :class="COLUMN.ROW">
      <div v-for="(item, index) in storeCategoryMain.getListItems" :class="index === 0 ? 'col-12 mb-md' : COLUMN.NEWS">
        <NewsItemTemplate2 :item="item" :listView="index === 0 ? true:false" />
      </div>
    </div>
    <NoData v-else/>
  
    <template v-if="storeCategoryMain.getTotalPages && storeCategoryMain.getTotalPages.length > 1">
      <div class="flex gap-sm justify-end">
        <Pagination :totalPages="storeCategoryMain.getTotalPages" v-model:page="storeCategoryMain.page" v-model:valueChangePage="valueChangePage" />
      </div>
    </template>
  </div>
</template>
