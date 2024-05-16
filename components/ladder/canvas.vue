<template>
  <canvas id="q_canvas" :style="{ width: '600px', height: '330px' }"></canvas>
  <canvas id="r_canvas" :style="{ width: '600px', height: '330px' }"></canvas>
</template>

<script lang="ts" setup>
  import { useLadder } from "../../store/useLadder";
  import { storeToRefs } from "pinia";
  const store = useLadder();
  const { count, selectedAvatar } = storeToRefs(store);

  let lines: { x1: number; y1: number; x2: number; y2: number }[] = [];

  function getRandomNumber(min: number, max: number) {
    const base = Math.floor(Math.random() * ((max - min) / 14)) * 14;
    return base + min;
  }

  function getLines(ctx: any) {
    for (let i = 0; i <= count.value - 1; i++) {
      lines.push({
        x1: 80 + i * 160,
        y1: 0,
        x2: 80 + i * 160,
        y2: 1080,
      });
    }
    ctx.lineWidth = 30;
    ctx.strokeStyle = "#fff";
    for (let line of lines) {
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    }
  }

  watch(selectedAvatar, (newValue, oldValue) => {
    console.log(newValue, oldValue);
  });

  onMounted(() => {
    var canvas = document.querySelectorAll("canvas");
    var q_canvas = document.getElementById("q_canvas") as HTMLCanvasElement;
    var r_canvas = document.getElementById("r_canvas") as HTMLCanvasElement;
    const dpr = window.devicePixelRatio;

    var q_ctx = q_canvas.getContext("2d");

    canvas.forEach((v) => {
      v.width = 1920 * dpr;
      v.height = 1080 * dpr;
    });

    if (q_ctx) {
      getLines(q_ctx);
    }
  });
</script>
<style lang="scss" scoped>
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
