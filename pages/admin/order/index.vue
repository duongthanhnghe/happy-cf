<script lang="ts" setup>
import { ref } from "vue";
import {
  useOrderManageStore
} from '@/stores/admin/order/useOrderManageStore'
import {
  useOrderHistoryStore
} from '@/stores/client/order/useOrderHistoryStore'
import {
  formatCurrency, formatDateTime
} from '@/utils/global'
import { ROUTES } from '@/shared/constants/routes';
import { ORDER_STATUS } from "@/shared/constants/order-status";
import { PAYMENT_TRANSACTION_STATUS } from "@/shared/constants/payment-transaction-status";
import {
  useUserManageStore
} from '@/stores/admin/users/useUserManageStore'

definePageMeta({
  layout: ROUTES.ADMIN.ORDER.layout,
  middleware: ROUTES.ADMIN.ORDER.middleware,
})

const store = useOrderManageStore();
const storeHistory = useOrderHistoryStore();
const storeUser = useUserManageStore();
const idOrder = ref<string>('')

const handleDetailPopup = (id:string) => {
  storeHistory.handleTogglePopupDetail(true, id)
  idOrder.value = id
}

</script>
<template>

<HeaderAdmin>
  <template #left>
    <v-text-field v-model="store.idOrder"  placeholder="Ma don hang..." hide-details></v-text-field>
    <!-- <v-text-field v-model="store.name"  placeholder="Tên nguoi dat..." hide-details></v-text-field> -->
    <v-text-field v-model="store.phone" type="number"  placeholder="So dien thoai..." hide-details></v-text-field>
    <v-select label="Tinh trang" v-model="store.filterStatusOrder" :items="[{ id: '', name: 'Tất cả' }, ...store.getListStatus]" item-title="name" item-value="id" hide-details />
    <v-select label="Thanh toan" v-model="store.filterStatusTransactionOrder" :items="[{ status: '', name: 'Tất cả' }, ...Object.values(PAYMENT_TRANSACTION_STATUS)
]" item-title="name" item-value="status" hide-details />
    <DateFilter v-model:fromDay="store.fromDay" v-model:toDay="store.toDay" />
    <Button v-if="store.hasFilter" color="black" size="md" icon="filter_alt_off" @click="store.resetFilter()" />
  </template>
</HeaderAdmin>

<PopupOrderDetail :idOrder="idOrder" />
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
    item-value="name"
    :items-per-page-options="[20, 50, 100, 200, { title: 'Tất cả', value: -1 }]"
    @update:options="options => {
        store.currentTableOptions = options
    }">
    <template #item.index="{ index }">
      {{ (store.currentTableOptions.page - 1) * store.currentTableOptions.itemsPerPage + index + 1 }}
    </template>

    <template #item.totalPrice="{ item }">
      {{ formatCurrency(item.totalPrice) }}
    </template>

    <template #item.fullname="{ item }">
      <div class="min-width-200 flex gap-sm align-center white-space">
        <Button v-if="item.userId" color="gray" size="sm" icon="person" @click="storeUser.handleEdit(item.userId)" />
        <div>
          <span class="text-limit">{{ item.fullname }}</span>
          <span class="text-limit text-color-gray5">{{ item.phone }}</span>
        </div>
      </div>
    </template>

    <template #item.time="{ item }">
      <v-chip label color="blue">
        {{ item.time }}
      </v-chip>
    </template>

    <template #item.createdAt="{ item }">
      {{ formatDateTime(item.createdAt) }}
    </template>

    <template #item.status="{ item: order }">
      <v-chip :color="order.status.status" label>
        {{ order.status.name }}
        <template v-if="order.status.id !== ORDER_STATUS.CANCELLED && order.status.id !== ORDER_STATUS.COMPLETED">
          <MaterialIcon  name="keyboard_arrow_down" />
        </template>
      </v-chip>
      <template v-if="order.status.id !== ORDER_STATUS.CANCELLED && order.status.id !== ORDER_STATUS.COMPLETED">
        <v-menu transition="slide-x-transition" activator="parent">
          <v-list>
            <v-list-item
              v-for="statusItem in store.getListStatus"
              :key="statusItem.id"
              @click.prevent="store.handleUpdateStatusOrder(order.id, statusItem.id, statusItem.name, order.transaction?.id, order.totalPrice, order.paymentId.method)"
              :class="{ active: statusItem.index == order.status.index }"
            >
              <v-list-item-title>
                <div class="flex align-center gap-sm">
                  <MaterialIcon v-if="statusItem.icon" :size="24" :name="statusItem.icon" />
                  {{ statusItem.name }}
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </template>

    <template #item.paymentId="{ item }">
      <v-chip label>
        <img width="20" :src="item.paymentId.image" :alt="item.paymentId.name" style="margin-right:5px" />
        {{ item.paymentId.name }}
      </v-chip>
    </template>

    <template #item.transaction="{ item }">
      <v-chip v-if="item.transaction" label :color="item.transaction?.statusColor">
        {{ item.transaction?.statusText }}
        <MaterialIcon name="keyboard_arrow_down" />
      </v-chip>
      <template v-if="PAYMENT_TRANSACTION_STATUS && item.transaction">
        <v-menu transition="slide-x-transition" activator="parent">
          <v-list>
            <v-list-item
              v-for="statusItem in PAYMENT_TRANSACTION_STATUS"
              :key="statusItem.status"
              :class="{ active: statusItem.status == item.transaction?.status }"
              @click.prevent="store.handleUpdateStatusTransactionOrder(item.transaction?.id, statusItem.status)"
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
      <div class=" flex gap-xs justify-end">
        <Button :border="false" color="secondary" size="sm" icon="visibility" @click="handleDetailPopup(item.id)" />
        <Button :border="false" color="secondary" size="sm" icon="delete" @click="store.handleDelete(item.id)" />
      </div>
    </template>
  </v-data-table-server>
</v-container>
</template>
