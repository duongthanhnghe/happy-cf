import { type Reactive, type Ref, watch } from 'vue';
import type { WishlistItem } from '@/server/types/dto/v1/product.dto';
import { Loading } from '@/utils/global';
import { productsAPI } from '@/services/v1/product.service';

export const useWishlistUtils = (
  dataList: Ref<WishlistItem[]|null>,
  wishlistIds: Reactive<Set<string>>,
  loadingData: Ref<boolean>,
  userId: string,
) => {

  const loadItems = async () => {
    if(!userId) return
    
    loadingData.value = true
    const data = await productsAPI.getWishlistByUserId(userId);
    if(data.code === 0) dataList.value = data.data
    loadingData.value = false
  }

  const handleAddWishlist = async (productId: string) => {
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

  watch(() => userId, id => {
    if (id) fetchWishlist(id)
  },
  { immediate: true }
  )

  return {
    loadItems,
    handleAddWishlist,
    handleDeleteWishlist,
    isInWishlist,
    fetchWishlist,
  };
};