import { ref, reactive, computed, watch } from "vue";
import { defineStore } from "pinia";
import { productsAPI } from "@/services/v1/product.service";
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { Loading } from '@/utils/global'
import type { WishlistItem } from '@/server/types/dto/v1/product.dto'

export const useWishlistStore = defineStore("WishlistStore", () => {
  const storeAccount = useAccountStore();

  const dataList = ref<WishlistItem[]|null>(null)
  const wishlistIds  = reactive(new Set<string>())
  const loadingData = ref<boolean>(false)

  const loadItems = async () => {
    const userId = storeAccount.getUserId;
    if(!userId) return
    
    loadingData.value = true
    const data = await productsAPI.getWishlistByUserId(userId);
    if(data.code === 0) dataList.value = data.data
    loadingData.value = false
  }

  const handleAddWishlist = async (productId: string) => {
    const userId = storeAccount.getUserId;
    if(!userId || !productId) {
      return
    }
    Loading(true)
    const data = await productsAPI.addToWishlist(userId, productId);
    if(data.code === 0) {
      loadItems()
      wishlistIds.add(productId)
    }
    Loading(false)
  }

  const handleDeleteWishlist = async (productId: string) => {
    const userId = storeAccount.getUserId;
    if(!userId || !productId) return

    Loading(true)
    const data = await productsAPI.removeFromWishlist(userId, productId);
    if(data.code === 0) {
      loadItems()
      wishlistIds.delete(productId)
    }
    Loading(false)
  }

  const isInWishlist = (productId: string) => wishlistIds.has(productId)

  const fetchWishlist = async (userId: string) => {
    const list = await productsAPI.getWishlistByUserId(userId)

    if(list.data?.length === 0) return
    dataList.value = list.data
    wishlistIds.clear()
    list.data?.forEach(item => wishlistIds.add(item.product.id))
  }

  watch(() => storeAccount.getDetailValue?.id, id => {
    if (id) fetchWishlist(id)
  },
  { immediate: true }
  )
      
  const getItems = computed(() => dataList.value);

  return {
    dataList,
    wishlistIds,
    loadingData,
    loadItems,
    handleAddWishlist,
    handleDeleteWishlist,
    isInWishlist,
    fetchWishlist,
    getItems,
  };
});
