import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
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
  runtimeConfig: {
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    
    public: {
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME
    }
  },
  app: {
    head: {
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
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: (content, filename) => {
            if (filename.includes('vuetify/styles')) return ''
            return content
          }
        }
      }
    },
    resolve: {
      alias: {
        'vuetify/styles': resolve(__dirname, 'plugins/vuetify-empty.sass'),
        '@shared': resolve(__dirname, 'shared'),
      }
    },
    define: {
      'process.env.DEBUG': false,
    },
    ssr: {
      noExternal: ['vuetify'],
    },
    server: {
      proxy: {
        '/api': 'http://127.0.0.1:5000'
      }
    },
  },
})
