<script lang="ts" setup>
import { ref, watch } from "vue"
import { ROUTES } from '@/shared/constants/routes'
import { useMainStore } from '@/stores/client/news/useMainStore'
import { useRouter } from "vue-router"

definePageMeta({
  middleware: ROUTES.PUBLIC.NEWS.children?.MAIN.middleware || '',
})

const storeMain = useMainStore()

const router = useRouter()
const valueChangePage = ref<boolean|null>(null)
const searchValue = ref("")

watch(valueChangePage, (newVal) => {
  if(newVal !== null) storeMain.handleChangePage(newVal)
  valueChangePage.value = null
})

const onChangeSearch = () => {
  const value = searchValue.value.trim()
  if (!value) return

  router.push({
    path: "search-result",
    query: { search: value }
  })
}
</script>

<template>
  <Breadcrumb :heading="`Tin tuc`" description="123">
    <slot>
      <v-text-field
        v-model="searchValue"
        label="Tim kiem tin..."
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        @keydown.enter="onChangeSearch"
        required>
      </v-text-field>
    </slot>
  </Breadcrumb>
  <div class="container pt-section pb-section">
    <template v-if="storeMain.getListItems">
      <div v-for="item in storeMain.getListItems" :key="item.id">
        <div class="mt-md">
          {{ item.title }}
        </div>
      </div>
    </template>

    <template v-if="storeMain.getTotalPages && storeMain.getTotalPages.length > 1">
      <div class="flex gap-sm justify-end">
        <Pagination :totalPages="storeMain.getTotalPages" v-model:page="storeMain.page" v-model:valueChangePage="valueChangePage" />
      </div>
    </template>
  </div>
</template>
