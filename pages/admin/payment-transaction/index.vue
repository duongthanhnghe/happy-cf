<script lang="ts" setup>
import { formatCurrency, formatDateTime } from '@/utils/global'
import { ROUTES } from '@/shared/constants/routes';
import { onBeforeUnmount, onMounted } from 'vue';
import { usePaymentTransactionManageStore } from '@/stores/admin/payment-tracsaction/usePaymentTransactionManageStore';
import { usePaymentMethod } from '@/composables/admin/order/usePaymentMethod';
import { PAYMENT_TRANSACTION_STATUS } from '@/shared/constants/payment-transaction-status';

definePageMeta({
  layout: ROUTES.ADMIN.ORDER.children?.LIST.layout,
  middleware: ROUTES.ADMIN.ORDER.children?.LIST.middleware,
})

const store = usePaymentTransactionManageStore()
const { getListPayment, fetchPaymentMethod } = usePaymentMethod()

onMounted(async () => {
  if(!getListPayment.value || getListPayment.value.length === 0) await fetchPaymentMethod()
})

onBeforeUnmount(() => {
  store.resetFilter()
})
</script>
<template>

<HeaderAdmin>
  <template #left>
    <v-text-field v-model="store.searchInput" placeholder="Tìm theo mã, đơn hàng..." variant="outlined" hide-details clearable
      @keyup.enter="store.handleSearch"
      @click:clear="store.handleSearch(false)"
    ></v-text-field>
    <v-select label="Tinh trang" v-model="store.filterStatus" :items="[{ status: '', name: 'TT thanh toán' }, ...Object.values(PAYMENT_TRANSACTION_STATUS)]" item-title="name" item-value="status" variant="outlined" hide-details />
    <v-select label="Thanh toan" v-model="store.filterPaymentMethod" :items="[{ status: '', name: 'PT thanh toán' }, ...getListPayment
]" item-title="name" item-value="status" variant="outlined" hide-details />
    <DateFilter v-model:fromDay="store.fromDay" v-model:toDay="store.toDay" />
    <Button v-if="store.hasFilter" color="black" size="md" icon="filter_alt_off" @click="store.resetFilter()" />
  </template>
</HeaderAdmin>

<AdminPopupTransactionDetail />

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
    :items-per-page-options="[20, 50, 100, 200]"
    @update:options="options => {
      store.currentTableOptions = options
    }">
    <template #item.index="{ index }">
      {{ (store.currentTableOptions.page - 1) * store.currentTableOptions.itemsPerPage + index + 1 }}
    </template>

    <template #item.orderId="{ item }">
      {{ item.orderId }}
      <Text :text="'Code: '+item.orderCode" color="gray5" />
    </template>
    
    <template #item.amount="{ item }">
      {{ formatCurrency(item.amount) }}
    </template>

    <template #item.createdAt="{ item }">
      {{ formatDateTime(item.createdAt) }}
    </template>

    <template #item.paidAt="{ item }">
      <template v-if="item.paidAt">
        {{ formatDateTime(item.paidAt) }}
      </template>
    </template>

    <template #item.method="{ item }">
      <v-chip label >
        {{ item.method }}
      </v-chip>
    </template>

    <template #item.status="{ item }">
      <v-chip label :color="item.statusColor">
        {{ item.statusText }}
      </v-chip>
    </template>

    <template #item.actions="{ item }">
      <div class=" flex gap-xs justify-end">
        <Button :border="false" color="secondary" size="sm" icon="visibility" @click="store.handleTogglePopupDetail(item.id)" />
      </div>
    </template>
  </v-data-table-server>
</v-container>
</template>
