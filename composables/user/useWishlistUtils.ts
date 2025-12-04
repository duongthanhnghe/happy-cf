import { type Reactive, type Ref } from 'vue';
import type { WishlistItem } from '@/server/types/dto/v1/product.dto';
import { Loading } from '@/utils/global';
import { productsAPI } from '@/services/v1/product.service';

export const useWishlistUtils = (
  dataList: Ref<WishlistItem[]|null>,
  wishlistIds: Reactive<Set<string>>,
  loadingData: Ref<boolean>,
  userId: Ref<string | null>,
  loaded: Ref<boolean>,
  onLoaded?: () => void 
) => {

  const loadItems = async () => {
    if(!userId.value) return
    
    loadingData.value = true
    const data = await productsAPI.getWishlistByUserId(userId.value);
    if(data.code === 0) dataList.value = data.data
    loadingData.value = false
  }

  const handleAddWishlist = async (productId: string) => {
    if(!userId.value || !productId) {
      return
    }
    Loading(true)
    const data = await productsAPI.addToWishlist(userId.value, productId);
    if(data.code === 0) {
      loadItems()
      wishlistIds.add(productId)
    }
    Loading(false)
  }

  const handleDeleteWishlist = async (productId: string) => {
    if(!userId.value || !productId) return

    Loading(true)
    const data = await productsAPI.removeFromWishlist(userId.value, productId);
    if(data.code === 0) {
      loadItems()
      wishlistIds.delete(productId)
    }
    Loading(false)
  }

  const isInWishlist = (productId: string) => wishlistIds.has(productId)

  const fetchWishlist = async (userId: string) => {
    if(!userId) return
    loaded.value = false

    const list = await productsAPI.getWishlistByUserId(userId)

    if(list.data?.length === 0) return
    dataList.value = list.data
    wishlistIds.clear()
    list.data?.forEach(item => wishlistIds.add(item.product.id))

    loaded.value = true
    if(onLoaded) onLoaded()
  }

  return {
    loadItems,
    handleAddWishlist,
    handleDeleteWishlist,
    isInWishlist,
    fetchWishlist,
  };
};