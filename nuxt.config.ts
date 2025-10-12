export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  css: [
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/main.scss',
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: ['@pinia/nuxt'],
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
          'Cross-Origin-Embedder-Policy': 'unsafe-none'
        }
      }
    }
  },
  runtimeConfig: {
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    
    public: {
      siteUrl: process.env.DOMAIN || 'Website',
      siteName: 'Happy Coffee',
      siteDescription: 'Mô tả website',
      siteImage: '/assets/logo.png',
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      GOOGLE_CLIENT_ID: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
      sepayAccountNo: process.env.SEPAY_ACCOUNT_NO,
      sepayBankId: process.env.SEPAY_BANK_ID,
      sepayAccountName: process.env.SEPAY_ACCOUNT_NAME,
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'vi'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'Happy Coffee' },
        { property: 'og:site_name', content: 'Happy Coffee' },
        { property: 'og:locale', content: 'vi_VN' },
        { 
          'http-equiv': 'Cross-Origin-Opener-Policy', 
          content: 'same-origin-allow-popups' 
        },
        { 
          'http-equiv': 'Cross-Origin-Embedder-Policy', 
          content: 'unsafe-none' 
        }
      ],
      script: [
        {
          src: "https://cdn.ckeditor.com/ckeditor5/39.0.1/super-build/ckeditor.js",
          defer: true
        },
        {
          innerHTML: `
            document.addEventListener("DOMContentLoaded", function() { 
              const div = document.createElement("div"); 
              div.id = "loader"; 
              div.className = "loader"; 
              div.innerHTML = '<div class="loader-icon"></div>'; 
              document.body.insertBefore(div, document.body.firstChild); 
            });
          `,
          type: 'text/javascript'
        }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:wght@100..700'
        },
      ],
    }
  },
  vite: {
    // css: {
    //   preprocessorOptions: {
    //     sass: {
    //       additionalData: (content, filename) => {
    //         if (filename.includes('vuetify/styles')) return ''
    //         return content
    //       }
    //     }
    //   }
    // },
    define: {
      'process.env.DEBUG': false,
    },
    ssr: {
      noExternal: ['vuetify'],
    },
    optimizeDeps: { include: ['vuetify/components', 'vuetify/directives'] },
    server: {
      proxy: {
        '/api': 'http://127.0.0.1:5000'
      }
    },
  },
})
