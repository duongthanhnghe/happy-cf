<script setup lang="ts">
const props = defineProps({
  totalPages: {
    type: Array as () => string[],
    default: () => []
  },
  page: {
    type: String,
    default: "1"
  },
})

const emit = defineEmits(["update:page","update:valueChangePage"])

const handleChangePage = (value: boolean) => {
  emit('update:valueChangePage', value)
}

const handleSelectChange = (value: string) => {
  emit('update:page', value)
}
</script>

<template>
  <client-only>
    <v-select
      :items="totalPages"
      :model-value="page"
      variant="outlined"  
      class="v-select-order weight-semibold"
      hide-details
      @update:model-value="handleSelectChange"
    >
      <template v-slot:append>
        <MaterialIcon name="keyboard_arrow_down" />
      </template>
    </v-select>
    <Button :color="props.page ==  '1' ? 'secondary':'black'" icon="keyboard_arrow_left" @click.prevent="handleChangePage(false)" :disabled="props.page == '1'" />
    <Button :color="props.page == props.totalPages[props.totalPages.length - 1] ? 'secondary':'black'" icon="keyboard_arrow_right" @click.prevent="handleChangePage(true)" :disabled="props.page == props.totalPages[props.totalPages.length - 1]" />
  </client-only>
</template>
