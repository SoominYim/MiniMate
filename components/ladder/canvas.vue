<template>
  <canvas id="q_canvas" :style="{ width: '600px', height: '330px' }"></canvas>
  <canvas id="r_canvas" :style="{ width: '600px', height: '330px' }"></canvas>
</template>

<script lang="ts" setup>
  import { useLadder } from "../../store/useLadder";
  import { storeToRefs } from "pinia";
  const store = useLadder();
  const { count, selectedAvatar, isPlay } = storeToRefs(store);

  let lines: { x1: number; y1: number; x2: number; y2: number; end: boolean }[] = [];
  let h_lines: { x1: number; y1: number; x2: number; y2: number }[][] = [];

  function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getLines(ctx: any) {
    for (let i = 0; i < count.value; i++) {
      lines.push({
        x1: 80 + i * 160,
        y1: 0,
        x2: 80 + i * 160,
        y2: 1080,
        end: false,
      });
    }
    for (let i = 0; i < count.value - 1; i++) {
      const lineCount = Math.floor(Math.random() * 3) + 2;
      h_lines.push([]);
      for (let j = 0; j < lineCount; j++) {
        const randomY = 120 + Math.floor(Math.random() * 9) * 108;
        h_lines[i].push({
          x1: 80 + i * 160,
          y1: randomY,
          x2: 80 + (i + 1) * 160,
          y2: randomY,
        });
      }
    }
    ctx.lineWidth = 30;
    ctx.strokeStyle = "#fff";

    for (let line of lines) {
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
      ctx.beginPath();
    }
    h_lines.forEach((v) => {
      for (let line of v) {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
        ctx.beginPath();
      }
    });

    ctx.lineWidth = 30;
    ctx.strokeStyle = "#c34";

    console.log(h_lines);
  }

  function draw_result(ctx: any, x1: number, y1: number, x2: number, y2: number, end: boolean) {
    if (!end) {
      let now = 0;
      let ani: any;
      const drawing = () => {
        ctx.lineWidth = 30;
        ctx.strokeStyle = "#ff2d";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, now);
        ctx.stroke();
        now += 10;
        ani = requestAnimationFrame(drawing);
        if (now > 2) {
          isPlay.value = true;
        }
        if (now >= y2 + 10) {
          isPlay.value = false;
          end = true;
          cancelAnimationFrame(ani);
        }
      };
      drawing();
    }
  }

  watch(selectedAvatar, (newValue, oldValue) => {
    const r_canvas = document.getElementById("r_canvas") as HTMLCanvasElement;
    const ctx = r_canvas.getContext("2d");
    const _l = lines[newValue];
    if (ctx) {
      draw_result(ctx, _l.x1, _l.y1, _l.x2, _l.y2, _l.end);
    }
  });

  onMounted(() => {
    const dpr = window.devicePixelRatio || 1;
    const canvas = document.querySelectorAll("canvas");
    const q_canvas = document.getElementById("q_canvas") as HTMLCanvasElement;

    var ctx = q_canvas.getContext("2d");

    canvas.forEach((v) => {
      v.width = 1920;
      v.height = 1080;
    });

    if (ctx) {
      getLines(ctx);
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
