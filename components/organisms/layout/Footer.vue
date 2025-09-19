<script lang="ts" setup>
import '@/styles/molecules/layout/footer.scss';
import { IMAGE_FOOTER } from '@/const/image'
import { useSettingStore } from '@/stores/shared/setting/useSettingStore';

const storeSetting = useSettingStore();
const listLink = [
  {
    name: 'Dieu khoan',
    src: '/',
    action: ''
  },
  {
    name: 'Dieu khoan',
    src: '/',
    action: ''
  },
  {
    name: 'Dieu khoan',
    src: '/',
    action: ''
  },
  {
    name: 'Dieu khoan',
    src: '/',
    action: ''
  }
]

</script>
<template>
  <div class="footer" :style="`background-image: url('${IMAGE_FOOTER}')`">
    <div class="container">
    <div class="footer-content">
      <img v-if="storeSetting.getSettings?.logoUrl" class="footer-logo" :src="storeSetting.getSettings?.logoUrl" :alt="storeSetting.getSettings?.name" loading="lazy" />
      <div class="flex gap-sm">
        <template v-for="item in storeSetting.getSettings?.socialLinks" :key="item.icon">
          <a :href="item.src" target="_blank">
            <Button color="secondary" :border="false">
              <component :is="storeSetting.iconMap[item.icon]" />
            </Button>
          </a>
        </template>
      </div>
      <div class="flex flex-wrap justify-center gap-sm line-height1">
        <template v-for="(item, index) in listLink" :key="index">
          <a :href="item.src" target="_blank">
            {{ item.name }}
          </a>
        </template>
      </div>
      <div class="text-color-gray5">
        {{ storeSetting.getSettings?.description }}
      </div>
    </div>
    </div>
  </div>
</template> 