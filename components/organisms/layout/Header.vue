<script lang="ts" setup>
import '@/styles/molecules/layout/header.scss';
import { onMounted } from 'vue'
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useSearchStore } from '@/stores/client/product/useSearchStore'
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore'
import { useBaseInformationStore } from '@/stores/shared/setting/useBaseInformationStore';
import { ROUTES } from '@/shared/constants/routes';
import { useRoute } from 'vue-router'
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import type { MenuItem } from '@/server/types/common/menu-item';

const storeSetting = useBaseInformationStore();
const storeCart = useCartStore()
const storeAccount = useAccountStore()
const storeSearch = useSearchStore()
const storeAddress = useAddressesManageStore()
const route = useRoute()
const storeDisplay = useDisplayStore()

const props = defineProps({
  typeLeft: {
    type: String,
    default: 'logo',
    validator: (value: string) => ['logo', 'address','name'].includes(value)
  }
})

const listMenu: MenuItem[] = [
  ROUTES.PUBLIC.HOME,
  ROUTES.PUBLIC.ORDER,
  ROUTES.PUBLIC.ABOUT,
  ROUTES.PUBLIC.NEWS.children!.MAIN,
]

onMounted(async () => {
  if(storeCart.getCartListItem.length > 0) {
    await storeCart.fetchProductCart();
  } 
})

</script>
<template>
  <PopupSearch />
  <PopupCart />
  <PopupEditItemToCart v-if="storeCart.getCartListItem.length > 0" />
  <PopupAddItemToCart />
  <client-only>
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
        <div class="header-content">
          <div class="header-left text-color-white flex align-center gap-md">
            <template v-if="props.typeLeft === 'logo'">
              <NuxtLink :to="{ path: ROUTES.PUBLIC.HOME.path }">
                <img v-if="storeSetting.getBaseInformation?.logoUrl" class="header-logo" :src="storeSetting.getBaseInformation?.logoUrl" :alt="storeSetting.getBaseInformation?.name" />
              </NuxtLink>
            </template>

            <template v-else-if="props.typeLeft === 'address'">
              <div class="flex gap-sm align-center">
                <MaterialIcon size="30" name="location_on"/>
                <div>
                  Giao hàng tới
                  <Text class="flex cursor-pointer" @click.prevent="storeAddress.handleTogglePopupList(true, true)">
                    <Text limit="1" :text="storeCart.getNameAddressChoose || 'Chưa nhập địa chỉ'" weight="semibold" />
                    <MaterialIcon size="24" name="keyboard_arrow_down"/>
                  </Text>
                </div>
              </div>
            </template>
            <template v-else>
              <div>
                {{ storeSetting.getBaseInformation?.name }}
                <Text :text="`Xin chào ${storeAccount.getDetailValue?.fullname || 'Quý khách' }!`" weight="semibold" />
              </div>
            </template>
          </div>
          <div v-if="storeDisplay.isLaptop" class="header-center flex gap-xs">
            <template v-for="(item,index) in listMenu" :key="index">
              <router-link
                v-if="item.path"
                :to="{ path: item.path }"
                :class="['header-menu-href',{ active: route.path === item.path }]"
              >
                <Button color="transparent" :label="item.label"/>
              </router-link>
            </template>
          </div>
          <div class="header-right flex gap-sm">
            <Button
              color="third"
              icon="search"
              :class="['header-search-button-toggle rd-xs', storeDisplay.isLaptop ? 'min-width-300 justify-start weight-normal pl-ms pr-ms':'']"
              :label="storeDisplay.isLaptop ? 'Tim kiem':''"
              @click="storeSearch.handleTogglePopup(true)"
            />
            <template v-if="storeDisplay.isLaptop">
              <NuxtLink v-if="!storeAccount.getUserId" :to="{ path: ROUTES.PUBLIC.LOGIN.path }">
                <Button
                  color="third"
                  icon="person"
                  class="rd-xs"
                />
              </NuxtLink>
              <Button
                v-else
                color="third"
                icon="person"
                class="rd-xs"
                @click="storeAccount.handleTogglePopupAccountMenuInfo(true)"
              />
            </template>
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