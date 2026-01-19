<script lang="ts" setup>
import { onMounted} from 'vue'
import { ROUTES } from '@/shared/constants/routes';
import { usePaymentMethodStore } from '@/stores/admin/order/usePaymentMethodStore';

definePageMeta({
  layout: ROUTES.ADMIN.ORDER.children?.PAYMENT_METHOD.layout,
  middleware: ROUTES.ADMIN.ORDER.children?.PAYMENT_METHOD.middleware,
})

const store = usePaymentMethodStore();

onMounted( async () => {
  if(store.dataList.length === 0) await store.loadItems()
})

</script>
<template>
  <HeaderAdmin />

  <v-container>
    <v-data-table-server 
      class="v-data-table-no-footer"
      v-model:page="store.page"
      v-model:items-per-page="store.itemsPerPage"
      :headers="store.headers"
      :items="store.serverItems"
      :items-length="store.totalItems"
      :loading="store.loadingTable"
      >

      <template #item.image="{ item }">
        <img :src="item.image" width="80" :alt="item.name" />
      </template>

      <template #item.isActive="{ item }">
        <v-chip label :color="`${item.isActive === true ? 'green' : 'red'}`" v-tooltip.right="'Đổi trạng thái'"  @click="store.toggleActive(item.id)">
          {{ item.isActive === true ? 'Kích hoạt' : 'Tắt kích hoạt' }}
        </v-chip>
      </template>

      <template #bottom />
    </v-data-table-server>
  </v-container>
</template>