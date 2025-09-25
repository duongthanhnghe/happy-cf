<template>
    <component
      :is="tag"
      v-bind="{
        ...(inputId ? { id: inputId } : {}),
        ...(disabled ? { disabled: true } : {}),
      }"
      :class="[
        'button',
        color ? `button-${color}` : '',
        size ? `button-size-${size}` : '',
        disabled ? 'button-disabled' : '',
        shadow ? 'button-shadow' : '',
        border ? '' : 'button-border-none',
        label ? '' : 'button-no-text',
        inputClass,
      ]"
      @change="$emit('handleOnChange')"
      @click="$emit('handleOnClick')"
    >
      <MaterialIcon
        v-if="icon"
        :name="icon"
        :size="24"
        class="button-icon"
      />
      {{ label }}
      <slot></slot>
    </component>
</template>

<script setup>

const props = defineProps({
  label: String|Number,
  icon: String,
  tag: {
    type: String,
    default: 'button',
  },
  color: {
    type: String,
    validator: (value) => ['primary','secondary','third','black','gray','blur'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs','sm', 'md','lg'].includes(value)
  },
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
})

const emit = defineEmits(['handleOnChange', 'handleOnClick'])
</script>