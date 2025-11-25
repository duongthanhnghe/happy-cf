
<script lang="ts" setup>
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { useSlots, computed } from 'vue'

const storeDisplay = useDisplayStore()
const slots = useSlots();

const props = defineProps({
  popupHeading: {
    type: String,
    default: '',
  },
  icon: String,
  popupClass: {
    type: String,
    default: '',
  },
  bodyClass: {
    type: String,
    default: '',
  },
  bodySpace: {
    type: Boolean,
    default: true,
  },
  popupId: {
    type: String,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  children: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'modal-right',
    validator: (value: string) => ['modal-center', 'modal-right'].includes(value)
  },
  align: {
    type: String,
    default: 'right',
    validator: (value: string) => ['top', 'center' ,'bottom','right'].includes(value)
  },
  footerFixed: {
    type: Boolean,
    default: false,
  },
})

const slotContent = computed(() => !!slots.footer);

const emit = defineEmits(['update:modelValue','handleClosePopup'])

const handleClosePopup = () => {
  emit('update:modelValue', false)
}
</script>
<template>
  <div
    :id="popupId"
    :class="[
      'portal-popup',
      modelValue ? `active` : '',
      children ? `portal-popup-children` : '',
      popupClass
    ]"
  >
      <template v-if="variant === 'modal-right'">
        <div class="portal-popup-main">
          <div class="portal-popup-header">
            <Button color="secondary" class="portal-popup-close" icon="arrow_back" @click="handleClosePopup" />
            <Text v-if="popupHeading" :size="storeDisplay.isMobileTable ? 'md':'lg'" weight="medium" :text="popupHeading" limit="1"/>
            <div class="portal-popup-header-actions flex gap-xs">
              <slot name="header"></slot>
            </div>
          </div>
          <div :class="`portal-popup-body scroll-hide ${bodyClass} ${bodySpace ? '':'pd-0'} ${footerFixed ? 'flex flex-direction-column justify-between fixed':''}`">
            <div :class="`portal-popup-box ${bodySpace ? '':'pd-0'}`">
              <slot name="body"></slot>
            </div>
            <div :class="slotContent ? `portal-popup-footer ${bodySpace ? '':'mg-0 bottom-0'}`:''">
              <slot name="footer">
              </slot>
            </div>
          </div>
        </div>
        <div class="portal-popup-shape" @click="handleClosePopup"></div>
      </template>
      <template v-else>
        <div :class="`portal-popup-center ${align}`" @click.prevent="handleClosePopup">
        <div :class="`portal-popup-center-body scroll-hide ${bodyClass} ${bodySpace ? '':'pd-0'} ${footerFixed ? 'fixed':''}`" @click.stop>
          <Button v-if="!storeDisplay.isMobileTable" color="secondary" :size="storeDisplay.isMobileTable ? 'sm':'md'" class="portal-popup-center-close" icon="close" @click="handleClosePopup" />
          <div v-if="storeDisplay.isMobileTable && align === 'bottom'" class="portal-popup-badge" @click="handleClosePopup"></div>
          <Text v-if="popupHeading" :size="storeDisplay.isMobileTable ? 'lg':'xl'" align="center" weight="semibold" :text="popupHeading" />
          <div class="portal-popup-header-actions flex gap-xs">
            <slot name="header"></slot>
          </div>
          <slot name="body"></slot>
          <div :class="slotContent ? 'portal-popup-footer':''">
            <slot name="footer">
            </slot>
          </div>
        </div>
        </div>
        <div class="portal-popup-shape"></div>
      </template>
  </div>
</template>
