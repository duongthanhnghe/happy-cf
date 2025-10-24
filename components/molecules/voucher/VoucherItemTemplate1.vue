<script setup lang="ts">
import { computed } from "vue";
import type { VoucherAvailableDTO } from "@/server/types/dto/v1/voucher.dto";
import { VOUCHER_TYPE } from "@/shared/constants/voucher-type";

const props = defineProps<{
  item: VoucherAvailableDTO;
  modelValue: string | string[] | null; // string nếu là radio, array nếu là checkbox
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
}>();

const isFreeship = computed(() => props.item.type === VOUCHER_TYPE.freeship.type);

const isSelected = computed(() => props.modelValue === props.item.code);

const toggleSelection = () => {
  if (props.item.isDisabled) return;
  emit("update:modelValue", props.item.code);
};
</script>

<template>
  <label
    class="voucher-item card card-sm bg-white flex"
    :class="{
      'opacity-per50': item.isDisabled,
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

    <div class="flex controllll">
      <v-radio
        :model-value="isSelected"
        :disabled="item.isDisabled"
        color="primary"
        hide-details
        density="compact"
        readonly
      />
    </div>
  </label>
</template>