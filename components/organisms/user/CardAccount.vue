<script lang="ts" setup>
import '@/styles/organisms/user/section-account.scss'
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { useHistoryRewardByUserStore } from '@/stores/client/users/useHistoryRewardByUserStore'
import { formatCurrency } from '@/utils/global';
import { IMAGE_AVATAR_DEFAULT } from '@/const/image';

const storeAccount = useAccountStore()
const storeHistoryReward = useHistoryRewardByUserStore();

const props = defineProps({
  showBarcode: {
    type: Boolean,
    default: false
  },
  showLevel: {
    type: Boolean,
    default: false
  },
})

</script>
<template>
  <client-only>
  <div class="information-account" v-if="storeAccount.getUserId">
    <div class="container">
        <div class="information-account-card">
          <div class="flex justify-between">
            <div class="flex align-center gap-sm">
              <Image 
                :src="storeAccount.getDetailValue?.avatar"
                :alt="storeAccount.getDetailValue?.fullname"
                :width="50"
                class="height-50 width-50 object-cover bg-white border-color-gray border-default rd-full"
                preset="avatar"
                :placeholder="IMAGE_AVATAR_DEFAULT"
              />
              <div>
                <Text weight="semibold" color="black" :text="storeAccount.getDetailValue?.fullname" />
                <Text
                   @click="storeAccount.handleTogglePopupMembershipInformation(true)"
                   color="gray8" 
                   :text="`Hạng ${ storeAccount.getDetailValue?.membership.level || '' }`" 
                   class="cursor-pointer"
                   size="xs"
                />
              </div>
            </div>
            <div class="flex gap-sm">
              <Button @click.prevent="storeHistoryReward.handleTogglePopup(true)" color="secondary" :label="`${formatCurrency(storeAccount.getDetailValue?.membership.balancePoint).replace('đ','') || 0}`" icon="diamond_shine" class="information-account-point" size="sm" />
              <Button v-if="!props.showBarcode" @click.prevent="storeAccount.handleTogglePopupBarcode(true)" :border="false" color="gray" icon="qr_code_scanner" size="sm"/>
            </div>
          </div>
          
          <div v-if="props.showLevel" class="mt-md">
            <template v-if="storeAccount.getInformationMembershipLevel && storeAccount.getDetailValue?.membership.point">
              <div class="text-size-normal weight-semibold mb-xs">
                {{ formatCurrency(storeAccount.getDetailValue?.membership.point).replace('đ','') }}
              </div>
              <div class="information-account-process">
                <div class="information-account-process-percent" :style="{width: (storeAccount.getDetailValue?.membership.point / (storeAccount.getInformationMembershipLevel?.nextLevel?.minPoint || 1) * 100).toFixed(2) + '%'
                }"></div>
                <div class="information-account-process-line"></div>
              </div>
              <div class="flex justify-between mt-xs text-size-xs text-color-gray8">
                <Image 
                  v-if="storeAccount.getInformationMembershipLevel?.currentLevel.image"
                  :src="storeAccount.getInformationMembershipLevel?.currentLevel.image" 
                  :alt="storeAccount.getInformationMembershipLevel?.currentLevel.name"
                  :width="50"
                />
                <Image 
                  v-if="storeAccount.getInformationMembershipLevel?.nextLevel.image"
                  :src="storeAccount.getInformationMembershipLevel?.nextLevel.image" 
                  :alt="storeAccount.getInformationMembershipLevel?.nextLevel.name"
                  :width="50"
                />
              </div>
              <div v-if="storeAccount.getDetailValue?.membership.point < storeAccount.getInformationMembershipLevel?.nextLevel.minPoint" class="flex flex-wrap gap-xs mt-xs">
                Tích luỹ thêm <span class="weight-semibold">{{ formatCurrency(storeAccount.getInformationMembershipLevel?.nextLevel.minPoint - storeAccount.getDetailValue?.membership.point).replace('đ','') }} điểm</span> để thăng hạng {{ storeAccount.getInformationMembershipLevel?.nextLevel.name }}.
                <Text
                   @click="storeAccount.handleTogglePopupMembershipInformation(true)"
                   color="gray8" 
                   text="Xem quyền lợi" 
                   class="cursor-pointer text-underline"
                />
              </div>
            </template>
          </div>

          <div v-if="props.showBarcode" class="information-account-code bg-white rd-md pd-sm mt-md flex flex-direction-column align-center line-height-1">
            <Image 
              :src="storeAccount.getDetailValue?.membership.barcode"
              :alt="storeAccount.getDetailValue?.fullname"
              :width="150"
              :height="50"
              class="mb-sm"
            />
            {{ storeAccount.getDetailValue?.membership.code }}
          </div>

      </div>
    </div>
  </div>
  <div v-else class="mt-ms"></div>
  </client-only>
</template>
