<script lang="ts" setup>
import { watch, onBeforeUnmount } from 'vue'
import {
  useProductManageStore
} from '@/stores/admin/product/useProductManageStore'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore';
import {
  formatCurrency
} from '@/utils/global'
import { FOLDER_UPLOAD } from '@/shared/constants/folder-upload';
import { ROUTES } from '@/shared/constants/routes';

definePageMeta({
  layout: ROUTES.ADMIN.PRODUCT.children?.LIST.layout,
  middleware: ROUTES.ADMIN.PRODUCT.children?.LIST.middleware,
})

const store = useProductManageStore();
const storeFileManage = useFileManageFolderStore();
const folderName = FOLDER_UPLOAD.PRODUCT

const openPopupAdd = () => {
  store.handleReset()
  store.handleTogglePopupAdd(true)
}

watch(() => storeFileManage.isTogglePopup, (newValue) => {
  if(newValue && !storeFileManage.getItems) storeFileManage.getApiList(folderName)
}, { immediate: true })

onBeforeUnmount(() => {
  storeFileManage.items = null
})
</script>
<template>

<HeaderAdmin>
  <template #left>
    <v-text-field v-model="store.name" placeholder="Tìm kiếm tên..." variant="outlined" hide-details></v-text-field>
    <v-autocomplete
      label="Chọn danh mục"
      v-model="store.categorySelectedFilter"
      :items="[{ id: '', categoryName: 'Tất cả' }, ...store.getItemsCategory]"
      item-title="categoryName"
      item-value="id"
      hide-details
      clearable
      autocomplete="off" 
      variant="outlined"
    />
  </template>

  <template #right>
    <Button label="Them moi" color="primary" :shadow="true" @click="openPopupAdd()" />
  </template>
</HeaderAdmin>

<CreateProduct />
<UpdateProduct />
<CreateVariantProduct />
<PopupFileManageImage :folderName="folderName" :chooseImage="true" column="col-6 col-md-4"/>

<v-container>
    <v-data-table-server
    v-model:page="store.currentTableOptions.page"
    v-model:items-per-page="store.currentTableOptions.itemsPerPage"
    :headers="store.headers"
    :items="store.serverItems"
    :items-length="store.totalItems"
    :loading="store.loadingTable"
    :search="store.search"
    item-value="name"
    :items-per-page-options="[10, 20, 50, 100, 200, { title: 'Tất cả', value: -1 }]"
    @update:options="options => {
        store.currentTableOptions = options
    }">
    <template #item.index="{ index }">
      {{ (store.currentTableOptions.page - 1) * store.currentTableOptions.itemsPerPage + index + 1 }}
    </template>

    <template #item.image="{ item }">
      <v-img :src="item.image" max-height="60" max-width="60" cover class="rounded" />
    </template>

    <template #item.categoryId="{ item }">
      <v-chip label v-if="item.categoryId">
        {{ store.getCategoryName(item.categoryId)?.categoryName }}
      </v-chip>
    </template>

    <template #item.price="{ item }">
      {{ formatCurrency(item.price) }}
    </template>

    <template #item.priceDiscounts="{ item }">
      {{ formatCurrency(item.priceDiscounts) }}
    </template>

    <template #item.options="{ item }">
      <div v-if="item.options">
        <div v-for="optionItem in item.options" :key="optionItem.id">
        <v-chip label class="mb-sm">
          {{optionItem.name}}
        </v-chip>
        </div>
      </div>
    </template>

    <template #item.isActive="{ item }">
      <v-chip label :color="`${item.isActive === true ? 'green' : 'red'}`" v-tooltip.right="'Doi trang thai'" @click="store.toggleActive(item.id)">
        {{ item.isActive === true ? 'Kich hoat' : 'Tat kich hoat' }}
      </v-chip>
    </template>

    <template #item.actions="{ item }">
      <div class="flex gap-sm justify-end">
        <NuxtLink :to="`${ROUTES.PUBLIC.PRODUCT.children?.DETAIL?.path}/${item.slug}`" target="_blank">
          <Button tag="div" :border="false" color="secondary" size="sm" icon="visibility" />
        </NuxtLink>
        <Button :border="false" color="secondary" size="sm" icon="edit" @click="store.handleEditProduct(item.id)" />
        <Button :border="false" color="secondary" size="sm" icon="delete" @click="store.handleDeleteProduct(item.id)" />
      </div>
    </template>
  </v-data-table-server>
</v-container>
</template>
