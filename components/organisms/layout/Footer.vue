<script lang="ts" setup>
import '@/styles/molecules/layout/footer.scss';
import { IMAGE_FOOTER } from '@/const/image'
import { useBaseInformationStore } from '@/stores/shared/setting/useBaseInformationStore';

const storeSetting = useBaseInformationStore();
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
      <img v-if="storeSetting.getBaseInformation?.logoUrl" class="footer-logo" :src="storeSetting.getBaseInformation?.logoUrl" :alt="storeSetting.getBaseInformation?.name" loading="lazy" />
      <div class="flex gap-sm">
        <template v-for="item in storeSetting.getBaseInformation?.socialLinks" :key="item.icon">
          <a :href="item.src" target="_blank">
            <Button color="secondary" :border="false">
              <component :is="storeSetting.iconMap[item.icon]" />
            </Button>
          </a>
        </template>
      </div>
      <div class="flex flex-wrap justify-center gap-sm line-height-1">
        <template v-for="(item, index) in listLink" :key="index">
          <a :href="item.src" target="_blank">
            {{ item.name }}
          </a>
        </template>
      </div>
      <div class="text-color-gray5">
        {{ storeSetting.getBaseInformation?.description }}
      </div>
    </div>
    </div>
  </div>
</template> 