import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { ROUTES } from "@/shared/constants/routes";
import { useProductCategoryStore } from "../product/useProductCategoryStore";
import { getMenuDepth } from "@/utils/menuHelpers";
import { useDisplayStore } from "@/stores/shared/useDisplayStore";
import { useAccountStore } from "../users/useAccountStore";

export const useHeaderStore = defineStore("HeaderStore", () => {
  const storeProductCategory = useProductCategoryStore()
  const storeDisplay = useDisplayStore()
  const storeAccount = useAccountStore()

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

  const listMenuProductLeft = computed(() => {
    const productMenus = storeProductCategory.getMenuItems

    return [
      ...productMenus,
    ]
  })

  const listMenuMore = computed(() => {
    return [
      ...storeAccount.accountMenuInfo,
      ROUTES.PUBLIC.ABOUT,
      ROUTES.PUBLIC.NEWS?.children?.MAIN,
      ROUTES.PUBLIC.LOGIN,
      ROUTES.PUBLIC.REGISTER,
    ]
  })

  const listHeaderSubMenu = computed(() => {
    return [
      ROUTES.PUBLIC.ACCOUNT.children!.WALLET_VOUCHER,
      { label: 'Hoàn tiền', path: ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.path , icon: 'paid' },
      { label: 'Hạng thành viên', path: ROUTES.PUBLIC.PAGE.children?.POINT_CLUB.path , icon: 'crown' },
      ROUTES.PUBLIC.ACCOUNT.children!.INFO,
    ]
  })

  const listHeaderSubMenuLeft = computed(() => {
    return [
      { label: 'Tất cả sản phẩm', action: () => handleTogglePopupMenu(true), icon: 'menu' },
      ROUTES.PUBLIC.ABOUT,
      ROUTES.PUBLIC.NEWS.children!.MAIN,
    ]
  })

  const menuLevel = computed(() => {
    return getMenuDepth(storeProductCategory.getMenuItems)
  })

  return {
    isTogglePopupMenu,
    listMenu,
    listMenuMore,
    listMenuProductLeft,
    menuLevel,
    listHeaderSubMenu,
    listHeaderSubMenuLeft,
    handleTogglePopupMenu,
  };
});
