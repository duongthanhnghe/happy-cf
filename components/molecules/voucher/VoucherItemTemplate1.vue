<script setup lang="ts">
import '@/styles/molecules/voucher/voucher-item1.scss'
import { computed } from "vue";
import type { VoucherAvailableDTO } from "@/server/types/dto/v1/voucher.dto";
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { showWarning } from "@/utils/toast";
import { formatDateTime} from "@/utils/global";
const storeAccount = useAccountStore();

const props = defineProps<{
  item: VoucherAvailableDTO;
  action?: boolean;
  selectedCode?: string | null;
  onSelect?: (voucher: VoucherAvailableDTO) => void;
}>();

const emit = defineEmits<{
  (e: "select", voucher: VoucherAvailableDTO): void
}>();

const isSelected = computed(() => props.selectedCode === props.item.code);

const handleClick = () => {
  if (!storeAccount.getDetailValue?.id) return showWarning('Vui lòng đăng nhập để sử dụng voucher!');
  if (props.item.isDisabled) return;

  emit('select', props.item);
};
</script>

<template>
  <label>
    <Card 
      :id="`voucher-item-${item.code}`"
      class="voucher-item1 rd-lg flex"
      :class="{
        'cursor-pointer': action,
        'disable pointer-events': item.isDisabled && action,
        'active': isSelected,
      }"
      bg="gray2"
      size="xs"
      @click="handleClick"
      >
      <div class="flex-1">
        <div class="flex gap-xs align-baseline">
          <Text :text="item.code" color="black" size="normal" weight="semibold" class="text-uppercase" />
          <Text v-if="item.usageLimit" :text="`(Còn ${ Math.max(item.usageLimit - item.usedCount, 0) })`" size="xs" limit="1" />
        </div>
        <Text :text="item.description" size="xs" limit="2" class="voucher-item1-desc"/>
        <Text :text="`HSD: ${formatDateTime(item.endDate,'vi-VN', false)}`" size="xs" />
      </div>

      <div v-if="action" class="flex">
        <v-radio
          :model-value="isSelected"
          :disabled="item.isDisabled"
          color="primary"
          hide-details
          density="compact"
          readonly
        />
      </div>
    </Card>
    <Text v-if="item.disabledReason && action" size="xs" class="voucher-item1-warning" limit="1" v-tooltip="item.disabledReason" :text="item.disabledReason" />
  </label>
</template>