<script lang="ts" setup>
import '@/styles/organisms/user/section-account.scss'
import { watch, watchEffect } from 'vue';
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { ROUTES } from '@/shared/constants/routes';
import { useMembershipStore } from '@/stores/shared/useMembershipStore'
import { useHistoryRewardByUserStore } from '@/stores/client/users/useHistoryRewardByUserStore'
import { formatCurrency } from '@/utils/global';

const storeAccount = useAccountStore()
const storeMembership = useMembershipStore()
const storeHistoryReward = useHistoryRewardByUserStore();

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
  <client-only>
  <div class="information-account">
    <div class="container">
        <div v-if="storeAccount.getDetailValue?.id" class="information-account-card">
          <div class="flex justify-between">
            <div class="flex align-center gap-sm">
              <img :src="storeAccount.getDetailValue?.avatar" class="information-account-avatar avatar-src" alt="avatar" />
              <div class="text-size-xs">
                <Heading weight="semibold"> {{ storeAccount.getDetailValue?.fullname || '' }} </Heading>
                <span @click="storeAccount.handleTogglePopupMembershipInformation(true)" class="text-color-gray8 cursor-pointer">Hang {{ storeAccount.getDetailValue?.membership.level || '' }} </span>
              </div>
            </div>
            <div class="flex gap-sm">
              <Button @click.prevent="storeHistoryReward.handleTogglePopup(true)" color="secondary" :label="`${formatCurrency(storeAccount.getDetailValue?.membership.balancePoint).replace('đ','') || 0}`" icon="diamond_shine" class="information-account-point" size="sm" />
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
                {{ formatCurrency(storeAccount.getDetailValue?.membership.point).replace('đ','') }}
              </div>
              <div class="information-account-process">
                <div class="information-account-process-percent" :style="{width: (storeAccount.getDetailValue?.membership.point / (storeAccount.getInformationMembershipLevel?.nextLevel?.minPoint || 1) * 100).toFixed(2) + '%'
                }"></div>
                <div class="information-account-process-line"></div>
              </div>
              <div class="flex justify-between mt-xs text-size-xs text-color-gray8">
                <img v-if="storeAccount.getInformationMembershipLevel?.currentLevel.image" :src="storeAccount.getInformationMembershipLevel?.currentLevel.image" :alt="storeAccount.getInformationMembershipLevel?.currentLevel.name" width="50" />
                <img v-if="storeAccount.getInformationMembershipLevel?.nextLevel.image" :src="storeAccount.getInformationMembershipLevel?.nextLevel.image" :alt="storeAccount.getInformationMembershipLevel?.nextLevel.name" width="50" />
              </div>
              <div v-if="storeAccount.getDetailValue?.membership.point < storeAccount.getInformationMembershipLevel?.nextLevel.minPoint" class="mt-xs">
                Tich luy them <span class="weight-semibold">{{ formatCurrency(storeAccount.getInformationMembershipLevel?.nextLevel.minPoint - storeAccount.getDetailValue?.membership.point).replace('đ','') }} điểm</span> de thang hang {{ storeAccount.getInformationMembershipLevel?.nextLevel.name }}
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
  </client-only>
</template>
