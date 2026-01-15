<script lang="ts" setup>
import { formatDateTime } from '@/utils/global'
import { useRewardHistoryStore } from '@/stores/admin/users/useRewardHistoryStore'
import { ROUTES } from '@/shared/constants/routes';
import { REWARD_HISTORY_TYPE } from '@/shared/constants/history-reward-type'
import { useAdminUserDetailStore } from '@/stores/admin/users/useUserDetailStore';
import { onBeforeUnmount } from 'vue';
import { useAdminOrderDetailStore } from '@/stores/admin/order/useOrderDetailStore';

definePageMeta({
  layout: ROUTES.ADMIN.USER.children?.CUSTOMER.layout,
  middleware: ROUTES.ADMIN.USER.children?.CUSTOMER.middleware,
})

const store = useRewardHistoryStore();
const storeDetailUser = useAdminUserDetailStore();
const storeDetailOrder = useAdminOrderDetailStore()

onBeforeUnmount(() => {
  store.resetFilter()
})
</script>
<template>
 
<HeaderAdmin>
  <template #left>
    <v-text-field v-model="store.search" density="compact" placeholder="Tìm kiếm tên, email, sdt..." variant="outlined" hide-details></v-text-field>
    <v-select
      label="Loại lịch sử"
      v-model="store.filterTypeReward"
      :items="[
        { type: null, name: 'Tất cả', color: 'grey' },
        ...Object.values(REWARD_HISTORY_TYPE)
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
  <v-data-table-server class="category-table elevation-0"
    v-model:page="store.currentTableOptions.page"
    v-model:items-per-page="store.currentTableOptions.itemsPerPage"
    :headers="store.headers"
    :items="store.serverItems"
    :items-length="store.totalItems"
    :loading="store.loadingTable"
    :search="store.search"
    item-value="name"
    :items-per-page-options="[20, 50, 100, 200]"
    @update:options="options => {
        store.currentTableOptions = options
    }">
    
    <template #item.code="{ item }">
      <div class="flex gap-sm align-center">
        <Button color="gray" size="sm" icon="visibility" @click="storeDetailOrder.handleTogglePopupDetail(true,item.orderId)" />
        {{ item.code }}
      </div>
    </template>

    <template #item.user="{ item }">
      <div v-if="item.user" class="min-width-200 flex gap-sm align-center white-space">
        <Button color="gray" size="sm" icon="person" @click="storeDetailUser.handleTogglePopup(true,item.user.id)" />
        <div>
          <span class="text-limit">{{ item.user.fullname }}</span>
          <span class="text-limit text-color-gray5">{{ item.user.phone }}</span>
        </div>
      </div>
    </template>

    <template #item.historyType="{ item }">
      <v-chip label :color="REWARD_HISTORY_TYPE[item.historyType]?.color || 'grey'"> {{ REWARD_HISTORY_TYPE[item.historyType]?.name || '' }} </v-chip>
    </template>

    <template #item.points="{ item }">
      <v-chip label>
      {{ item.historyType === REWARD_HISTORY_TYPE.used.type ? '-':'+'  }} {{ item.points }}
      </v-chip>
    </template>

    <template #item.createdAt="{ item }">
      {{formatDateTime(item.createdAt)}}
    </template>
    
  </v-data-table-server>
</v-container>
</template>