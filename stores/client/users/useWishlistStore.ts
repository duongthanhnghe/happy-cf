import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import type { WishlistItem } from '@/server/types/dto/v1/product.dto'
import { useWishlistUtils } from "@/composables/user/useWishlistUtils";

export const useWishlistStore = defineStore("WishlistStore", () => {
  const storeAccount = useAccountStore();

  const dataList = ref<WishlistItem[]|null>(null)
  const wishlistIds  = reactive(new Set<string>())
  const loadingData = ref<boolean>(false)
  const loaded = ref<boolean>(false);

  const utils = useWishlistUtils(
    dataList,
    wishlistIds,
    loadingData,
    storeAccount.getUserId,
    loaded,
    () => { loaded.value = true }
  );

  const getItems = computed(() => dataList.value);

  return {
    dataList,
    wishlistIds,
    loadingData,
    loaded,
    ...utils,
    getItems,
  };
});
