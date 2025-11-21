<script lang="ts" setup>
import { formatCurrency } from '@/utils/global';
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const store = useCartStore();
const storeDisplay = useDisplayStore()
const props = defineProps<{
  userId: string | null;
  balancePoint: number;
}>();
</script>
<template>
  <Card class="rd-xl mt-sm shadow-1 mt-ms">
    <div class="flex gap-xs align-baseline">
      <Text text="Chi tiet thanh toan" color="black" size="md" weight="semibold" />
      <Text v-if="!storeDisplay.isMobileTable" color="green" :text="`(Tiet kiem: ${ formatCurrency(store.getTotalPriceSave)})`" />
    </div>

    <div class="line-height-1 flex justify-between mt-sm">
      <Text color="gray5" text="Thanh tien" />
      <Text size="md" weight="semibold" class="black">{{ formatCurrency(store.getTotalPriceDiscount) }} </Text>
    </div>

    <Text v-if="store.getTotalPriceSave != 0" color="gray5" class="flex justify-between mt-xs">
    Don hang <span>{{ formatCurrency(store.getTotalPriceCurrent) }}</span>
    </Text>

    <Text color="gray5" class="flex justify-between mt-xs">
    Phi van chuyen: <span>{{ formatCurrency(store.getShippingFee) }}</span>
    </Text>

    <Text v-if="store.discountVoucherFreeship" color="gray5" class="flex justify-between mt-xs">
    Voucher phi van chuyen: <span>-{{ formatCurrency(store.discountVoucherFreeship) }}</span>
    </Text>

    <Text v-if="store.discountVoucher" color="gray5" class="flex justify-between mt-xs">
    Voucher giảm giá: <span>-{{ formatCurrency(store.discountVoucher) }}</span>
    </Text>

    <Text v-if="store.getOrderPriceDiscount != 0" color="gray5" class="flex justify-between mt-xs">
    Giam don hang <span>-{{ formatCurrency(store.getOrderPriceDiscount) }}</span>
    </Text>

    <Text v-if="store.usedPointOrder.usedPoint != 0" color="gray5" class="flex justify-between mt-xs">
    Point <span>-{{ formatCurrency(store.usedPointOrder.usedPoint) }}</span>
    </Text>

    <Text v-if="store.totalDiscountRateMembership != 0" color="gray5" class="flex justify-between mt-xs">
    Uu dai thanh vien <span>-{{ formatCurrency(store.totalDiscountRateMembership) }}</span>
    </Text>

    <Text v-if="store.getTotalPriceDiscount != 0 && props.userId" color="gray5" class="flex justify-between mt-xs">
      Hoan tien point
      <Text color="danger" :text="`+${ formatCurrency(store.getTotalPoint).replace('đ','') }`" />
    </Text>

    <template v-if="storeDisplay.isMobileTable">
      <div class="cart-mb-submit shadow-2">
        <div class="flex justify-between cart-mb-submit-item" @click.prevent="store.handleTogglePopupVoucher(true)">
          <Text color="gray5" text="Voucher" />
          <div v-if="store.selectedVoucher || store.selectedFreeship" class="flex align-center gap-xs">
            <CartVoucherListText v-if="store.voucherUsage.length > 0" />
            <MaterialIcon name="keyboard_arrow_right"/>
          </div>
          <Text v-else color="gray5" class="line-height-1 flex align-center gap-xs">
            Chon voucher
            <MaterialIcon name="keyboard_arrow_right"/>
          </Text>
        </div>

        <div v-if="props.userId" class="flex justify-between cart-mb-submit-item" @click.prevent="store.handleTogglePopupPoint(true)">
          <Text color="gray5" text="Point" />
          <Text v-if="!store.usedPointOrder.pointInput" color="gray5" class="line-height-1 flex align-center gap-xs">
            Dang co: {{ formatCurrency(props.balancePoint).replace('đ','') }}
            <MaterialIcon name="keyboard_arrow_right"/>
          </Text>
          <Text v-else color="gray5" class="line-height-1 flex align-center gap-xs">
            Su dung: <Text color="primary" weight="semibold" :text="formatCurrency(store.usedPointOrder.pointInput).replace('đ','')" />
            <MaterialIcon name="keyboard_arrow_right"/>
          </Text>
        </div>

        <div class="flex justify-between">
          <div>
          <Text color="gray5" text="Thanh tien" />
          <Text color="green" :text="`Tiet kiem: ${ formatCurrency(store.getTotalPriceSave) }`" />
          </div>
          <Text size="md" weight="semibold" class="black">{{ formatCurrency(store.getTotalPriceDiscount) }} </Text>
        </div>
        <Button type="submit" label="Dat hang" color="primary" class="mt-xs w-full" />
      </div>
    </template>
    <template v-else>
      <Button type="submit" label="Dat hang" color="primary" class="mt-sm w-full" />
    </template>
  </Card>
</template>