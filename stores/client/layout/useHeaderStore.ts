import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { ROUTES } from "@/shared/constants/routes";
import { useProductCategoryStore } from "../product/useProductCategoryStore";

export const useHeaderStore = defineStore("HeaderStore", () => {
  const storeProductCategory = useProductCategoryStore()

  const isTogglePopupMenu = ref<boolean>(false);

  const handleTogglePopupMenu = (value: boolean) => {
    isTogglePopupMenu.value = value;
  }

  const listMenu = computed(() => {
    return [
      ROUTES.PUBLIC.HOME,
      ROUTES.PUBLIC.ORDER,
      ROUTES.PUBLIC.PRODUCT.children?.MOST_ORDER,
      ...storeProductCategory.getMenuItems,
      ROUTES.PUBLIC.PRODUCT.children?.SALE,
    ]
  })

  const listMenuMore = computed(() => {
    return [
      ROUTES.PUBLIC.CLUB,
      ROUTES.PUBLIC.ABOUT,
      ROUTES.PUBLIC.NEWS,
      ROUTES.PUBLIC.LOGIN,
      ROUTES.PUBLIC.REGISTER,
    ]
  })

  return {
    isTogglePopupMenu,
    listMenu,
    listMenuMore,
    handleTogglePopupMenu,
  };
});
