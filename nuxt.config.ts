// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  app: {
    head: {
      meta: [
        { name: "author", content: "수빡이" },
        { name: "version", content: "version 1.0" },
        { property: "og:type", content: "website" },
        { property: "robots", content: "ALL" },
      ],
    },
  },
  css: ["vuetify/lib/styles/main.sass", "@mdi/font/css/materialdesignicons.min.css"],
  modules: ["@pinia/nuxt"],
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          /** 전역 스타일 적용 */
          // additionalData: '@import "@/assets/style/common/common.scss" ;',
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      weatherKey: process.env.VUE_APP_WEATHER_API_KEY,
    },
  },
});
