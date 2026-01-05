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
      "/api/**": {
        proxy: "http://localhost:8080/api/v1/**",
        headers: {
          "Access-Control-Allow-Credentials": "true"
        }
      }
    },
  },
  runtimeConfig: {
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      apiAdminBase: process.env.NUXT_PUBLIC_API_ADMIN_BASE,

      siteUrl: process.env.DOMAIN || 'Website',
      siteName: 'Happy Coffee',
      siteDescription: 'Mô tả website',
      siteImage: '/assets/logo.png',
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      GOOGLE_CLIENT_ID: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
      sepayAccountNo: process.env.SEPAY_ACCOUNT_NO,
      sepayBankId: process.env.SEPAY_BANK_ID,
      sepayAccountName: process.env.SEPAY_ACCOUNT_NAME,
      sepayBankName: process.env.SEPAY_BANK_NAME,
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
    define: {
      'process.env.DEBUG': false,
    },
    ssr: {
      noExternal: ['vuetify'],
    },
    optimizeDeps: { include: ['vuetify/components', 'vuetify/directives'] },
  },
})
