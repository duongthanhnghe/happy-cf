
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'CreateBanner': typeof import("../components/admin/banners/CreateBanner.vue")['default']
    'UpdateBanner': typeof import("../components/admin/banners/UpdateBanner.vue")['default']
    'HeaderAdmin': typeof import("../components/admin/layout/HeaderAdmin.vue")['default']
    'Sidebar': typeof import("../components/admin/layout/Sidebar.vue")['default']
    'CreateCategoryNews': typeof import("../components/admin/news/CreateCategoryNews.vue")['default']
    'CreatePost': typeof import("../components/admin/news/CreatePost.vue")['default']
    'UpdateCategoryNews': typeof import("../components/admin/news/UpdateCategoryNews.vue")['default']
    'UpdatePost': typeof import("../components/admin/news/UpdatePost.vue")['default']
    'CreateCategoryProduct': typeof import("../components/admin/products/CreateCategoryProduct.vue")['default']
    'CreateProduct': typeof import("../components/admin/products/CreateProduct.vue")['default']
    'CreateVariantProduct': typeof import("../components/admin/products/CreateVariantProduct.vue")['default']
    'UpdateCategoryProduct': typeof import("../components/admin/products/UpdateCategoryProduct.vue")['default']
    'UpdateProduct': typeof import("../components/admin/products/UpdateProduct.vue")['default']
    'DetailAccount': typeof import("../components/admin/users/DetailAccount.vue")['default']
    'AvatarEdit': typeof import("../components/atoms/AvatarEdit.vue")['default']
    'Button': typeof import("../components/atoms/Button.vue")['default']
    'CKEditorCDN': typeof import("../components/atoms/CKEditorCDN.vue")['default']
    'CKEditorCDNBackup': typeof import("../components/atoms/CKEditorCDNBackup.vue")['default']
    'ControlImage': typeof import("../components/atoms/ControlImage.vue")['default']
    'FirstLoader': typeof import("../components/atoms/FirstLoader.vue")['default']
    'Heading': typeof import("../components/atoms/Heading.vue")['default']
    'LabelInput': typeof import("../components/atoms/LabelInput.vue")['default']
    'Loading': typeof import("../components/atoms/Loading.vue")['default']
    'MaterialIcon': typeof import("../components/atoms/MaterialIcon.vue")['default']
    'NoData': typeof import("../components/atoms/NoData.vue")['default']
    'Popup': typeof import("../components/atoms/Popup.vue")['default']
    'SelectOrder': typeof import("../components/atoms/SelectOrder.vue")['default']
    'Facebook': typeof import("../components/atoms/icons/Facebook.vue")['default']
    'Instagram': typeof import("../components/atoms/icons/Instagram.vue")['default']
    'Tiktok': typeof import("../components/atoms/icons/Tiktok.vue")['default']
    'CartItemTemplate1': typeof import("../components/molecules/cart/CartItemTemplate1.vue")['default']
    'CartItemTemplate2': typeof import("../components/molecules/cart/CartItemTemplate2.vue")['default']
    'FileImageItem': typeof import("../components/molecules/file-manage/FileImageItem.vue")['default']
    'Pagination': typeof import("../components/molecules/global/Pagination.vue")['default']
    'NewsItemTemplate1': typeof import("../components/molecules/news/NewsItemTemplate1.vue")['default']
    'OrderItemDetailTemplate1': typeof import("../components/molecules/order/OrderItemDetailTemplate1.vue")['default']
    'OrderItemTemplate1': typeof import("../components/molecules/order/OrderItemTemplate1.vue")['default']
    'PaymentItemTemplate1': typeof import("../components/molecules/order/PaymentItemTemplate1.vue")['default']
    'ProductItemTemplate1': typeof import("../components/molecules/product/ProductItemTemplate1.vue")['default']
    'ProductItemWishlistTemplate': typeof import("../components/molecules/product/ProductItemWishlistTemplate.vue")['default']
    'SectionBanner': typeof import("../components/organisms/banner/SectionBanner.vue")['default']
    'Footer': typeof import("../components/organisms/layout/Footer.vue")['default']
    'Header': typeof import("../components/organisms/layout/Header.vue")['default']
    'MenuBottom': typeof import("../components/organisms/layout/MenuBottom.vue")['default']
    'SectionNewsLatest': typeof import("../components/organisms/news/SectionNewsLatest.vue")['default']
    'ProductCategoryMenu': typeof import("../components/organisms/product/ProductCategoryMenu/index.vue")['default']
    'UseProductCategoryMenu': typeof import("../components/organisms/product/ProductCategoryMenu/useProductCategoryMenu")['default']
    'SectionProductList': typeof import("../components/organisms/product/SectionProductList.vue")['default']
    'SectionProductMostOrder': typeof import("../components/organisms/product/SectionProductMostOrder.vue")['default']
    'SectionProductSales': typeof import("../components/organisms/product/SectionProductSales.vue")['default']
    'PopupBarcode': typeof import("../components/organisms/user/PopupBarcode.vue")['default']
    'SectionAccount': typeof import("../components/organisms/user/SectionAccount.vue")['default']
    'CreateAbout': typeof import("../components/templates/about/CreateAbout.vue")['default']
    'UpdateAbout': typeof import("../components/templates/about/UpdateAbout.vue")['default']
    'PopupAddItemToCart': typeof import("../components/templates/cart/PopupAddItemToCart.vue")['default']
    'PopupCart': typeof import("../components/templates/cart/PopupCart.vue")['default']
    'PopupEditItemToCart': typeof import("../components/templates/cart/PopupEditItemToCart.vue")['default']
    'FileManageFolder': typeof import("../components/templates/file-manage/FileManageFolder.vue")['default']
    'FileManageImage': typeof import("../components/templates/file-manage/FileManageImage.vue")['default']
    'PopupFileManageImage': typeof import("../components/templates/file-manage/PopupFileManageImage.vue")['default']
    'OrderMain': typeof import("../components/templates/order/OrderMain/index.vue")['default']
    'PopupOrderDetail': typeof import("../components/templates/order/PopupOrderDetail.vue")['default']
    'PopupSearch': typeof import("../components/templates/product/PopupSearch.vue")['default']
    'PopupChangePassword': typeof import("../components/templates/user/PopupChangePassword.vue")['default']
    'PopupOrderHistory': typeof import("../components/templates/user/PopupOrderHistory.vue")['default']
    'PopupUpdateAccount': typeof import("../components/templates/user/PopupUpdateAccount.vue")['default']
    'PopupWishlist': typeof import("../components/templates/user/PopupWishlist.vue")['default']
    'PopupCreateAddress': typeof import("../components/templates/user/address/PopupCreateAddress.vue")['default']
    'PopupManageAddress': typeof import("../components/templates/user/address/PopupManageAddress.vue")['default']
    'PopupUpdateAddress': typeof import("../components/templates/user/address/PopupUpdateAddress.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyCreateBanner': LazyComponent<typeof import("../components/admin/banners/CreateBanner.vue")['default']>
    'LazyUpdateBanner': LazyComponent<typeof import("../components/admin/banners/UpdateBanner.vue")['default']>
    'LazyHeaderAdmin': LazyComponent<typeof import("../components/admin/layout/HeaderAdmin.vue")['default']>
    'LazySidebar': LazyComponent<typeof import("../components/admin/layout/Sidebar.vue")['default']>
    'LazyCreateCategoryNews': LazyComponent<typeof import("../components/admin/news/CreateCategoryNews.vue")['default']>
    'LazyCreatePost': LazyComponent<typeof import("../components/admin/news/CreatePost.vue")['default']>
    'LazyUpdateCategoryNews': LazyComponent<typeof import("../components/admin/news/UpdateCategoryNews.vue")['default']>
    'LazyUpdatePost': LazyComponent<typeof import("../components/admin/news/UpdatePost.vue")['default']>
    'LazyCreateCategoryProduct': LazyComponent<typeof import("../components/admin/products/CreateCategoryProduct.vue")['default']>
    'LazyCreateProduct': LazyComponent<typeof import("../components/admin/products/CreateProduct.vue")['default']>
    'LazyCreateVariantProduct': LazyComponent<typeof import("../components/admin/products/CreateVariantProduct.vue")['default']>
    'LazyUpdateCategoryProduct': LazyComponent<typeof import("../components/admin/products/UpdateCategoryProduct.vue")['default']>
    'LazyUpdateProduct': LazyComponent<typeof import("../components/admin/products/UpdateProduct.vue")['default']>
    'LazyDetailAccount': LazyComponent<typeof import("../components/admin/users/DetailAccount.vue")['default']>
    'LazyAvatarEdit': LazyComponent<typeof import("../components/atoms/AvatarEdit.vue")['default']>
    'LazyButton': LazyComponent<typeof import("../components/atoms/Button.vue")['default']>
    'LazyCKEditorCDN': LazyComponent<typeof import("../components/atoms/CKEditorCDN.vue")['default']>
    'LazyCKEditorCDNBackup': LazyComponent<typeof import("../components/atoms/CKEditorCDNBackup.vue")['default']>
    'LazyControlImage': LazyComponent<typeof import("../components/atoms/ControlImage.vue")['default']>
    'LazyFirstLoader': LazyComponent<typeof import("../components/atoms/FirstLoader.vue")['default']>
    'LazyHeading': LazyComponent<typeof import("../components/atoms/Heading.vue")['default']>
    'LazyLabelInput': LazyComponent<typeof import("../components/atoms/LabelInput.vue")['default']>
    'LazyLoading': LazyComponent<typeof import("../components/atoms/Loading.vue")['default']>
    'LazyMaterialIcon': LazyComponent<typeof import("../components/atoms/MaterialIcon.vue")['default']>
    'LazyNoData': LazyComponent<typeof import("../components/atoms/NoData.vue")['default']>
    'LazyPopup': LazyComponent<typeof import("../components/atoms/Popup.vue")['default']>
    'LazySelectOrder': LazyComponent<typeof import("../components/atoms/SelectOrder.vue")['default']>
    'LazyFacebook': LazyComponent<typeof import("../components/atoms/icons/Facebook.vue")['default']>
    'LazyInstagram': LazyComponent<typeof import("../components/atoms/icons/Instagram.vue")['default']>
    'LazyTiktok': LazyComponent<typeof import("../components/atoms/icons/Tiktok.vue")['default']>
    'LazyCartItemTemplate1': LazyComponent<typeof import("../components/molecules/cart/CartItemTemplate1.vue")['default']>
    'LazyCartItemTemplate2': LazyComponent<typeof import("../components/molecules/cart/CartItemTemplate2.vue")['default']>
    'LazyFileImageItem': LazyComponent<typeof import("../components/molecules/file-manage/FileImageItem.vue")['default']>
    'LazyPagination': LazyComponent<typeof import("../components/molecules/global/Pagination.vue")['default']>
    'LazyNewsItemTemplate1': LazyComponent<typeof import("../components/molecules/news/NewsItemTemplate1.vue")['default']>
    'LazyOrderItemDetailTemplate1': LazyComponent<typeof import("../components/molecules/order/OrderItemDetailTemplate1.vue")['default']>
    'LazyOrderItemTemplate1': LazyComponent<typeof import("../components/molecules/order/OrderItemTemplate1.vue")['default']>
    'LazyPaymentItemTemplate1': LazyComponent<typeof import("../components/molecules/order/PaymentItemTemplate1.vue")['default']>
    'LazyProductItemTemplate1': LazyComponent<typeof import("../components/molecules/product/ProductItemTemplate1.vue")['default']>
    'LazyProductItemWishlistTemplate': LazyComponent<typeof import("../components/molecules/product/ProductItemWishlistTemplate.vue")['default']>
    'LazySectionBanner': LazyComponent<typeof import("../components/organisms/banner/SectionBanner.vue")['default']>
    'LazyFooter': LazyComponent<typeof import("../components/organisms/layout/Footer.vue")['default']>
    'LazyHeader': LazyComponent<typeof import("../components/organisms/layout/Header.vue")['default']>
    'LazyMenuBottom': LazyComponent<typeof import("../components/organisms/layout/MenuBottom.vue")['default']>
    'LazySectionNewsLatest': LazyComponent<typeof import("../components/organisms/news/SectionNewsLatest.vue")['default']>
    'LazyProductCategoryMenu': LazyComponent<typeof import("../components/organisms/product/ProductCategoryMenu/index.vue")['default']>
    'LazyUseProductCategoryMenu': LazyComponent<typeof import("../components/organisms/product/ProductCategoryMenu/useProductCategoryMenu")['default']>
    'LazySectionProductList': LazyComponent<typeof import("../components/organisms/product/SectionProductList.vue")['default']>
    'LazySectionProductMostOrder': LazyComponent<typeof import("../components/organisms/product/SectionProductMostOrder.vue")['default']>
    'LazySectionProductSales': LazyComponent<typeof import("../components/organisms/product/SectionProductSales.vue")['default']>
    'LazyPopupBarcode': LazyComponent<typeof import("../components/organisms/user/PopupBarcode.vue")['default']>
    'LazySectionAccount': LazyComponent<typeof import("../components/organisms/user/SectionAccount.vue")['default']>
    'LazyCreateAbout': LazyComponent<typeof import("../components/templates/about/CreateAbout.vue")['default']>
    'LazyUpdateAbout': LazyComponent<typeof import("../components/templates/about/UpdateAbout.vue")['default']>
    'LazyPopupAddItemToCart': LazyComponent<typeof import("../components/templates/cart/PopupAddItemToCart.vue")['default']>
    'LazyPopupCart': LazyComponent<typeof import("../components/templates/cart/PopupCart.vue")['default']>
    'LazyPopupEditItemToCart': LazyComponent<typeof import("../components/templates/cart/PopupEditItemToCart.vue")['default']>
    'LazyFileManageFolder': LazyComponent<typeof import("../components/templates/file-manage/FileManageFolder.vue")['default']>
    'LazyFileManageImage': LazyComponent<typeof import("../components/templates/file-manage/FileManageImage.vue")['default']>
    'LazyPopupFileManageImage': LazyComponent<typeof import("../components/templates/file-manage/PopupFileManageImage.vue")['default']>
    'LazyOrderMain': LazyComponent<typeof import("../components/templates/order/OrderMain/index.vue")['default']>
    'LazyPopupOrderDetail': LazyComponent<typeof import("../components/templates/order/PopupOrderDetail.vue")['default']>
    'LazyPopupSearch': LazyComponent<typeof import("../components/templates/product/PopupSearch.vue")['default']>
    'LazyPopupChangePassword': LazyComponent<typeof import("../components/templates/user/PopupChangePassword.vue")['default']>
    'LazyPopupOrderHistory': LazyComponent<typeof import("../components/templates/user/PopupOrderHistory.vue")['default']>
    'LazyPopupUpdateAccount': LazyComponent<typeof import("../components/templates/user/PopupUpdateAccount.vue")['default']>
    'LazyPopupWishlist': LazyComponent<typeof import("../components/templates/user/PopupWishlist.vue")['default']>
    'LazyPopupCreateAddress': LazyComponent<typeof import("../components/templates/user/address/PopupCreateAddress.vue")['default']>
    'LazyPopupManageAddress': LazyComponent<typeof import("../components/templates/user/address/PopupManageAddress.vue")['default']>
    'LazyPopupUpdateAddress': LazyComponent<typeof import("../components/templates/user/address/PopupUpdateAddress.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const CreateBanner: typeof import("../components/admin/banners/CreateBanner.vue")['default']
export const UpdateBanner: typeof import("../components/admin/banners/UpdateBanner.vue")['default']
export const HeaderAdmin: typeof import("../components/admin/layout/HeaderAdmin.vue")['default']
export const Sidebar: typeof import("../components/admin/layout/Sidebar.vue")['default']
export const CreateCategoryNews: typeof import("../components/admin/news/CreateCategoryNews.vue")['default']
export const CreatePost: typeof import("../components/admin/news/CreatePost.vue")['default']
export const UpdateCategoryNews: typeof import("../components/admin/news/UpdateCategoryNews.vue")['default']
export const UpdatePost: typeof import("../components/admin/news/UpdatePost.vue")['default']
export const CreateCategoryProduct: typeof import("../components/admin/products/CreateCategoryProduct.vue")['default']
export const CreateProduct: typeof import("../components/admin/products/CreateProduct.vue")['default']
export const CreateVariantProduct: typeof import("../components/admin/products/CreateVariantProduct.vue")['default']
export const UpdateCategoryProduct: typeof import("../components/admin/products/UpdateCategoryProduct.vue")['default']
export const UpdateProduct: typeof import("../components/admin/products/UpdateProduct.vue")['default']
export const DetailAccount: typeof import("../components/admin/users/DetailAccount.vue")['default']
export const AvatarEdit: typeof import("../components/atoms/AvatarEdit.vue")['default']
export const Button: typeof import("../components/atoms/Button.vue")['default']
export const CKEditorCDN: typeof import("../components/atoms/CKEditorCDN.vue")['default']
export const CKEditorCDNBackup: typeof import("../components/atoms/CKEditorCDNBackup.vue")['default']
export const ControlImage: typeof import("../components/atoms/ControlImage.vue")['default']
export const FirstLoader: typeof import("../components/atoms/FirstLoader.vue")['default']
export const Heading: typeof import("../components/atoms/Heading.vue")['default']
export const LabelInput: typeof import("../components/atoms/LabelInput.vue")['default']
export const Loading: typeof import("../components/atoms/Loading.vue")['default']
export const MaterialIcon: typeof import("../components/atoms/MaterialIcon.vue")['default']
export const NoData: typeof import("../components/atoms/NoData.vue")['default']
export const Popup: typeof import("../components/atoms/Popup.vue")['default']
export const SelectOrder: typeof import("../components/atoms/SelectOrder.vue")['default']
export const Facebook: typeof import("../components/atoms/icons/Facebook.vue")['default']
export const Instagram: typeof import("../components/atoms/icons/Instagram.vue")['default']
export const Tiktok: typeof import("../components/atoms/icons/Tiktok.vue")['default']
export const CartItemTemplate1: typeof import("../components/molecules/cart/CartItemTemplate1.vue")['default']
export const CartItemTemplate2: typeof import("../components/molecules/cart/CartItemTemplate2.vue")['default']
export const FileImageItem: typeof import("../components/molecules/file-manage/FileImageItem.vue")['default']
export const Pagination: typeof import("../components/molecules/global/Pagination.vue")['default']
export const NewsItemTemplate1: typeof import("../components/molecules/news/NewsItemTemplate1.vue")['default']
export const OrderItemDetailTemplate1: typeof import("../components/molecules/order/OrderItemDetailTemplate1.vue")['default']
export const OrderItemTemplate1: typeof import("../components/molecules/order/OrderItemTemplate1.vue")['default']
export const PaymentItemTemplate1: typeof import("../components/molecules/order/PaymentItemTemplate1.vue")['default']
export const ProductItemTemplate1: typeof import("../components/molecules/product/ProductItemTemplate1.vue")['default']
export const ProductItemWishlistTemplate: typeof import("../components/molecules/product/ProductItemWishlistTemplate.vue")['default']
export const SectionBanner: typeof import("../components/organisms/banner/SectionBanner.vue")['default']
export const Footer: typeof import("../components/organisms/layout/Footer.vue")['default']
export const Header: typeof import("../components/organisms/layout/Header.vue")['default']
export const MenuBottom: typeof import("../components/organisms/layout/MenuBottom.vue")['default']
export const SectionNewsLatest: typeof import("../components/organisms/news/SectionNewsLatest.vue")['default']
export const ProductCategoryMenu: typeof import("../components/organisms/product/ProductCategoryMenu/index.vue")['default']
export const UseProductCategoryMenu: typeof import("../components/organisms/product/ProductCategoryMenu/useProductCategoryMenu")['default']
export const SectionProductList: typeof import("../components/organisms/product/SectionProductList.vue")['default']
export const SectionProductMostOrder: typeof import("../components/organisms/product/SectionProductMostOrder.vue")['default']
export const SectionProductSales: typeof import("../components/organisms/product/SectionProductSales.vue")['default']
export const PopupBarcode: typeof import("../components/organisms/user/PopupBarcode.vue")['default']
export const SectionAccount: typeof import("../components/organisms/user/SectionAccount.vue")['default']
export const CreateAbout: typeof import("../components/templates/about/CreateAbout.vue")['default']
export const UpdateAbout: typeof import("../components/templates/about/UpdateAbout.vue")['default']
export const PopupAddItemToCart: typeof import("../components/templates/cart/PopupAddItemToCart.vue")['default']
export const PopupCart: typeof import("../components/templates/cart/PopupCart.vue")['default']
export const PopupEditItemToCart: typeof import("../components/templates/cart/PopupEditItemToCart.vue")['default']
export const FileManageFolder: typeof import("../components/templates/file-manage/FileManageFolder.vue")['default']
export const FileManageImage: typeof import("../components/templates/file-manage/FileManageImage.vue")['default']
export const PopupFileManageImage: typeof import("../components/templates/file-manage/PopupFileManageImage.vue")['default']
export const OrderMain: typeof import("../components/templates/order/OrderMain/index.vue")['default']
export const PopupOrderDetail: typeof import("../components/templates/order/PopupOrderDetail.vue")['default']
export const PopupSearch: typeof import("../components/templates/product/PopupSearch.vue")['default']
export const PopupChangePassword: typeof import("../components/templates/user/PopupChangePassword.vue")['default']
export const PopupOrderHistory: typeof import("../components/templates/user/PopupOrderHistory.vue")['default']
export const PopupUpdateAccount: typeof import("../components/templates/user/PopupUpdateAccount.vue")['default']
export const PopupWishlist: typeof import("../components/templates/user/PopupWishlist.vue")['default']
export const PopupCreateAddress: typeof import("../components/templates/user/address/PopupCreateAddress.vue")['default']
export const PopupManageAddress: typeof import("../components/templates/user/address/PopupManageAddress.vue")['default']
export const PopupUpdateAddress: typeof import("../components/templates/user/address/PopupUpdateAddress.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const LazyCreateBanner: LazyComponent<typeof import("../components/admin/banners/CreateBanner.vue")['default']>
export const LazyUpdateBanner: LazyComponent<typeof import("../components/admin/banners/UpdateBanner.vue")['default']>
export const LazyHeaderAdmin: LazyComponent<typeof import("../components/admin/layout/HeaderAdmin.vue")['default']>
export const LazySidebar: LazyComponent<typeof import("../components/admin/layout/Sidebar.vue")['default']>
export const LazyCreateCategoryNews: LazyComponent<typeof import("../components/admin/news/CreateCategoryNews.vue")['default']>
export const LazyCreatePost: LazyComponent<typeof import("../components/admin/news/CreatePost.vue")['default']>
export const LazyUpdateCategoryNews: LazyComponent<typeof import("../components/admin/news/UpdateCategoryNews.vue")['default']>
export const LazyUpdatePost: LazyComponent<typeof import("../components/admin/news/UpdatePost.vue")['default']>
export const LazyCreateCategoryProduct: LazyComponent<typeof import("../components/admin/products/CreateCategoryProduct.vue")['default']>
export const LazyCreateProduct: LazyComponent<typeof import("../components/admin/products/CreateProduct.vue")['default']>
export const LazyCreateVariantProduct: LazyComponent<typeof import("../components/admin/products/CreateVariantProduct.vue")['default']>
export const LazyUpdateCategoryProduct: LazyComponent<typeof import("../components/admin/products/UpdateCategoryProduct.vue")['default']>
export const LazyUpdateProduct: LazyComponent<typeof import("../components/admin/products/UpdateProduct.vue")['default']>
export const LazyDetailAccount: LazyComponent<typeof import("../components/admin/users/DetailAccount.vue")['default']>
export const LazyAvatarEdit: LazyComponent<typeof import("../components/atoms/AvatarEdit.vue")['default']>
export const LazyButton: LazyComponent<typeof import("../components/atoms/Button.vue")['default']>
export const LazyCKEditorCDN: LazyComponent<typeof import("../components/atoms/CKEditorCDN.vue")['default']>
export const LazyCKEditorCDNBackup: LazyComponent<typeof import("../components/atoms/CKEditorCDNBackup.vue")['default']>
export const LazyControlImage: LazyComponent<typeof import("../components/atoms/ControlImage.vue")['default']>
export const LazyFirstLoader: LazyComponent<typeof import("../components/atoms/FirstLoader.vue")['default']>
export const LazyHeading: LazyComponent<typeof import("../components/atoms/Heading.vue")['default']>
export const LazyLabelInput: LazyComponent<typeof import("../components/atoms/LabelInput.vue")['default']>
export const LazyLoading: LazyComponent<typeof import("../components/atoms/Loading.vue")['default']>
export const LazyMaterialIcon: LazyComponent<typeof import("../components/atoms/MaterialIcon.vue")['default']>
export const LazyNoData: LazyComponent<typeof import("../components/atoms/NoData.vue")['default']>
export const LazyPopup: LazyComponent<typeof import("../components/atoms/Popup.vue")['default']>
export const LazySelectOrder: LazyComponent<typeof import("../components/atoms/SelectOrder.vue")['default']>
export const LazyFacebook: LazyComponent<typeof import("../components/atoms/icons/Facebook.vue")['default']>
export const LazyInstagram: LazyComponent<typeof import("../components/atoms/icons/Instagram.vue")['default']>
export const LazyTiktok: LazyComponent<typeof import("../components/atoms/icons/Tiktok.vue")['default']>
export const LazyCartItemTemplate1: LazyComponent<typeof import("../components/molecules/cart/CartItemTemplate1.vue")['default']>
export const LazyCartItemTemplate2: LazyComponent<typeof import("../components/molecules/cart/CartItemTemplate2.vue")['default']>
export const LazyFileImageItem: LazyComponent<typeof import("../components/molecules/file-manage/FileImageItem.vue")['default']>
export const LazyPagination: LazyComponent<typeof import("../components/molecules/global/Pagination.vue")['default']>
export const LazyNewsItemTemplate1: LazyComponent<typeof import("../components/molecules/news/NewsItemTemplate1.vue")['default']>
export const LazyOrderItemDetailTemplate1: LazyComponent<typeof import("../components/molecules/order/OrderItemDetailTemplate1.vue")['default']>
export const LazyOrderItemTemplate1: LazyComponent<typeof import("../components/molecules/order/OrderItemTemplate1.vue")['default']>
export const LazyPaymentItemTemplate1: LazyComponent<typeof import("../components/molecules/order/PaymentItemTemplate1.vue")['default']>
export const LazyProductItemTemplate1: LazyComponent<typeof import("../components/molecules/product/ProductItemTemplate1.vue")['default']>
export const LazyProductItemWishlistTemplate: LazyComponent<typeof import("../components/molecules/product/ProductItemWishlistTemplate.vue")['default']>
export const LazySectionBanner: LazyComponent<typeof import("../components/organisms/banner/SectionBanner.vue")['default']>
export const LazyFooter: LazyComponent<typeof import("../components/organisms/layout/Footer.vue")['default']>
export const LazyHeader: LazyComponent<typeof import("../components/organisms/layout/Header.vue")['default']>
export const LazyMenuBottom: LazyComponent<typeof import("../components/organisms/layout/MenuBottom.vue")['default']>
export const LazySectionNewsLatest: LazyComponent<typeof import("../components/organisms/news/SectionNewsLatest.vue")['default']>
export const LazyProductCategoryMenu: LazyComponent<typeof import("../components/organisms/product/ProductCategoryMenu/index.vue")['default']>
export const LazyUseProductCategoryMenu: LazyComponent<typeof import("../components/organisms/product/ProductCategoryMenu/useProductCategoryMenu")['default']>
export const LazySectionProductList: LazyComponent<typeof import("../components/organisms/product/SectionProductList.vue")['default']>
export const LazySectionProductMostOrder: LazyComponent<typeof import("../components/organisms/product/SectionProductMostOrder.vue")['default']>
export const LazySectionProductSales: LazyComponent<typeof import("../components/organisms/product/SectionProductSales.vue")['default']>
export const LazyPopupBarcode: LazyComponent<typeof import("../components/organisms/user/PopupBarcode.vue")['default']>
export const LazySectionAccount: LazyComponent<typeof import("../components/organisms/user/SectionAccount.vue")['default']>
export const LazyCreateAbout: LazyComponent<typeof import("../components/templates/about/CreateAbout.vue")['default']>
export const LazyUpdateAbout: LazyComponent<typeof import("../components/templates/about/UpdateAbout.vue")['default']>
export const LazyPopupAddItemToCart: LazyComponent<typeof import("../components/templates/cart/PopupAddItemToCart.vue")['default']>
export const LazyPopupCart: LazyComponent<typeof import("../components/templates/cart/PopupCart.vue")['default']>
export const LazyPopupEditItemToCart: LazyComponent<typeof import("../components/templates/cart/PopupEditItemToCart.vue")['default']>
export const LazyFileManageFolder: LazyComponent<typeof import("../components/templates/file-manage/FileManageFolder.vue")['default']>
export const LazyFileManageImage: LazyComponent<typeof import("../components/templates/file-manage/FileManageImage.vue")['default']>
export const LazyPopupFileManageImage: LazyComponent<typeof import("../components/templates/file-manage/PopupFileManageImage.vue")['default']>
export const LazyOrderMain: LazyComponent<typeof import("../components/templates/order/OrderMain/index.vue")['default']>
export const LazyPopupOrderDetail: LazyComponent<typeof import("../components/templates/order/PopupOrderDetail.vue")['default']>
export const LazyPopupSearch: LazyComponent<typeof import("../components/templates/product/PopupSearch.vue")['default']>
export const LazyPopupChangePassword: LazyComponent<typeof import("../components/templates/user/PopupChangePassword.vue")['default']>
export const LazyPopupOrderHistory: LazyComponent<typeof import("../components/templates/user/PopupOrderHistory.vue")['default']>
export const LazyPopupUpdateAccount: LazyComponent<typeof import("../components/templates/user/PopupUpdateAccount.vue")['default']>
export const LazyPopupWishlist: LazyComponent<typeof import("../components/templates/user/PopupWishlist.vue")['default']>
export const LazyPopupCreateAddress: LazyComponent<typeof import("../components/templates/user/address/PopupCreateAddress.vue")['default']>
export const LazyPopupManageAddress: LazyComponent<typeof import("../components/templates/user/address/PopupManageAddress.vue")['default']>
export const LazyPopupUpdateAddress: LazyComponent<typeof import("../components/templates/user/address/PopupUpdateAddress.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>

export const componentNames: string[]
