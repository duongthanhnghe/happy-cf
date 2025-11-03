import { watch } from 'vue';

export const useCartLocationWatchers = (
  storeLocation: any,
  store: any,
) => {

  watch(() => storeLocation.selectedProvince, async (newVal) => {
    if (storeLocation.isSetting) return
    
    if (newVal) {
      await storeLocation.fetchDistrictsStore(newVal)
      storeLocation.selectedDistrict = null
      storeLocation.selectedWard = null
    } else {
      storeLocation.districts = []
      storeLocation.wards = []
    }
  })

  watch(() => storeLocation.selectedDistrict, async (newVal) => {
    if (storeLocation.isSetting) return
    
    if (newVal) {
      await storeLocation.fetchWardsStore(newVal)
      storeLocation.selectedWard = null
    } else {
      storeLocation.wards = []
    }
  })

  watch(
    [() => storeLocation.selectedWard, () => store.cartListItem],
    async ([newWard, newCart]) => {
      if (newWard && newCart.length > 0) {
        await store.handleGetFee()
      } else {
        store.shippingFee = 0
      }
    },
    { immediate: true, deep: true }
  )

  return {
   
  };
};