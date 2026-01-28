<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useVoucherUsageManageStore } from '@/stores/admin/voucher/useVoucherUsageManageStore';
import { ROUTES } from '@/shared/constants/routes';
import { formatDateTime, formatCurrency, copyText } from '@/utils/global';
import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';
import { useAdminUserDetailStore } from "@/stores/admin/users/useUserDetailStore";
import { useAdminOrderDetailStore } from "@/stores/admin/order/useOrderDetailStore";

definePageMeta({
  layout: ROUTES.ADMIN.VOUCHER.children?.USAGE.layout,
  middleware: ROUTES.ADMIN.VOUCHER.children?.USAGE.middleware,
});

const store = useVoucherUsageManageStore();
const storeDetailOrder = useAdminOrderDetailStore()
const storeDetailUser = useAdminUserDetailStore();

onBeforeUnmount(() => {
  store.resetFilter()
})
</script>

<template>
  <HeaderAdmin>
    <template #left>
      <v-text-field v-model="store.searchInput" placeholder="Tìm mã..." variant="outlined" hide-details clearable
      @keyup.enter="store.handleSearch"
        @click:clear="store.handleSearch(false)"></v-text-field>
      <v-select
        v-model="store.filterType"
        label="Loại voucher"
        :items="[
          { type: null, name: 'Tất cả', color: 'grey' },
          ...Object.values(VOUCHER_TYPE)
        ]"
        :item-title="item => item.name"
        item-value="type"
        variant="outlined"
        hide-details
      />
    <DateFilter v-model:fromDay="store.fromDay" v-model:toDay="store.toDay" />
    <Button v-if="store.hasFilter" color="black" size="md" icon="filter_alt_off" @click="store.resetFilter()" />

    </template>
  </HeaderAdmin>

  <AdminPopupOrderDetail />
  <DetailAccount />

  <v-container>
    <v-data-table-server class="elevation-0"
      v-model:items-per-page="store.itemsPerPage"
      :headers="store.headers"
      :items="store.serverItems"
      :items-length="store.totalItems"
      :loading="store.loadingTable"
      :search="store.search"
      item-value="code"
      :items-per-page-options="[20, 50, 100, 200]"
      @update:options="options => {
        store.currentTableOptions = options;
      }">

      <template #item.index="{ index }">
        {{ index + 1 }}
      </template>

      <template #item.code="{ item }">
        <div class="flex align-center gap-xs">
        <Button :border="false" color="secondary" size="xs" icon="content_copy" @click="copyText(item.code)" />
        {{ item.code }}
        </div>
      </template>

      <template #item.type="{ item }">
        <v-chip :color="VOUCHER_TYPE[item.type]?.color || 'grey'" label>
          {{ VOUCHER_TYPE[item.type]?.name || item.type }}
        </v-chip>
      </template>

      <template #item.discount="{ item }">
        {{ formatCurrency(item.discount) }}
      </template>

      <template #item.userId="{ item }">
        <div class="min-width-200 flex gap-sm align-center white-space">
          <Button v-if="item.userId" color="gray" size="sm" icon="person" @click="storeDetailUser.handleTogglePopup(true,item.userId._id)" />
          <div>
            <span class="text-limit">{{ item.userId.fullname }}</span>
            <span class="text-limit text-color-gray5">{{ item.userId.phone }}</span>
          </div>
        </div>
      </template>

      <template #item.orderId="{ item }">
        <div class="flex gap-sm align-center cursor-pointer white-space" @click="storeDetailOrder.handleTogglePopupDetail(true,item.orderId._id.toString())">
          <Button color="gray" size="sm" class="white-space" icon="visibility" v-tooltip="'Xem chi tiết đơn hàng'" />
          Chi tiết
        </div>
      </template>

      <template #item.stackable="{ item }">
        <v-chip class="w-full justify-center" :color="item.stackable ? 'green' : 'red'" label>
          {{ item.stackable ? 'Cho phép' : 'Không cho phép' }}
        </v-chip>
      </template>

      <template #item.usedAt="{ item }">
        {{ formatDateTime(item.usedAt,'vi-VN') }}
      </template>

      <template #item.reverted="{ item }">
        <div class="flex gap-sm align-center white-space">
        <v-chip v-if="item.reverted" :color="item.reverted ? 'orange' : 'grey'" label>
          {{ item.reverted ? 'Đã hoàn' : '' }}
        </v-chip>
        {{ formatDateTime(item.revertedAt,'vi-VN') }}
        </div>
      </template>

      <template #item.createdAt="{ item }">
        {{ formatDateTime(item.createdAt,'vi-VN') }}
      </template>

      <template #item.updatedAt="{ item }">
        {{ formatDateTime(item.updatedAt,'vi-VN') }}
      </template>
    </v-data-table-server>
  </v-container>
</template>
