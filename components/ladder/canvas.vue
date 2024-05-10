<template>
  <canvas id="canvas" :style="{ width: 50 * count + 'px', height: '330px' }"></canvas>
</template>
<script lang="ts" setup>
  import { useLadder } from "../../store/useLadder";
  import { storeToRefs } from "pinia";
  const store = useLadder();
  const { count } = storeToRefs(store);
  onMounted(() => {
    var canvas = document.getElementById("canvas") as HTMLCanvasElement;
    var ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio;

    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(12.5 * (2 * 12 - 1), 0);
      ctx.lineTo(12.5 * (2 * 12 - 1), 330);
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
    }
  });
</script>
<style scoped>
  canvas {
  }
</style>
