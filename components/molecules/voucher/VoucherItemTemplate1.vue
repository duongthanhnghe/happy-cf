<script setup lang="ts">
import '@/styles/molecules/voucher/voucher-item1.scss'
import { computed } from "vue";
import type { VoucherAvailableDTO } from "@/server/types/dto/v1/voucher.dto";
import { VOUCHER_TYPE } from "@/shared/constants/voucher-type";
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { showWarning } from "@/utils/toast";
import { formatDateTime} from "@/utils/global";
const storeAccount = useAccountStore();

const props = defineProps<{
  item: VoucherAvailableDTO;
  action: boolean;
  modelValue: string | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
}>();

const isFreeship = computed(() => props.item.type === VOUCHER_TYPE.freeship.type);

const isSelected = computed(() => props.modelValue === props.item.code);

const toggleSelection = () => {
  if(!storeAccount.getDetailValue?.id) return showWarning('Vui long dang nhap de su dung voucher!')
  if (props.item.isDisabled && !props.action) return;
  emit("update:modelValue", props.item.code);
};
</script>

<template>
  <label>
    <Card 
      :id="`voucher-item-${item.code}`"
      class="voucher-item1 rd-lg flex"
      :class="{
        'cursor-pointer': action,
        'disable': item.isDisabled && action,
        'active': isSelected,
      }"
      bg="gray2"
      size="xs"
      border
      @click="toggleSelection"
      >
      <div class="flex-1">
        <div class="flex gap-xs align-baseline">
          <Text :text="item.code" color="black" size="normal" weight="semibold" class="text-uppercase" />
          <Text v-if="item.usageLimit" :text="`(Còn ${ Math.max(item.usageLimit - item.usedCount, 0) })`" size="xs" />
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
    <div v-if="item.disabledReason && action">{{ item.disabledReason }}</div>
  </label>
</template>