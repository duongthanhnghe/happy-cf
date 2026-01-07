<script lang="ts" setup>
import type { MenuItem } from '@/server/types/common/menu-item';
import type { SocialLinkDTO } from '@/server/types/dto/v1/base-information.dto';
import { useSearchStore } from '@/stores/client/product/useSearchStore';
import { useRoute } from 'vue-router'
import { watch } from 'vue'

const route = useRoute()
const store = useSearchStore()
const props = defineProps<{
  isTogglePopupMenu: boolean;
  logo: string
  listMenu: MenuItem[]
  listMenuMore: MenuItem[]
  phone: string
  socialLinks: SocialLinkDTO[]
}>();

const emit = defineEmits<{
  (e: 'update:isTogglePopupMenu', value: boolean): void
}>()

watch(
  () => route.fullPath,
  () => {
    emit('update:isTogglePopupMenu', false)
  }
)
</script>

<template>
  <Popup 
    :model-value="props.isTogglePopupMenu"
    @update:modelValue="emit('update:isTogglePopupMenu', $event)"
    align="right" 
    bodyClass="pd-0"
    >
    <template #header >
      <img v-if="props.logo" :src="props.logo" alt="logo" height="40px" class="max-height-40" />
    </template>
    <template #body>
      <div class="bg-gray pd-ms">
        <HeaderBoxSearch
          v-model="store.txtSearch"
          @submit="store.handleViewAll"
          @cancel="store.handleCancelSearch"
        />
        <HeaderMenuMobile
          :listMenu="props.listMenu"
        />
        <HeaderBoxSupport
          :phone="props.phone"
          :socialLinks="props.socialLinks"
        />
      </div>
      <div class="pd-ms">
        <HeaderMenuMore
          :listMenuMore="props.listMenuMore"
        />
      </div>
    </template>
  </Popup>
</template>