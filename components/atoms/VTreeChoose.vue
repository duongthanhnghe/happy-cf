<template>
  <div class="v-tree-custom">
    <v-select 
      :model-value="props.label"
      :label="props.label.length === 0 ? props.heading : ''" 
      variant="outlined" 
      chips 
      multiple 
      disabled
      props.required
    >
      <template v-slot:chip="{ item }">
        <v-chip
          color="gray"
          label
          size="small"
        >
          {{ item.value }}
        </v-chip>
      </template>
    </v-select>
    
    <v-menu 
      transition="slide-x-transition" 
      activator="parent"
      :close-on-content-click="false"
    >
      <slot></slot>
    </v-menu>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: Array,
    default: () => []
  },
  heading: {
    type: String,
    default: 'Vui lòng chọn',
  },
  required: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss">
.v-tree-custom {
  position: relative;
  .v-field--disabled {
    opacity: 1 !important;
  }
  
  .v-field--disabled .v-label {
    opacity: 1 !important;
  }
  
  .v-field--disabled .v-chip {
    opacity: 1 !important;
  }
}
</style>