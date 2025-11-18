<script lang="ts" setup>
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore';
import { nullRules, phoneRules } from '@/utils/validation'
import { useLocationStore } from '@/stores/shared/useLocationStore';
import { usePaymentStatusStore } from '@/stores/shared/usePaymentStatusStore'

const store = useCartStore();
const storeAddress = useAddressesManageStore();
const storeLocation = useLocationStore();
const storePaymentStatus = usePaymentStatusStore();

const props = defineProps<{
  userId: string;
}>();
</script>
<template>
  <Card class="rd-xl mt-sm shadow-1">
    <Text color="black" size="md" weight="semibold" class="flex justify-between black mb-sm">
      Thông tin đặt hàng
      <slot v-if="props.userId">
        <Button @click.prevent="storeAddress.handleTogglePopupList(true,true)" size="xs" color="secondary" icon="keyboard_arrow_right"/>
      </slot>
    </Text>
    <div class="row row-xs">
      <div class="col-6">
        <LabelInput label="Giờ lấy hang" required/>
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
        <LabelInput label="Quan huyen" required/>
          <v-autocomplete
          v-model="storeLocation.selectedDistrict"
            label="Chọn quan huyen"
            :items="storeLocation.getListDistricts ?? []"
            item-title="DISTRICT_NAME"
            item-value="DISTRICT_ID"
            variant="outlined"
            :rules="nullRules"
          />
      </div>
      <div class="col-4">
        <LabelInput label="Phuong xa" required/>
        <v-autocomplete
          v-model="storeLocation.selectedWard"
            label="Chọn phuong xa"
            :items="storeLocation.getListWards ?? []"
            item-title="WARDS_NAME"
            item-value="WARDS_ID"
            variant="outlined"
            :rules="nullRules"
          />
      </div>
    </div>

    <Text text="Thanh toan" color="black" size="md" weight="semibold" class="mb-sm" />
    <v-radio-group inline v-model="store.paymentSelected" class="payment-template1-group" nameRadio="namePayment">
      <PaymentItemTemplate1 v-for="(item, index) in storePaymentStatus.getListData" :key="index" :item="item" />
    </v-radio-group>

    <Text text="Ghi chu" color="black" size="md" weight="semibold" class="mb-sm" />
    <v-textarea class="mb-0" :rows="5" v-model="store.informationOrder.note" variant="outlined" hide-details />
  </Card>
</template>