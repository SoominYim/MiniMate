<template>
  <v-app>
    <NuxtLayout />
    <v-main :style="{ backgroundColor: $route.path === '/pdf' ? '#ccc' : 'inherit' }">
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<style lang="scss">
  @import url("@/assets/style/common/common.scss");
</style>
