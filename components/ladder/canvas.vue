<template>
  <canvas id="q_canvas" :style="{ width: '600px', height: '380px' }"></canvas>
  <canvas id="r_canvas" :style="{ width: '600px', height: '380px' }"></canvas>
</template>

<script lang="ts" setup>
  import { useLadder } from "../../store/useLadder";
  import { storeToRefs } from "pinia";
  const store = useLadder();
  const { count, selectedAvatar, isPlay } = storeToRefs(store);
  const { randomColors } = useLadder();

  let lines: { x1: number; y1: number; x2: number; y2: number; end: boolean }[] = [];
  let h_lines: { x1: number; y1: number; x2: number; y2: number }[][] = [];

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
      const lineCount = Math.floor(Math.random() * 3) + 1;
      h_lines.push([]);

      for (let j = 0; j < 3; j++) {
        h_lines[i].push({
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0,
        });
      }

      // 우측 사다리의 가로줄이 중복되지 않게 함
      // 만약 중복이 된다면 가로줄들끼리 연결이 됨
      // 가로줄은 1~ 2개까지만

      const y1Set = new Set();
      const randomYs: number[] = [];

      while (randomYs.length < lineCount) {
        let randomY;
        do {
          randomY = 120 + Math.floor(Math.random() * 9) * 120;
        } while (y1Set.has(randomY));
        randomYs.push(randomY);
        y1Set.add(randomY);
      }

      for (let j = 0; j < lineCount; j++) {
        h_lines[i][j] = {
          x1: 80 + i * 160,
          y1: randomYs[j],
          x2: 80 + (i + 1) * 160,
          y2: randomYs[j],
        };
      }
    }

    for (let i = 0; i < count.value - 1; i++) {
      const y1Set = new Set();
      for (let j = 0; j < h_lines[i].length; j++) {
        const currentY = h_lines[i][j].y1;
        if (currentY !== 0) {
          y1Set.add(currentY);
        }
      }

      for (let j = 0; j < h_lines[i].length; j++) {
        if (h_lines[i + 1] && h_lines[i + 1][j]) {
          const nextY = h_lines[i + 1][j].y1;
          if (nextY !== 0 && y1Set.has(nextY)) {
            let newY;
            do {
              newY = 120 + Math.floor(Math.random() * 9) * 120;
            } while (y1Set.has(newY));

            h_lines[i + 1][j].y1 = newY;
            h_lines[i + 1][j].y2 = newY;
          }
        }
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
  }

  function draw_result(ctx: any, x1: number, y1: number, x2: number, y2: number, line: any) {
    if (!line.end) {
      let currentX = x1;
      let currentY = y1;
      let direction = "down";
      let ani: any;
      const drawing = () => {
        ctx.lineWidth = 32;
        ctx.lineCap = "square";
        ctx.strokeStyle = randomColors[selectedAvatar.value];
        ctx.beginPath();
        ctx.moveTo(currentX, currentY);

        if (direction === "down") {
          currentY += 10;
          for (let i = 0; i < h_lines.length; i++) {
            for (let j = 0; j < h_lines[i].length; j++) {
              if (h_lines[i][j].y1 === currentY && h_lines[i][j].x1 === currentX) {
                direction = "right";
                break;
              } else if (h_lines[i][j].y1 === currentY && h_lines[i][j].x2 === currentX) {
                direction = "left";
                break;
              }
            }
          }
        } else if (direction === "right") {
          currentX += 10;
          for (let i = 0; i < h_lines.length; i++) {
            for (let j = 0; j < h_lines[i].length; j++) {
              if (h_lines[i][j].y1 === currentY && h_lines[i][j].x2 === currentX) {
                direction = "down";
                break;
              }
            }
          }
        } else if (direction === "left") {
          currentX -= 10;
          for (let i = 0; i < h_lines.length; i++) {
            for (let j = 0; j < h_lines[i].length; j++) {
              if (h_lines[i][j].y1 === currentY && h_lines[i][j].x1 === currentX) {
                direction = "down";
                break;
              }
            }
          }
        }
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        if (currentY >= y2) {
          isPlay.value = false;
          line.end = true;
          cancelAnimationFrame(ani);
        } else {
          isPlay.value = true;
          ani = requestAnimationFrame(drawing);
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
      if (!_l.end) {
        draw_result(ctx, _l.x1, _l.y1, _l.x2, _l.y2, _l);
      }
    }
  });

  onMounted(() => {
    const canvas = document.querySelectorAll("canvas");
    const q_canvas = document.getElementById("q_canvas") as HTMLCanvasElement;

    var ctx = q_canvas.getContext("2d");

    canvas.forEach((v) => {
      v.width = 1920;
      v.height = 1080;
    });

    if (ctx) {
      lines.map((v) => (v.end = false));
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
