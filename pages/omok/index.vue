<template>
  <div class="container">
    <div class="board_wrap">
      <canvas id="b_canvas"></canvas>
      <canvas id="g_canvas"></canvas>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from "vue";

  interface Point {
    offsetX: number;
    offsetY: number;
    x: number;
    y: number;
  }

  const clickedPoints = ref<Point[]>([]);

  function drawBoard(ctx: CanvasRenderingContext2D, boardSize: number, blockInterval: number, margin: number) {
    //오목판 그리기
    for (var i = 1; i < boardSize; i++) {
      for (var j = 1; j < boardSize; j++) {
        //정사각형 그리기
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.strokeRect(blockInterval * i - margin, blockInterval * j - margin, blockInterval, blockInterval);
      }
    }
    for (let a = 0; a < 3; a++) {
      for (let b = 0; b < 3; b++) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(
          (3 + a) * blockInterval + margin + a * 5 * blockInterval,
          (3 + b) * blockInterval + margin + b * 5 * blockInterval,
          15 / 3,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }

  function drawClickedPoints(ctx: CanvasRenderingContext2D, blockInterval: number) {
    clickedPoints.value.forEach((point) => {
      ctx.beginPath();
      ctx.arc(
        clickedPoints.value[clickedPoints.value.length - 1].offsetX,
        clickedPoints.value[clickedPoints.value.length - 1].offsetY,
        blockInterval / 2,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fill();
    });
    console.log(clickedPoints.value);
  }

  onMounted(() => {
    const b_canvas = document.getElementById("b_canvas") as HTMLCanvasElement;
    const g_canvas = document.getElementById("g_canvas") as HTMLCanvasElement;
    const canvas = document.querySelectorAll("canvas");
    const b_ctx = b_canvas.getContext("2d");
    const g_ctx = g_canvas.getContext("2d");
    const boardSize = 19;
    canvas.forEach((v) => {
      v.width = 720;
      v.height = 720;
    });
    const margin = b_canvas.width / boardSize / 2;
    const blockInterval = b_canvas.width / boardSize;

    if (b_ctx && g_ctx) {
      drawBoard(b_ctx, boardSize, blockInterval, margin);
      const handleMouseMove = (e: MouseEvent) => {
        const rect = b_canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
        drawBoard(b_ctx, boardSize, blockInterval, margin);
        for (let i = 0; i <= boardSize; i++) {
          for (let j = 0; j <= boardSize; j++) {
            const nearX = i * blockInterval + margin;
            const nearY = j * blockInterval + margin;

            // 마우스가 교차점에 근접했는지 확인
            if (Math.abs(x - nearX) <= margin && Math.abs(y - nearY) <= margin) {
              // 마우스 위치에 투명한 원 그리기
              g_ctx.beginPath();
              g_ctx.arc(nearX, nearY, blockInterval / 2, 0, Math.PI * 2);
              g_ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
              g_ctx.fill();
              break;
            }
          }
        }
      };
      const handleClick = (e: MouseEvent) => {
        const rect = g_canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = 0; i < boardSize; i++) {
          for (let j = 0; j < boardSize; j++) {
            const nearX = i * blockInterval + margin;
            const nearY = j * blockInterval + margin;

            // 마우스가 교차점에 근접했는지 확인
            if (Math.abs(x - nearX) <= margin && Math.abs(y - nearY) <= margin) {
              // 클릭 위치 저장
              clickedPoints.value.push({ offsetX: nearX, offsetY: nearY, x: i, y: j });
              drawClickedPoints(b_ctx, blockInterval);
              break;
            }
          }
        }
        // 캔버스를 클리어하고 다시 그리기
        g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
        drawBoard(b_ctx, boardSize, blockInterval, margin);
      };

      g_canvas.addEventListener("mousemove", handleMouseMove);
      g_canvas.addEventListener("click", handleClick);
      onUnmounted(() => {
        g_canvas.removeEventListener("mousemove", handleMouseMove);
        g_canvas.removeEventListener("click", handleClick);
      });
    }
  });
</script>

<style lang="scss" scoped>
  .container {
    padding: 50px 0 0 0;
    background-color: antiquewhite;
    display: flex;
    justify-content: center;
    .board_wrap {
      position: relative;
      width: 720px;
      height: 720px;
      background-color: #ffa701;
      canvas {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
</style>