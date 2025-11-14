<script lang="ts" setup>
import '@/styles/molecules/layout/header.scss';
import { onMounted } from 'vue'
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useSearchStore } from '@/stores/client/product/useSearchStore'
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore'
import { useBaseInformationStore } from '@/stores/shared/setting/useBaseInformationStore';
import { ROUTES } from '@/shared/constants/routes';

const storeSetting = useBaseInformationStore();
const storeCart = useCartStore()
const storeAccount = useAccountStore()
const storeSearch = useSearchStore()
const storeAddress = useAddressesManageStore()

const props = defineProps({
  typeLeft: {
    type: String,
    default: 'logo',
    validator: (value: string) => ['logo', 'address','name'].includes(value)
  }
})

onMounted(async () => {
  if(storeCart.getCartListItem.length > 0) {
    await storeCart.fetchProductCart();
  } 
})

</script>
<template>
  <PopupSearch />
  <PopupCart />
  <PopupEditItemToCart />
  <PopupAddItemToCart />

  <div class="header">
    <div class="header-fixed">
      <div class="container">
        <div class="header-content">
          <Text color="white" weight="semibold" class="header-left">
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
                    <Text limit="1" :text="storeCart.getNameAddressChoose || 'Chưa nhập địa chỉ'" />
                    <MaterialIcon size="24" name="keyboard_arrow_down"/>
                  </Text>
                </div>
              </div>
            </template>
            <template v-else>
              {{ storeSetting.getBaseInformation?.name }}
              <div>
                Xin chào {{ storeAccount.getDetailValue?.fullname || 'Quý khách' }}!
              </div>
            </template>
          </Text>
          <div class="header-right flex gap-sm">
            <Button
              color="third"
              icon="search"
              class="rd-xs"
              @click="storeSearch.handleTogglePopup(true)"
            />
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