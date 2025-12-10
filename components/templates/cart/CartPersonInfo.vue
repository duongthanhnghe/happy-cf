<script lang="ts" setup>
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore';
import { nullRules, phoneRules } from '@/utils/validation'
import { useLocationStore } from '@/stores/shared/useLocationStore';
import { usePaymentStatusStore } from '@/stores/shared/order/usePaymentStatusStore'

const store = useCartStore();
const storeAddress = useAddressesManageStore();
const storeLocation = useLocationStore();
const storePaymentStatus = usePaymentStatusStore();

const props = defineProps<{
  userId: string | null;
}>();
</script>
<template>
  <Card class="rd-xl mt-sm shadow-1">
    <div class="flex justify-between mb-sm">
      <Text text="Thông tin đặt hàng" color="black" size="md" weight="semibold" class="flex justify-between black mb-sm" />
      <div class="flex gap-xs cursor-pointer" v-if="props.userId" @click.prevent="storeAddress.handleTogglePopupList(true,true)">
        <Button tag="span" size="xs" color="secondary" icon="edit_location" class="text-color-primary">
        </Button>
        <Text text="Sổ địa chỉ" color="primary" weight="medium" />
      </div>
    </div>
    <div class="row row-xs">
      <div class="col-6">
        <LabelInput label="Giờ lấy hàng" required/>
        <v-text-field type="time" v-model="store.informationOrder.time" required :rules="store.timeRules" variant="outlined" />
      </div>
      <div class="col-6">
        <LabelInput label="Họ và tên" required/>
        <v-text-field type="text" required v-model="store.informationOrder.fullname" :rules="nullRules" variant="outlined" />
      </div>
      <div class="col-12 col-md-6">
        <LabelInput label="Số điện thoại" required/>
        <v-text-field type="tel" required v-model="store.informationOrder.phone" :rules="phoneRules" maxlength="11" variant="outlined" />
      </div>
      <div class="col-12 col-md-6">
        <LabelInput label="Toà nhà, số nhà, tên đường" required/>
        <v-text-field type="text" required v-model="store.informationOrder.address" :rules="nullRules" variant="outlined" />
      </div>
      <div class="col-4">
        <LabelInput label="Thành phố" required/>
        <v-autocomplete
          v-model="storeLocation.selectedProvince"
            label="Chọn thành phố"
            :items="storeLocation.getListProvinces ?? []"
            item-title="PROVINCE_NAME"
            item-value="PROVINCE_ID"
            variant="outlined"
            :rules="nullRules"
          />
      </div>
      <div class="col-4">
        <LabelInput label="Quận/Huyện" required/>
          <v-autocomplete
          v-model="storeLocation.selectedDistrict"
            label="Chọn Quận/Huyện"
            :items="storeLocation.getListDistricts ?? []"
            item-title="DISTRICT_NAME"
            item-value="DISTRICT_ID"
            variant="outlined"
            :rules="nullRules"
          />
      </div>
      <div class="col-4">
        <LabelInput label="Phường/Xã" required/>
        <v-autocomplete
          v-model="storeLocation.selectedWard"
            label="Chọn Phường/Xã"
            :items="storeLocation.getListWards ?? []"
            item-title="WARDS_NAME"
            item-value="WARDS_ID"
            variant="outlined"
            :rules="nullRules"
          />
      </div>
    </div>

    <Text text="Thanh toán" color="black" size="md" weight="semibold" class="mb-sm" />
    <v-radio-group inline v-model="store.paymentSelected" class="payment-template1-group" nameRadio="namePayment">
      <PaymentItemTemplate1 v-for="(item, index) in storePaymentStatus.getListData" :key="index" :item="item" />
    </v-radio-group>

    <Text text="Ghi chú" color="black" size="md" weight="semibold" class="mb-sm" />
    <v-textarea class="mb-0" :rows="5" v-model="store.informationOrder.note" variant="outlined" hide-details />
  </Card>
</template>