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
          @submit="store.onChangeSearch"
          @cancel="store.handleCancelSearch"
        />

        <Card class="rd-lg mt-sm pb-0 overflow-hidden">
          <template v-for="(item, index) in props.listMenu" :key="index">
            <HeaderMenuItemTemplate1 :item="item" />
          </template>
        </Card>
        <Card class="rd-lg mt-sm">
          <div class="flex flex-1 align-center justify-between">
            <Text text="Hỗ trợ CSKH" color="black" weight="semibold" class="text-uppercase" />
            <div class="flex gap-sm">
              <a v-if="props.phone" :href="`tel:${Number(props.phone.replace(/\s+/g, ''))}`">
                <Button tag="span" color="gray" size="sm" icon="phone" />
              </a>
              <a v-if="props.socialLinks" :href="props.socialLinks[0].src" target="_blank">
                <Button tag="span" color="black" size="sm" icon="chat" />
              </a>
            </div>
          </div>
        </Card>
      </div>
      <div class="pd-ms">
        <template v-for="(item, index) in props.listMenuMore" :key="index">
          <NuxtLink :to="item.path">
            <Text
              :text="item.label"
              color="gray5"
              class="mb-ms pl-ms"
            />
          </NuxtLink>
        </template>
      </div>
    </template>
  </Popup>
</template>