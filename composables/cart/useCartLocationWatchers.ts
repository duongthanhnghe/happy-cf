import { watch } from 'vue';

export const useCartLocationWatchers = (
  storeLocation: any,
  store: any,
) => {

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