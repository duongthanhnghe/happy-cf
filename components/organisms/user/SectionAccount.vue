<script lang="ts" setup>
import { watch, watchEffect } from 'vue';
import '@/styles/organisms/user/section-account.scss'
import {
  useAccountStore
} from '@/stores/users/useAccountStore'
import PopupBarcode from './PopupBarcode.vue';
import { ROUTES } from '@/shared/constants/routes';
import { useMembershipStore } from '@/stores/shared/useMembershipStore'

const storeAccount = useAccountStore()
const storeMembership = useMembershipStore()

const props = defineProps({
  showBarcode: {
    type: Boolean,
    default: true
  },
})

watch(() => storeAccount.getDetailValue?.id, (newValue) => {
    if(newValue && storeMembership.getListData.length === 0) storeMembership.fetchMembershipStore()
  },
  { immediate: true }
)

watchEffect(() => {
  if (storeMembership.getListData.length > 0) {
    storeAccount.getNextMembershipLevel(storeMembership.getListData)
  }
})

</script>
<template>
  <div class="information-account">
    <div class="container">
      <div v-if="storeAccount.getLoading && !storeAccount.getDetailValue?.id" class="information-account-card">Đang tải tài khoản...</div>
      <div v-else-if="!storeAccount.getLoading && storeAccount.getDetailValue?.id" class="information-account-card">
          <div class="flex justify-between">
            <div class="flex align-center gap-sm">
              <img :src="storeAccount.getDetailValue?.avatar" class="information-account-avatar avatar-src" alt="avatar" />
              <div class="text-size-xs">
                <Heading weight="semibold"> {{ storeAccount.getDetailValue?.fullname || '' }} </Heading>
                <span class="text-color-gray8">Hang {{ storeAccount.getDetailValue?.membership.level || '' }}</span>
              </div>
            </div>
            <div class="flex gap-sm">
              <Button color="secondary" :label="`${storeAccount.getDetailValue?.membership.point || 0}`" icon="diamond_shine" class="information-account-point" :disabled="false" size="sm" />
              <Button @click.prevent="storeAccount.handleTogglePopupBarcode(true)" :border="false" color="gray" icon="qr_code_scanner" size="sm"/>
            </div>
          </div>
        
          <div v-if="props.showBarcode" class="information-account-code">
              <img :src="storeAccount.getDetailValue?.membership.barcode" alt="code" />
              {{ storeAccount.getDetailValue?.membership.code }}
          </div>
          <div v-else class="mt-md">
            <template v-if="storeAccount.getInformationMembershipLevel">
              <div class="text-size-normal weight-semibold mb-xs">
                {{ storeAccount.getDetailValue?.membership.point }}
              </div>
              <div class="information-account-process">
                <div class="information-account-process-percent" :style="{width: (storeAccount.getDetailValue?.membership.point / (storeAccount.getInformationMembershipLevel?.nextLevel?.minPoint || 1) * 100).toFixed(2) + '%'
    }"></div>
                <div class="information-account-process-line"></div>
              </div>
              <div class="flex justify-between mt-xs text-size-xs text-color-gray8">
                Hang {{ storeAccount.getInformationMembershipLevel?.currentLevel.name }}
                <span>
                  Hang {{ storeAccount.getInformationMembershipLevel?.nextLevel.name }}
                </span>
              </div>
              <div v-if="storeAccount.getDetailValue?.membership.point < storeAccount.getInformationMembershipLevel?.nextLevel.minPoint" class="mt-xs">
                Tich luy them <span class="weight-semibold">{{ storeAccount.getInformationMembershipLevel?.nextLevel.minPoint - storeAccount.getDetailValue?.membership.point }} điểm</span> de thang hang {{ storeAccount.getInformationMembershipLevel?.nextLevel.name }}
              </div>
            </template>
          </div>
      </div>
      <div v-else class="information-account-card text-center">
        <Heading weight="semibold" class="text-center">Dang nhap</Heading>
        <div class="mt-sm mb-sm">Vui long dang nhap</div>
        <NuxtLink :to="{ path: ROUTES.PUBLIC.LOGIN.path }">
          <Button color="black" label="Dang nhap" />
        </NuxtLink>
      </div>
    </div>
  </div>

  <PopupBarcode />
</template>
