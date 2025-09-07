import { ref, reactive, computed, watch } from "vue";
import { defineStore } from "pinia";
import { productsAPI } from "@/services/product.service";
import type { WishlistItem } from '@/server/types/dto/product.dto'
import {
  useAccountStore
} from '@/stores/users/useAccountStore';
import {
  Loading
} from '@/utils/global'
import { showConfirm, showSuccess } from "@/utils/toast";

export const useWishlistStore = defineStore("Wishlist", () => {
  //store
  const storeAccount = useAccountStore();

  //state
  const dataList = ref<WishlistItem[]|null>(null)
  const wishlistIds  = reactive(new Set<string>())
  const isTogglePopupAdd = ref(false);

  //actions list
  const loadItems = async () => {
    const userId = storeAccount.getDetailValue?.id;
    if(!userId) return
    const data = await productsAPI.getWishlistByUserId(userId);
   
    // const parse = await Promise.all(
    //   data.data.map(async (items) => {
    //     await fetchDetailProduct(items?.productId)
    //     return {
    //       ...items,
    //       itemProduct: getDetailProduct.value
    //     }
    //   })
    // ) as WishlistItem[]|null;
    if(data.code === 0) dataList.value = data.data
  }

  // actions global
  const handleTogglePopupAdd = (value: boolean) => {
    if(!dataList.value) loadItems()
    isTogglePopupAdd.value = value
  }

  const handleAddWishlist = async (productId: string) => {
    Loading(true)
    const userId = storeAccount.getDetailValue?.id;
    if(!userId || !productId) {
      Loading(false)
      return
    } 
    const data = await productsAPI.addToWishlist(userId, productId);
    if(data.code === 0) {
      loadItems()
      wishlistIds.add(productId)
    }
    Loading(false)
  }

  const handleDeleteWishlist = async (productId: string) => {
    const confirm = await showConfirm('Bạn có chắc xoá mục này?')
    if (!confirm) return

    const userId = storeAccount.getDetailValue?.id;
    if(!userId || !productId) return

    Loading(true)
    const data = await productsAPI.removeFromWishlist(userId, productId);
    if(data.code === 0) {
      showSuccess('Xoa thanh cong')
      loadItems()
      wishlistIds.delete(productId)
    }
    Loading(false)
  }

  const isInWishlist = (productId: string) => wishlistIds.has(productId)

  const fetchWishlist = async (userId: string) => {
    const list = await productsAPI.getWishlistByUserId(userId)

    if(list.data.length === 0) return
    wishlistIds.clear()
    list.data.forEach(item => wishlistIds.add(item.productId._id.toString()))
  }

  watch(() => storeAccount.getDetailValue?.id, id => {
    if (id) fetchWishlist(id)
  },
  { immediate: true }
  )
      
  //getters
  const getListOrders = computed(() => dataList.value);

  return {
    // state
    dataList,
    isTogglePopupAdd,
    wishlistIds,

    // actions
    loadItems,
    handleTogglePopupAdd,
    handleAddWishlist,
    handleDeleteWishlist,
    isInWishlist,
    fetchWishlist,
    //getters
    getListOrders,
  };
});
