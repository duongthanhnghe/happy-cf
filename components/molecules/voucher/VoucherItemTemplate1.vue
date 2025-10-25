<script setup lang="ts">
import { computed } from "vue";
import type { VoucherAvailableDTO } from "@/server/types/dto/v1/voucher.dto";
import { VOUCHER_TYPE } from "@/shared/constants/voucher-type";

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
  if (props.item.isDisabled && !props.action) return;
  emit("update:modelValue", props.item.code);
};
</script>

<template>
  <label>
    <div 
      :id="`voucher-item-${item.code}`"
      class="voucher-item card card-sm bg-gray2 flex"
      :class="{
        'cursor-pointer': action,
        'disable': item.isDisabled && action,
        'active': isSelected,
      }"
      @click="toggleSelection"
      >
      <div class="flex-1">
        <div class="flex items-center gap-1 font-semibold text-gray-800">
          <span>{{ item.code }}</span>
          <span v-if="item.usageLimit" class="text-sm text-gray-500"
            >(Còn {{ Math.max(item.usageLimit - item.usedCount, 0) }})</span
          >
        </div>
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
    </div>
    <div v-if="item.disabledReason && action">{{ item.disabledReason }}</div>
  </label>
</template>