<script lang="ts" setup>
import '@/styles/molecules/layout/header.scss';
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useSearchStore } from '@/stores/client/product/useSearchStore'
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore'
import { useBaseInformationStore } from '@/stores/client/base-information/useBaseInformationStore';
import { ROUTES } from '@/shared/constants/routes';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { useProductCategoryStore } from '@/stores/client/product/useProductCategoryStore';
import { useHeaderStore } from '@/stores/client/layout/useHeaderStore';
import { computed } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()
const storeSetting = useBaseInformationStore();
const storeCart = useCartStore()
const storeAccount = useAccountStore()
const storeSearch = useSearchStore()
const storeAddress = useAddressesManageStore()
const storeDisplay = useDisplayStore()
const storeProductCategory = useProductCategoryStore()
const storeHeader = useHeaderStore()

const typeLeft = computed(() => route.meta?.headerTypeLeft ?? 'logo')

if(!storeProductCategory.dataList || storeProductCategory.dataList.length === 0) {
  await storeProductCategory.fetchCategoryStore()
}

</script>
<template>
  <client-only>
    <PopupMenuHeader 
      v-model:isTogglePopupMenu="storeHeader.isTogglePopupMenu"
      :listMenu="storeHeader.listMenu"
      :listMenuMore="storeHeader.listMenuMore"
      :phone="storeSetting.getBaseInformation?.phone"
      :socialLinks="storeSetting.getBaseInformation?.socialLinks"
    />
    <PopupSearch />
    <PopupCart />
    <PopupEditItemToCart v-if="storeCart.getCartListItem.length > 0" />
    <PopupAddItemToCart />
    <template v-if="storeAccount.getUserId">
      <PopupAccountMenuInfo />
      <PopupMembershipInfo />
      <PopupBarcode />
      <PopupHistoryReward />
    </template>
  </client-only>

  <div class="header">
    <div class="header-fixed">
      <div class="container container-xxl">
        <div class="header-content position-relative">
          <div class="header-left text-color-white flex align-center gap-md">
            <template v-if="typeLeft === 'logo'">
              <Logo filter link />
            </template>

            <template v-else-if="typeLeft === 'address'">
              <div class="flex gap-sm align-center">
                <MaterialIcon size="30" name="location_on"/>
                <div>
                  Giao hàng tới
                  <Text class="flex cursor-pointer" @click.prevent="storeAddress.handleTogglePopupList(true, true)">
                    <Text limit="1" :text="storeCart.getNameAddressChoose || 'Chưa nhập địa chỉ'" weight="semibold" />
                    <client-only>
                      <MaterialIcon v-if="storeAccount.getUserId" name="keyboard_arrow_down"/>
                    </client-only>
                  </Text>
                </div>
              </div>
            </template>
            <template v-else>
              <client-only>
                <div v-if="storeAccount.getDetailValue?.fullname">
                  {{ storeSetting.getBaseInformation?.name }}
                  <Text :text="`Xin chào ${storeAccount.getDetailValue?.fullname || 'Quý khách' }!`" weight="semibold" />
                </div>
                <Logo v-else filter maxHeight="xl" />
              </client-only>
            </template>
          </div>
          <client-only>
            <HeaderMenu :listMenu="storeHeader.listMenu" :menuLevel="storeHeader.menuLevel" />
          </client-only>
          <div class="header-right flex gap-sm justify-end">
            <Button
              color="third"
              icon="search"
              :class="['header-search-button-toggle rd-xs', storeDisplay.isLaptop ? 'width-full max-width-250 justify-start weight-normal pl-ms pr-ms':'']"
              :label="storeDisplay.isLaptop ? 'Tìm kiếm':''"
              @click="storeSearch.handleTogglePopup(true)"
            />
            <client-only>
            <template v-if="storeDisplay.isLaptop">
              <NuxtLink v-if="!storeAccount.getUserId" :to="{ path: ROUTES.PUBLIC.LOGIN.path }">
                <Button
                  color="third"
                  icon="person"
                  class="rd-xs"
                />
              </NuxtLink>
              <Image 
                v-else
                @click="storeAccount.handleTogglePopupAccountMenuInfo(true)"
                :src="storeAccount.getDetailValue?.avatar"
                :alt="storeAccount.getDetailValue?.fullname"
                class="cursor-pointer object-fit-cover rd-xs width-xl min-width-xl height-xl border-default border-color-gray3"
                :width="44"
                preset="avatar"
              />
            </template>
            </client-only>
            <Button
              color="third"
              icon="shopping_cart"
              class="rd-xs"
              @click="storeCart.handleTogglePopup(true)"
              > <span class="header-cart-count">{{ storeCart.getCartCount }}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>