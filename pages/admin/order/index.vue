<script lang="ts" setup>
import { ref } from "vue";
import {
  useOrderManageStore
} from '@/stores/order/useOrderManageStore'
import {
  useOrderHistoryStore
} from '@/stores/order/useOrderHistoryStore'
import {
  formatCurrency
} from '@/utils/global'

definePageMeta({
  layout: 'admin-layout',
  middleware: 'admin-role',
})

const store = useOrderManageStore();
const storeHistory = useOrderHistoryStore();
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
    <v-text-field v-model="store.name"  placeholder="Tên nguoi dat..." hide-details></v-text-field>
    <v-text-field v-model="store.phone" type="number"  placeholder="So dien thoai..." hide-details></v-text-field>
    <v-text-field v-model="store.fromDay" type="datetime-local"  hide-details></v-text-field>
    <v-select label="Chon tinh trang" v-model="store.filterStatusOrder" :items="[{ id: null, name: 'Tất cả' }, ...store.getListStatus]" item-title="name" item-value="id" hide-details />
  </template>
</HeaderAdmin>

<PopupOrderDetail :idOrder="idOrder" />

<v-container>
  <v-data-table-server v-model:items-per-page="store.itemsPerPage" :headers="store.headers" :items="store.serverItems" :items-length="store.totalItems" :loading="store.loadingTable" :search="store.search" item-value="name" @update:options="options => {
        store.currentTableOptions = options
        store.loadItemsProduct(options)
    }">
    <template #item.index="{ index }">
      {{ (store.currentTableOptions.page - 1) * store.itemsPerPage + index + 1 }}
    </template>

    <template #item.totalPrice="{ item }">
      {{ formatCurrency(item.totalPrice) }}
    </template>

    <template #item.phone="{ item }">
      <v-chip label>
        {{ item.phone }}
      </v-chip>
    </template>

    <template #item.time="{ item }">
      <v-chip label color="blue">
        {{ item.time }}
      </v-chip>
    </template>

    <template #item.status="{ item }">
      <v-chip :color="item.status.status" label>
        {{ item.status.name }}
      </v-chip>
    </template>

    <template #item.paymentId="{ item }">
      <v-chip label>
        <img width="20" :src="item.paymentId.image" :alt="item.paymentId.name" style="margin-right:5px" />
        {{ item.paymentId.name }}
      </v-chip>
    </template>

    <template #item.actions="{ item }">
      <div class="flex gap-sm justify-end">
        <Button color="gray" size="sm" icon="visibility" @click="handleDetailPopup(item.id)" />
        <Button color="gray" size="sm" icon="delete" @click="store.handleDelete(item.id)" />
      </div>
    </template>
  </v-data-table-server>
</v-container>
</template>
