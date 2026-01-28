<script lang="ts" setup>
import { useProductReviewManageStore } from '@/stores/admin/product-review/useProductReviewManageStore'
import { formatDateTime } from '@/utils/global'
import { ROUTES } from '@/shared/constants/routes';
import { PRODUCT_REVIEW_STATUS, ARRAY_RATING } from '@/shared/constants/product-review-status'
import { onBeforeUnmount } from 'vue';
import { useAdminUserDetailStore } from '@/stores/admin/users/useUserDetailStore';

definePageMeta({
  layout: ROUTES.ADMIN.PRODUCT.children?.REVIEW.layout,
  middleware: ROUTES.ADMIN.PRODUCT.children?.REVIEW.middleware,
})

const store = useProductReviewManageStore();
const storeDetailUser = useAdminUserDetailStore();

onBeforeUnmount(() => {
  store.resetFilter()
})
</script>
<template>

<HeaderAdmin>
  <template #left>
    <v-text-field 
      v-model="store.searchInput" 
      placeholder="Tìm kiếm..." 
      variant="outlined"
      clearable 
      hide-details 
      @keyup.enter="store.handleSearch"
      @click:clear="store.handleSearch(false)"
    >
    </v-text-field>
    <v-select 
      label="Tình trạng" 
      v-model="store.filterStatusOrder" 
      :items="[{ status: '', name: 'Tất cả' }, ...Object.values(PRODUCT_REVIEW_STATUS)]" 
      item-title="name" 
      item-value="status" 
      variant="outlined"
      hide-details />
    <v-select 
      label="Số sao" 
      v-model="store.filterNumberStar" 
      :items="ARRAY_RATING"
      item-title="text"
      item-value="value" 
      hide-details
      variant="outlined"
     />
    <DateFilter v-model:fromDay="store.fromDay" v-model:toDay="store.toDay" />
    <Button v-if="store.hasFilter" color="black" size="md" icon="filter_alt_off" @click="store.resetFilter()" />
  </template>
</HeaderAdmin>

<DetailAccount />

<v-container>
  <v-data-table-server
    v-model:page="store.currentTableOptions.page"
    v-model:items-per-page="store.currentTableOptions.itemsPerPage"
    :headers="store.headers"
    :items="store.serverItems"
    :items-length="store.totalItems"
    :loading="store.loadingTable"
    :search="store.search"
    item-value="search"
    :items-per-page-options="[20, 50, 100, 200, { title: 'Tất cả', value: -1 }]"
    @update:options="options => {
        store.currentTableOptions = options
    }">
    <template #item.index="{ index }">
      {{ (store.currentTableOptions.page - 1) * store.currentTableOptions.itemsPerPage + index + 1 }}
    </template>

    <template #item.userId="{ item }">
      <div class="min-width-200 flex gap-sm align-center white-space">
        <Button v-if="item.userId" color="gray" size="sm" icon="person" @click="storeDetailUser.handleTogglePopup(true,item.userId.id)" />
        <div>
          <span class="text-limit">{{ item.userId.fullname }}</span>
          <span class="text-limit text-color-gray5">{{ item.userId.phone }}</span>
        </div>
      </div>
    </template>

    <template #item.rating="{ item }">
      <span v-if="item.status !== PRODUCT_REVIEW_STATUS.pending.status">{{ item.rating }}</span>
    </template>

    <template #item.createdAt="{ item }">
      {{ formatDateTime(item.createdAt) }}
    </template>

    <template #item.statusText="{ item }">
      <v-chip v-if="item.status" label :color="item.statusColor">
        {{ item.statusText }}
        <MaterialIcon v-if="item.status !== PRODUCT_REVIEW_STATUS.pending.status" name="keyboard_arrow_down" />
      </v-chip>
      <template v-if="item.status !== PRODUCT_REVIEW_STATUS.pending.status">
        <v-menu transition="slide-x-transition" activator="parent">
          <v-list>
            <v-list-item
              v-for="statusItem in Object.values(PRODUCT_REVIEW_STATUS)"
              :key="statusItem.status"
              :class="{ active: statusItem.status == item.status }"
              :disabled="statusItem.status === PRODUCT_REVIEW_STATUS.pending.status"
              @click.prevent="store.handleUpdateStatus(item.id, statusItem.status)"
            >
              <v-list-item-title>
                {{ statusItem.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </template>

    <template #item.actions="{ item }">
      <Button :border="false" color="secondary" size="sm" icon="delete" @click="store.handleDelete(item.id)" />
    </template>
  </v-data-table-server>
</v-container>
</template>
