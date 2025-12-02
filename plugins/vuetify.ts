import { defineNuxtPlugin } from '#app'
import { createVuetify } from 'vuetify'

import 'vuetify/lib/styles/generic/_reset.scss'
import 'vuetify/lib/styles/generic/_colors.scss'
// import 'vuetify/lib/styles/generic/_elevation.scss'
// import 'vuetify/lib/styles/elements/_typography.scss'

// Component styles cho từng component bạn sử dụng
import 'vuetify/lib/components/VApp/VApp.css'
// import 'vuetify/lib/components/VMain/VMain.css'
import 'vuetify/lib/components/VBtn/VBtn.css'
// import 'vuetify/lib/components/VCard/_VCard.scss'
import 'vuetify/lib/components/VIcon/VIcon.css'
// import 'vuetify/lib/components/VForm/_VForm.scss'
import 'vuetify/lib/components/VTextField/VTextField.css'
import 'vuetify/lib/components/VTextarea/VTextarea.css'
import 'vuetify/lib/components/VFileInput/VFileInput.css'
import 'vuetify/lib/components/VSwitch/VSwitch.css'
// import 'vuetify/lib/components/VRadio/VRadio.css'
import 'vuetify/lib/components/VSelect/VSelect.css'
import 'vuetify/lib/components/VChip/VChip.css'
import 'vuetify/lib/components/VImg/VImg.css'
import 'vuetify/lib/components/VMenu/VMenu.css'
import 'vuetify/lib/components/VList/VList.css'
import 'vuetify/lib/components/VTabs/VTabs.css'
import 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.css'

import {
  Ripple,
  Resize,
  Scroll,
  Touch,
  Intersect,
  ClickOutside,
  Mutate
} from 'vuetify/directives'

import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { vi } from 'vuetify/locale'
import { h } from 'vue'

import {
  // Form components
  VForm,
  VTextField,
  VTextarea,
  VFileInput,
  VSwitch,
  VRadio,
  VRadioGroup,
  VSelect,
  
  // Display components
  VChip,
  VImg,
  
  // Menu và List components
  VMenu,
  VList,
  VListItem,
  VListItemTitle,
  VListItemSubtitle,
  
  // Tab components
  VTabs,
  VTab,
  VTabsWindow,
  VTabsWindowItem,
  
  // Layout components
  VContainer,
  
  // Scroll components
  VInfiniteScroll,
  
  // Các components cơ bản thường cần
  VApp,
  VMain,
  VBtn,
  VCard,
  VCardActions,
  VIcon,
  VDataTable,
  VDataTableServer,
  VTreeview,
  VDatePicker,
  VTimePicker,
  VRangeSlider,
  VRating,
  VCheckboxBtn,
  VBreadcrumbs,
  VBreadcrumbsItem,
  VBreadcrumbsDivider,
  VAutocomplete,
  VCheckbox,
  VProgressCircular,
  VCombobox,
} from 'vuetify/components'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components: {
      // Form components
      VForm,
      VTextField,
      VTextarea,
      VFileInput,
      VSwitch,
      VRadio,
      VRadioGroup,
      VSelect,
      VCheckbox,
      
      // Display components
      VChip,
      VImg,
      
      // Menu và List components
      VMenu,
      VList,
      VListItem,
      VListItemTitle,
      VListItemSubtitle,
      
      // Tab components
      VTabs,
      VTab,
      VTabsWindow,
      VTabsWindowItem,
      
      // Layout components
      VContainer,
      
      // Scroll components
      VInfiniteScroll,
      
      // Các components cơ bản
      VApp,
      VMain,
      VBtn,
      VCard,
      VCardActions,
      VIcon,
      VDataTable,
      VDataTableServer,
      VTreeview,
      VDatePicker,
      VTimePicker,
      VRangeSlider,
      VRating,
      VCheckboxBtn,
      VBreadcrumbs,
      VBreadcrumbsItem,
      VBreadcrumbsDivider,
      VAutocomplete,
      VProgressCircular,
      VCombobox,
    },
    // ✅ Chỉ import directives cần thiết
    directives: {
      Ripple,      // Cho hiệu ứng ripple trên button
      Resize,      // Cho responsive
      Scroll,      // Cho scroll events
      Touch,       // Cho touch/swipe gestures
      Intersect,   // Cho lazy loading, infinite scroll
      ClickOutside,// Cho menu, dialog
      Mutate,      // Cho DOM mutations
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
        materialSymbols: {
          component: {
            props: {
              icon: { type: String, required: true }
            },
            render() {
              return h('span', {
                class: 'material-symbols-rounded',
                style: {
                  fontVariationSettings: `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
                },
              }, this.icon)
            }
          }
        }
      }
    },
    defaults: {
      VDataTable: { itemsPerPageText: 'Số hàng / trang' },
      VDataTableServer: { itemsPerPageText: 'Số hàng / trang' },
      VSelect: {
        appendInnerIcon: 'mdi-angle-down',
      },
    },
    locale: {
      locale: 'vi',
      messages: { vi }
    },
  })

  nuxtApp.vueApp.use(vuetify)
})