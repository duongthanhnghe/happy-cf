<script setup lang="ts">
import '@/styles/molecules/voucher/voucher-item2.scss'
import type { VoucherAvailableDTO } from "@/server/types/dto/v1/voucher.dto";
import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';
import { formatCurrency } from '@/utils/global';
import { useVoucherUtils } from '@/composables/voucher/useVoucherUtils';

const props = defineProps<{
  item: VoucherAvailableDTO;
}>();

const { isDiscountVoucherType } = useVoucherUtils()

</script>

<template>
  <div :class="['voucher-item2 rd-md bg-third pd-sm weight-semibold', item.type === VOUCHER_TYPE.freeship.type ? 'bg-freeship':'']">
    <div :class="['pr-xs pl-xs', item.type === VOUCHER_TYPE.freeship.type ? 'text-color-freeship':'text-color-primary']">
      <template v-if="isDiscountVoucherType(item.type)">
        Giảm {{ props.item.value }}%
      </template>
      <template v-else-if="item.type === VOUCHER_TYPE.freeship.type">
        Giảm {{ formatCurrency(props.item.maxShippingDiscount) }}
      </template>
      <template v-else>
        Giảm {{ formatCurrency(props.item.value) }}
      </template>
    </div>
  </div>
</template>