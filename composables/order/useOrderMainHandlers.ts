import { watchEffect, ref } from 'vue';
import { ROUTES } from '@/shared/constants/routes';

export const useOrderMainHandlers = async (
  storeProductMostOrder: any,
  storeProductSale: any,
  storeProductCategory: any,
) => {

  const tab = ref<number|null>(null)
  const tabs = [
    { value: 1, icon: ROUTES.PUBLIC.ORDER.icon, label: ROUTES.PUBLIC.ORDER.label },
    { value: 2, icon: ROUTES.PUBLIC.PRODUCT.children?.MOST_ORDER.icon, label: ROUTES.PUBLIC.PRODUCT.children?.MOST_ORDER.label },
    { value: 3, icon: ROUTES.PUBLIC.PRODUCT.children?.SALE.icon, label: ROUTES.PUBLIC.PRODUCT.children?.SALE.label },
  ]

  await storeProductCategory.fetchCategoryStore()

  watchEffect(async() => {
    if (tab.value === 2 && !storeProductMostOrder.getListProductMostOrder) await storeProductMostOrder.fetchListProductMostOrder('',storeProductMostOrder.page,storeProductMostOrder.limit,'')
    if (tab.value === 3 && !storeProductSale.getListProductSales) await storeProductSale.fetchListProductSales('',storeProductSale.page,storeProductSale.limit,'')
  })

  return {
    tab,
    tabs,
  };
};