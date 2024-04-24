<template>
  {{ weather.getDate }}

  {{ weather.fetchData() }}
</template>

<script setup lang="ts">
  import { useWeather } from "/store/useWeather.ts";

  const weather = useWeather();

  const config = useRuntimeConfig();
</script>

<style lang="scss" scoped></style>
