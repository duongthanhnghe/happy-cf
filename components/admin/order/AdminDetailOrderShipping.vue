<script lang="ts" setup>
import { useOrderManageStore } from '@/stores/admin/order/useOrderManageStore';
import { computed } from 'vue';
import { formatDateTime, formatCurrency, copyText } from '@/utils/global';
import { SHIPPING_STATUS } from '@/shared/constants/shipping-status';

const store = useOrderManageStore();

const infoItems = computed(() => [
  { label: 'Mã vận đơn', value: store.detailShipping?.trackingCode, icon: 'box' },
  { label: 'Phí vận chuyển', value: store.detailShipping?.shippingFee ? formatCurrency(store.detailShipping?.shippingFee):0, icon: 'attach_money' },
  { label: 'Thời gian gửi hàng', value: formatDateTime(store.detailShipping?.shippedAt), icon: 'calendar_today' },
  { label: 'Thời gian giao hàng', value: formatDateTime(store.detailShipping?.deliveredAt), icon: 'local_shipping' },
  { label: 'Đơn vị', value: store.detailShipping?.provider?.name, icon: 'email', image: store.detailShipping?.provider?.logo },
])

</script>
<template>
  <Popup
    v-model="store.isTogglePopupDetailShipping"
    :popupHeading="'Vận đơn: '+store.detailShipping?.trackingCode"
    bodyClass="bg-gray6"
    align="right"
  >
    <template #header>
      <Button color="secondary" icon="content_copy" @click="copyText(store.detailShipping?.trackingCode)" />
    </template>
    <template #body>
      <Text :text="store.detailShipping?.trackingCode" color="black" weight="semibold" size="xl" class="text-center" />
      <Card size="sm" heading="Thông tin" class="rd-lg mt-ms">
        <div v-for="(item, index) in infoItems" :key="index" class="mb-ms">
          <div class="flex gap-sm align-center">
            <Button v-if="!item.image" tag="span" :icon="item.icon" color="secondary" class="rd-xs" />
            <Button v-else tag="span" color="secondary" class="rd-xs">
              <img :src="item.image" :alt="item.label" width="40" />
            </Button>
            <div>
              <Text :text="item.label" color="gray5" />
              <Text :text="item.value" color="black" size="normal" />
            </div>
          </div>
        </div>
        <div class="flex align-center gap-xs">
          Trạng thái vận chuyển: 
          <v-chip v-if="store.detailShipping?.status" :color="SHIPPING_STATUS[store.detailShipping?.status].color" >{{SHIPPING_STATUS[store.detailShipping?.status].name}}</v-chip>
        </div>
      </Card>
      <Card size="sm" heading="Lịch sử tình trạng" class="rd-lg mt-ms">
        <div v-for="(item, index) in store.detailShipping?.logs" :key="index" class="bg-gray6 rd-md pd-ms mb-sm">
          <div class="flex gap-sm justify-between align-center">
            <v-chip v-if="item.status" :color="SHIPPING_STATUS[item.status].color" >{{SHIPPING_STATUS[item.status].name}}</v-chip>
            <Text :text="formatDateTime(item.time)" color="gray5" />
          </div>
        </div>
      </Card>
    </template>
  </Popup>
</template>
