import { useBaseInformationStore } from '@/stores/client/base-information/useBaseInformationStore'

export const useCategoryNewsSEO = () => {
  const configRuntime = useRuntimeConfig()
  const settingStore = useBaseInformationStore()

  const setCategoryNewsSEO = (category: any, routePath: string) => {
    if (!category) return

    const canonicalUrl = `${configRuntime.public.siteUrl}${routePath}/${category.slug}`
    
    useHead({
      title: category.categoryName,
      meta: [
        {
          name: 'description',
          content: category.descriptionSEO || category.summaryContent || ''
        },
        {
          name: 'keywords', 
          content: category.keywords?.join(', ') || ''
        },
        {
          name: 'robots',
          content: category.isActive === false ? 'noindex, nofollow' : 'index, follow'
        },
        
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: category.titleSEO || category.categoryName },
        { property: 'og:description', content: category.descriptionSEO || category.summaryContent || '' },
        { property: 'og:image', content: category.image || '' },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:site_name', content: settingStore.getBaseInformation?.name || '' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: category.titleSEO || category.categoryName },
        { name: 'twitter:description', content: category.descriptionSEO || category.summaryContent || '' },
        { name: 'twitter:image', content: category.image || '' },
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
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage", 
            "name": category.categoryName,
            "description": category.description || '',
            "url": canonicalUrl,
            "image": category.image || '',
          })
        }
      ]
    })
  }

  return {
    setCategoryNewsSEO
  }
}