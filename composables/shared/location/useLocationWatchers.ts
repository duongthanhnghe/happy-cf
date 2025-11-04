import { watch } from 'vue';

export const useLocationWatchers = (
  storeLocation: any,
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

  return {
   
  };
};