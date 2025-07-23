export default defineNuxtConfig({
  imports: {
    dirs: ['utils']
  },
  devServer: {
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || "0.0.0.0",
  },
  // server: {
  //   port: Number(process.env.PORT) || 3000,
  //   host: process.env.HOST || "0.0.0.0",
  // },

  nitro: {
    routeRules: {
      '/api/auth': {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        }
      }
    }
  },
  // server: {
  //   port: Number(process.env.PORT) || 3000,
  //   host: process.env.HOST || "0.0.0.0",
  // },
  app: {
    head: {
      title: process.env.TITLE,
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      script: [
        {
          src: `https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_GTAG_ID}`,
          async: true
        }
      ]
    },
  },
  compatibilityDate: "2025-02-10",
  devtools: { enabled: true },
  css: ["~/css/main.css"],
  modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxt/image"],
  runtimeConfig: {
    tokenInAuth: process.env.API_AUTH,
    LoginBaseUrl: process.env.LOGIN_BASE_URL,
    GOOGLE_GTAG_ID: process.env.GOOGLE_GTAG_ID,
    googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    googlePrivateKey: (process.env.GOOGLE_PRIVATE_KEY || "").replace(
      /\\n/g,
      "\n"
    ),
    keycloakBaseUrl: process.env.KEYCLOAK_BASE_URL,
    keycloakClientId: process.env.KEYCLOAK_CLIENT_ID,
    keycloakRedirectUri: process.env.KEYCLOAK_REDIRECT_URI,
    keycloakRealm: process.env.KEYCLOAK_REALM,
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      propertyId: process.env.PROPERTY_ID,
      isAksaraJawa: process.env.AKSARA_JAWA,
      akronim: process.env.AKRONIM
    },
  },
  components: [{ path: "~/components", pathPrefix: false }],
  plugins: [
    { src: '~/plugins/keycloak-alt.client.js', mode: 'client' }
  ]
});

