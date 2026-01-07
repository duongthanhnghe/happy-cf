import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { ROUTES } from "@/shared/constants/routes";
import { useProductCategoryStore } from "../product/useProductCategoryStore";
import { getMenuDepth } from "@/utils/menuHelpers";
import { useDisplayStore } from "@/stores/shared/useDisplayStore";

export const useHeaderStore = defineStore("HeaderStore", () => {
  const storeProductCategory = useProductCategoryStore()
  const storeDisplay = useDisplayStore()

  const isTogglePopupMenu = ref<boolean>(false);

  const handleTogglePopupMenu = (value: boolean) => {
    isTogglePopupMenu.value = value;
  }

  const listMenu = computed(() => {
    const productMenus = storeDisplay.isLaptop
      ? [
          ...storeProductCategory.getMenuItems.slice(0, 2),
          ...(storeProductCategory.getMenuItems.length > 2
            ? [storeProductCategory.getMenuMain]
            : []),
        ]
      : storeProductCategory.getMenuItems

    return [
      ROUTES.PUBLIC.HOME,
      ROUTES.PUBLIC.ORDER,
      ROUTES.PUBLIC.PRODUCT.children?.MOST_ORDER,
      ...productMenus,
      ROUTES.PUBLIC.PRODUCT.children?.SALE,
    ]
  })

  const listMenuMore = computed(() => {
    return [
      ROUTES.PUBLIC.PAGE?.children?.POINT_CLUB,
      ROUTES.PUBLIC.ABOUT,
      ROUTES.PUBLIC.NEWS?.children?.MAIN,
      ROUTES.PUBLIC.LOGIN,
      ROUTES.PUBLIC.REGISTER,
    ]
  })

  const menuLevel = computed(() => {
    return getMenuDepth(storeProductCategory.getMenuItems)
  })

  return {
    isTogglePopupMenu,
    listMenu,
    listMenuMore,
    menuLevel,
    handleTogglePopupMenu,
  };
});
