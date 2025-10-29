<script setup lang="ts">
import { ref, computed } from "vue"

const props = defineProps<{
  fromDay?: string | null
  toDay?: string | null
}>()

const emit = defineEmits<{
  (e: "update:fromDay", value: string | null): void
  (e: "update:toDay", value: string | null): void
}>()

const menuFromDay = ref(false)
const menuToDay = ref(false)

const todayIso = computed(() => new Date().toISOString().split('T')[0])

const formattedDate = computed(() => ({
  from: props.fromDay ? new Date(props.fromDay).toLocaleDateString("vi-VN") : "",
  to: props.toDay ? new Date(props.toDay).toLocaleDateString("vi-VN") : "",
}))

const onSelectFromDay = (val: string | null) => {
  if (val) {
    const d = new Date(val)       
    d.setHours(0, 0, 0, 0)           
    emit("update:fromDay", d.toISOString())
  } else {
    emit("update:fromDay", null)
  }
  menuFromDay.value = false
}

const onSelectToDay = (val: string | null) => {
  if (val) {
    const d = new Date(val)
    d.setHours(23, 59, 59, 999) 
    emit("update:toDay", d.toISOString())
  } else {
    emit("update:toDay", null)
  }
  menuToDay.value = false
}
</script>

<template>
  <div class="flex gap-xs">
    <!-- FROM DAY -->
    <v-menu
      v-model="menuFromDay"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
    >
      <template #activator="{ props: activatorProps }">
        <v-text-field
          v-model="formattedDate.from"
          label="Từ ngày"
          readonly
          hide-details
          style="min-width: 150px"
          v-bind="activatorProps"
          append-inner-icon="mdi-calendar"
          variant="outlined"
        />
      </template>

      <v-date-picker
        :model-value="props.fromDay ? props.fromDay.split('T')[0] : null"
        @update:model-value="onSelectFromDay"
        :max="todayIso"             
      />
    </v-menu>

    <!-- TO DAY -->
    <v-menu
      v-model="menuToDay"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
    >
      <template #activator="{ props: activatorProps }">
        <v-text-field
          v-model="formattedDate.to"
          label="Đến ngày"
          readonly
          hide-details
          style="min-width: 150px"
          v-bind="activatorProps"
          append-inner-icon="mdi-calendar"
          variant="outlined"
        />
      </template>

      <v-date-picker
        :model-value="props.toDay ? new Date(new Date(props.toDay).getTime() - 1).toISOString().split('T')[0] : null"
        @update:model-value="onSelectToDay"
        :max="todayIso"            
      />
    </v-menu>
  </div>
</template>
