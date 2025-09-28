import { useSettingStore } from '@/stores/shared/setting/useSettingStore'

export const useProductSEO = () => {
  const configRuntime = useRuntimeConfig()
  const settingStore = useSettingStore()

  const setProductSEO = (product: any, routePath: string) => {
    if (!product) return

    const canonicalUrl = `${configRuntime.public.siteUrl}${routePath}/${product.slug}`

    useHead({
      title: product.titleSEO || product.productName,
      meta: [
        {
          name: 'description',
          content: product.descriptionSEO || product.summaryContent || product.description || ''
        },
        {
          name: 'keywords',
          content: product.keywords?.join(', ') || ''
        },
        {
          name: 'robots',
          content: product.isActive === false ? 'noindex, nofollow' : 'index, follow'
        },

        // Open Graph
        { property: 'og:type', content: 'product' },
        { property: 'og:title', content: product.titleSEO || product.productName },
        { property: 'og:description', content: product.descriptionSEO || product.summaryContent || product.description || '' },
        { property: 'og:image', content: product.image || '' },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:site_name', content: settingStore.getSettings?.name || '' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: product.titleSEO || product.productName },
        { name: 'twitter:description', content: product.descriptionSEO || product.summaryContent || product.description || '' },
        { name: 'twitter:image', content: product.image || '' },
      ],

      link: [
        {
          rel: 'canonical',
          href: canonicalUrl
        },
        {
          rel: 'alternate',
          hreflang: 'vi',
          href: canonicalUrl
        }
      ],

      script: [
        // Product Schema
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.titleSEO || product.productName,
            "description": product.descriptionSEO || product.summaryContent || product.description || '',
            "image": product.image || '',
            "url": canonicalUrl,
            "sku": product.sku || product._id || '',
            "brand": {
              "@type": "Brand",
              "name": product.brand || settingStore.getSettings?.name || ''
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "VND",
              "price": product.price,
              "availability": product.isActive ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "url": canonicalUrl
            }
          })
        },
        // Breadcrumb Schema
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Trang chủ",
                "item": configRuntime.public.siteUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Sản phẩm",
                "item": `${configRuntime.public.siteUrl}/products`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": product.productName,
                "item": canonicalUrl
              }
            ]
          })
        }
      ]
    })
  }

  return {
    setProductSEO
  }
}
