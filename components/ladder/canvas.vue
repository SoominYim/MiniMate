<template>
  <canvas id="canvas" :style="{ width: '600px', height: '330px' }"></canvas>
</template>

<script lang="ts" setup>
  import { useLadder } from "../../store/useLadder";
  import { storeToRefs } from "pinia";
  const store = useLadder();
  const { count } = storeToRefs(store);

  function getRandomNumber(min: number, max: number) {
    const base = Math.floor(Math.random() * ((max - min) / 14)) * 14;
    return base + min;
  }

  function ladder_draw(ctx: any) {
    for (let i = 1; i <= count.value; i++) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#fff";

      ctx.beginPath();
      ctx.moveTo(12.5 * (2 * i - 1) - 0.5, 0);
      ctx.lineTo(12.5 * (2 * i - 1) - 0.5, 330);
      ctx.stroke();
      ctx.beginPath();
    }
    for (let j = 0; j <= 1; j++) {
      Array.from({ length: count.value - 1 }, (_, i) => {
        const r = getRandomNumber(14, 140);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#3f3";
        ctx.beginPath();
        ctx.moveTo(12.5 + 25 * i, r);
        ctx.lineTo(37.5 + 25 * i, r);
        ctx.stroke();
        ctx.beginPath();
      });
    }
  }

  onMounted(() => {
    var canvas = document.getElementById("canvas") as HTMLCanvasElement;
    var ctx = canvas.getContext("2d");
    if (ctx) {
      ladder_draw(ctx);
    }
  });
</script>
<style lang="scss" scoped>
  canvas {
  }
</style>
