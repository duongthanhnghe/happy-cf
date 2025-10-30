<script lang="ts" setup>
import './index.scss';

// const store = useAccountStore();
// const storeAccountEdit = useAccountEditStore()
// const storeAddress = useAddressesManageStore();
// const storeOrder = useOrderHistoryStore();
// const storeWishlist = useWishlistStore();
// const storeProductReview = useProductReviewByUserStore();
// const storeHistoryReward = useHistoryRewardByUserStore();
// const storeLocation = useLocationStore();

// const menuAccount = [
//   { label: 'Thong tin ca nhan', icon:'person', action: () => storeAccountEdit.handleEditAccount() },
//   { label: 'Dia chi da luu', icon:'edit_location', action: () => storeAddress.handleTogglePopupList(true,false) },
//   { label: 'Lich su don hang', icon:'prescriptions', action: () => storeOrder.handleTogglePopupAdd(true) },
//   { label: 'Danh sach yeu thich', icon:'favorite', action: () => storeWishlist.handleTogglePopupAdd(true) },
//   { label: 'Danh gia', icon:'comment', action: () => storeProductReview.handleTogglePopup(true) },
//   { label: 'Lich su tich diem', icon:'comment', action: () => storeHistoryReward.handleTogglePopup(true) },
//   { label: 'Dang xuat', icon:'logout', action: () => store.handleLogout() },
// ]

// const cardItemClass= 'card card-sm bg-white';

// watch(() => storeLocation.selectedProvince, async (newVal) => {
//   if (storeLocation.isSetting) return
  
//   if (newVal) {
//     await storeLocation.fetchDistrictsStore(newVal)
//     storeLocation.selectedDistrict = null
//     storeLocation.selectedWard = null
//   } else {
//     storeLocation.districts = []
//     storeLocation.wards = []
//   }
// })

// watch(() => storeLocation.selectedDistrict, async (newVal) => {
//   if (storeLocation.isSetting) return
  
//   if (newVal) {
//     await storeLocation.fetchWardsStore(newVal)
//     storeLocation.selectedWard = null
//   } else {
//     storeLocation.wards = []
//   }
// })

</script>
<template>

</template>