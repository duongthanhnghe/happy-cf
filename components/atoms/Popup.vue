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
              <Text v-if="popupHeading" :size="storeDisplay.isMobileTable ? 'md':'lg'" weight="medium" :text="popupHeading" />
              <div class="portal-popup-header-actions flex gap-xs">
                <slot name="header"></slot>
              </div>
            </div>
            <div :class="`portal-popup-body scroll-hide ${bodyClass} ${footerFixed ? 'flex flex-direction-column justify-between fixed':''}`">
              <div class="portal-popup-box">
                <slot name="body"></slot>
              </div>
              <div class="portal-popup-footer">
                <slot name="footer">
                </slot>
              </div>
            </div>
          </div>
          <div class="portal-popup-shape" @click="handleClosePopup"></div>
        </template>
        <template v-else>
          <div :class="`portal-popup-center ${align}`" @click.prevent="handleClosePopup">
          <div :class="`portal-popup-center-body scroll-hide ${bodyClass} ${footerFixed ? 'fixed':''}`" @click.stop>
            <Button v-if="!storeDisplay.isMobileTable" color="secondary" :size="storeDisplay.isMobileTable ? 'sm':'md'" class="portal-popup-center-close" icon="close" @click="handleClosePopup" />
            <div v-else class="portal-popup-badge" @click="handleClosePopup"></div>
            <Text v-if="popupHeading" :size="storeDisplay.isMobileTable ? 'md':'2xl'" weight="semibold" :text="popupHeading" />
            <div class="portal-popup-header-actions flex gap-xs">
              <slot name="header"></slot>
            </div>
            <slot name="body"></slot>
            <div class="portal-popup-footer">
              <slot name="footer">
              </slot>
            </div>
          </div>
          </div>
          <div class="portal-popup-shape"></div>
        </template>
    </div>
</template>

<script setup>
import { useDisplayStore } from '@/stores/shared/useDisplayStore'

const storeDisplay = useDisplayStore()

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
    validator: (value) => ['modal-center', 'modal-right'].includes(value)
  },
  align: {
    type: String,
    default: 'right',
    validator: (value) => ['top', 'center' ,'bottom','right'].includes(value)
  },
  footerFixed: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue','handleClosePopup'])

const handleClosePopup = () => {
  emit('update:modelValue', false)
}

</script>