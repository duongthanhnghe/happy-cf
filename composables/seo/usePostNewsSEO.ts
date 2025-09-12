import { useSettingStore } from '@/stores/setting/useSettingStore'

export const usePostNewsSEO = () => {
  const configRuntime = useRuntimeConfig()
  const settingStore = useSettingStore()

  const setNewsSEO = (post: any, routePath: string) => {
    if (!post) return

    const canonicalUrl = `${configRuntime.public.siteUrl}${routePath}/${post.slug}`
    
    useHead({
      title: post.titleSEO || post.title,
      meta: [
        {
          name: 'description',
          content: post.descriptionSEO || post.summaryContent || ''
        },
        {
          name: 'keywords', 
          content: post.keywords?.join(', ') || ''
        },
        {
          name: 'robots',
          content: post.isActive === false ? 'noindex, nofollow' : 'index, follow'
        },
        
        // Open Graph
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: post.titleSEO || post.title },
        { property: 'og:description', content: post.descriptionSEO || post.summaryContent || '' },
        { property: 'og:image', content: post.image || '' },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:site_name', content: settingStore.getSettings?.name || '' },
        { property: 'article:published_time', content: post.createdAt },
        { property: 'article:modified_time', content: post.updatedAt || post.createdAt },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: post.titleSEO || post.title },
        { name: 'twitter:description', content: post.descriptionSEO || post.summaryContent || '' },
        { name: 'twitter:image', content: post.image || '' },
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
            "@type": "Article",
            "headline": post.titleSEO || post.title,
            "description": post.descriptionSEO || post.summaryContent || '',
            "image": post.image || '',
            "url": canonicalUrl,
            "author": {
              "@type": "Person",
              "name": post.author || "Admin"
            },
            "publisher": {
              "@type": "Organization",
              "name": settingStore.getSettings?.name || '',
              "logo": {
                "@type": "ImageObject",
                "url": settingStore.getSettings?.logo || ''
              }
            },
            "datePublished": post.createdAt,
            "dateModified": post.updatedAt || post.createdAt
          })
        },
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
                "name": "Tin tức",
                "item": `${configRuntime.public.siteUrl}/news`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": canonicalUrl
              }
            ]
          })
        }
      ]
    })
  }

  return {
    setNewsSEO
  }
}