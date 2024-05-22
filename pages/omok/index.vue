<template>
  <div class="container">
    <div class="board_wrap">
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script lang="ts" setup>
  function drawBoard(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const boardSize = 19;
    const margin = 45;
    const blockInterval = canvas.width / boardSize;

    //오목판 그리기
    for (var i = 1; i < boardSize; i++) {
      for (var j = 1; j < boardSize; j++) {
        //정사각형 그리기
        ctx.lineWidth = 6;
        ctx.strokeStyle = "black";
        ctx.strokeRect(blockInterval * i - margin, blockInterval * j - margin, blockInterval, blockInterval);
      }
    }
    for (let a = 0; a < 3; a++) {
      for (let b = 0; b < 3; b++) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(
          (3 + a) * blockInterval + margin + 10 + a * 5 * blockInterval,
          (3 + b) * blockInterval + margin + 10 + b * 5 * blockInterval,
          40 / 3,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }

  onMounted(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    canvas.width = 1920;
    canvas.height = 1920;

    if (ctx) {
      drawBoard(canvas, ctx);
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
      background-color: #ffa701;
      canvas {
        width: 50vw;
        height: 50vw;
        min-width: 320px;
        min-height: 320px;
        max-width: 600px;
        max-height: 600px;
      }
    }
  }
</style>
