<script lang="ts" setup>
const props = defineProps<{
  onHandleTogglePopupFilter: (value: boolean) => void;
}>();
</script>
<template>
  <div class="mt-sm flex gap-xs" >
    <div class="shadow-2 rd-lg flex-1">
      <ProductFilterDefault />
    </div>
    <Button color="secondary" class="shadow-2" icon="filter_alt" @click="props.onHandleTogglePopupFilter(true)"/>
  </div>
</template>