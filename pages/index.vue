<template>{{ weather.getDate }}</template>

<script setup lang="ts">
  import { useWeather } from "/store/useWeather.ts";

  const weather = useWeather();
</script>

<style lang="scss" scoped></style>
