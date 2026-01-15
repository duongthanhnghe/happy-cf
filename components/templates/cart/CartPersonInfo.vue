<script lang="ts" setup>
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore';
import { nullRules, phoneRules } from '@/utils/validation'
import { useLocationStore } from '@/stores/shared/useLocationStore';
import { usePaymentStatusStore } from '@/stores/client/order/usePaymentStatusStore'
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';

const { t } = useITranslations()
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
      <Text :text="t('cart.text2')" color="black" size="md" weight="semibold" class="flex justify-between black" />
      <div class="flex gap-xs cursor-pointer" v-if="props.userId" @click.prevent="storeAddress.handleTogglePopupList(true,true)">
        <Button tag="span" size="xs" color="secondary" icon="edit_location" class="text-color-primary">
        </Button>
        <Text :text="t('cart.text10')" color="primary" weight="medium" />
      </div>
    </div>
    <div class="row row-xs">
      <div class="col-6">
        <LabelInput :label="t('cart.text3').text" required/>
        <v-text-field type="time" v-model="store.informationOrder.time" required :rules="store.timeRules" variant="outlined" />
      </div>
      <div class="col-6">
        <LabelInput :label="t('global.text7').text" required/>
        <v-text-field type="text" required v-model="store.informationOrder.fullname" :rules="nullRules" variant="outlined" />
      </div>
      <div class="col-12 col-md-6">
        <LabelInput :label="t('global.text8').text" required/>
        <v-text-field type="tel" required v-model="store.informationOrder.phone" :rules="phoneRules" maxlength="11" variant="outlined" />
      </div>
      <div class="col-12 col-md-6">
        <LabelInput :label="t('cart.text4').text" required/>
        <v-text-field type="text" required v-model="store.informationOrder.address" :rules="nullRules" variant="outlined" />
      </div>
      <div class="col-12 col-md-4">
        <LabelInput :label="t('global.text5').text" required/>
        <v-autocomplete
          v-model="storeLocation.selectedProvince"
            :label="t('global.text6').text"
            :items="storeLocation.getListProvinces ?? []"
            item-title="PROVINCE_NAME"
            item-value="PROVINCE_ID"
            variant="outlined"
            :rules="nullRules"
          />
      </div>
      <div class="col-12 col-md-4">
        <LabelInput :label="t('global.text1').text" required/>
          <v-autocomplete
          v-model="storeLocation.selectedDistrict"
            :label="t('global.text2').text"
            :items="storeLocation.getListDistricts ?? []"
            item-title="DISTRICT_NAME"
            item-value="DISTRICT_ID"
            variant="outlined"
            :rules="nullRules"
          />
      </div>
      <div class="col-12 col-md-4">
        <LabelInput :label="t('global.text3').text" required/>
        <v-autocomplete
          v-model="storeLocation.selectedWard"
            :label="t('global.text4').text"
            :items="storeLocation.getListWards ?? []"
            item-title="WARDS_NAME"
            item-value="WARDS_ID"
            variant="outlined"
            :rules="nullRules"
          />
      </div>
    </div>

    <Text :text="t('cart.text5')" color="black" size="md" weight="semibold" class="mb-sm" />
    <v-radio-group inline v-model="store.paymentSelected" class="payment-template1-group" nameRadio="namePayment">
      <PaymentItemTemplate1 v-for="(item, index) in storePaymentStatus.getListData" :key="index" :item="item" />
    </v-radio-group>

    <Text :text="t('cart.text6').text" color="black" size="md" weight="semibold" class="mb-sm" />
    <v-textarea class="mb-0" :rows="5" v-model="store.informationOrder.note" variant="outlined" hide-details />
  </Card>
</template>