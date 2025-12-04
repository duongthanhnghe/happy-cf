<template>
    <component
      :is="tag"
      v-bind="{
        ...(inputId ? { id: inputId } : {}),
        ...(disabled || loading ? { disabled: true } : {}),
      }"
      :class="[
        'button',
        color ? `button-${color}` : '',
        size ? `button-size-${size}` : '',
        disabled || loading ? 'button-disabled' : '',
        shadow ? 'button-shadow' : '',
        border ? '' : 'button-border-none',
        label || slotContent ? '' : 'button-no-text',
        inputClass,
      ]"
      @change="$emit('handleOnChange')"
      @click="$emit('handleOnClick')"
    >
      <svg v-if="loading" class="button-spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
      <MaterialIcon
        v-else-if="icon"
        :name="icon"
        size="lg-2"
        class="button-icon"
        :weight="props.weightIcon"
      />
      <span v-if="!loading">{{ label }}</span>
      <slot v-if="!loading" ref="slotRef"></slot>
    </component>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  label: String|Number,
  icon: String,
  tag: {
    type: String,
    default: 'button',
  },
  color: {
    type: String,
    validator: (value) => ['primary','secondary','third','black','gray','blur','transparent','danger'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs','sm', 'md','lg'].includes(value)
  },
  loading: { type: Boolean, default: false },
  disabled: {
    type: Boolean,
    default: false,
  },
  inputClass: {
    type: String,
    default: '',
  },
  inputId: {
    type: String,
    default: '',
  },
  shadow: {
    type: Boolean,
    default: false,
  },
  border: {
    type: Boolean,
    default: true,
  },
  weightIcon: {
    type: String,
  },
})

const emit = defineEmits(['handleOnChange', 'handleOnClick'])
const slotRef = ref(null)
const slotContent = ref(false)

onMounted(() => {
  slotContent.value = slotRef.value?.innerHTML.trim().length > 0
})
</script>