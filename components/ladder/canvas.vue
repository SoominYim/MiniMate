<template>
  <canvas id="canvas" :style="{ width: '600px', height: '330px' }"></canvas>
</template>
<script lang="ts" setup>
  import { useLadder } from "../../store/useLadder";
  import { storeToRefs } from "pinia";
  const store = useLadder();
  const { count } = storeToRefs(store);

  function ladder_draw(ctx: any) {
    for (let i = 1; i <= count.value; i++) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#fff";

      ctx.beginPath();
      ctx.moveTo(12.5 * (2 * i - 1), 0);
      ctx.lineTo(12.5 * (2 * i - 1), 330);
      ctx.stroke();
      ctx.beginPath();
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
<style scoped>
  canvas {
  }
</style>
