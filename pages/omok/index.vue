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
  const board = Array.from({ length: 19 }, (_, i) => Array.from({ length: 19 }, (_, j) => ({ x: i, y: j, type: "" })));
  console.log(board);
  interface Point {
    x: number;
    y: number;
    type: string;
  }
  const clickedPoints = ref<Point[]>([]);
  const thisType = ref("black");

  const boardSize = 19;
  const maxSize = 720;
  const canvasSize = ref(720);

  function drawBoard(ctx: CanvasRenderingContext2D, boardSize: number, blockInterval: number, margin: number) {
    // 오목판 그리기
    for (var i = 1; i < boardSize; i++) {
      for (var j = 1; j < boardSize; j++) {
        // 정사각형 그리기
        ctx.lineWidth = canvasSize.value / 360;
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
          canvasSize.value / 48 / 3,
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
        point.x * blockInterval + blockInterval / 2,
        point.y * blockInterval + blockInterval / 2,
        blockInterval / 2,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = point.type === "black" ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
      ctx.fill();
    });
  }

  onMounted(() => {
    const b_canvas = document.getElementById("b_canvas") as HTMLCanvasElement;
    const g_canvas = document.getElementById("g_canvas") as HTMLCanvasElement;
    const b_ctx = b_canvas.getContext("2d");
    const g_ctx = g_canvas.getContext("2d");

    const updateCanvasSize = () => {
      if (window.innerWidth < maxSize) {
        canvasSize.value = window.innerWidth;
      } else {
        canvasSize.value = maxSize;
      }
      b_canvas.width = g_canvas.width = canvasSize.value;
      b_canvas.height = g_canvas.height = canvasSize.value;
    };

    const redrawBoard = () => {
      if (b_ctx) {
        b_ctx.clearRect(0, 0, b_canvas.width, b_canvas.height);
        b_ctx.fillStyle = "#ffa701";
        b_ctx.fillRect(0, 0, b_canvas.width, b_canvas.height);

        const margin = canvasSize.value / boardSize / 2;
        const blockInterval = canvasSize.value / boardSize;

        drawBoard(b_ctx, boardSize, blockInterval, margin);
        drawClickedPoints(b_ctx, blockInterval);
      }
    };

    updateCanvasSize();
    redrawBoard();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = g_canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const margin = canvasSize.value / boardSize / 2;
      const blockInterval = canvasSize.value / boardSize;
      if (g_ctx) {
        g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
        for (let i = 0; i <= boardSize; i++) {
          for (let j = 0; j <= boardSize; j++) {
            const nearX = i * blockInterval + margin;
            const nearY = j * blockInterval + margin;

            // 마우스가 교차점에 근접했는지 확인
            if (Math.abs(x - nearX) <= margin && Math.abs(y - nearY) <= margin) {
              if (board[i][j].type === "") {
                // 마우스 위치에 투명한 원 그리기
                g_ctx.beginPath();
                g_ctx.arc(nearX, nearY, blockInterval / 2, 0, Math.PI * 2);
                g_ctx.fillStyle = thisType.value == "black" ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)";
                g_ctx.fill();
              }
            }
          }
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = g_canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const margin = canvasSize.value / boardSize / 2;
      const blockInterval = canvasSize.value / boardSize;

      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          const nearX = i * blockInterval + margin;
          const nearY = j * blockInterval + margin;

          // 마우스가 교차점에 근접했는지 확인
          if (Math.abs(x - nearX) <= margin && Math.abs(y - nearY) <= margin) {
            if (board[i][j].type === "") {
              // 클릭 위치 저장
              clickedPoints.value.push({ x: i, y: j, type: thisType.value });
              board[i][j].type = thisType.value;
              thisType.value = thisType.value == "black" ? "white" : "black";
              redrawBoard();
              break;
            }
          }
        }
      }
    };

    const handleResize = () => {
      updateCanvasSize();
      redrawBoard();
    };

    window.addEventListener("resize", handleResize);
    g_canvas.addEventListener("mousemove", handleMouseMove);
    g_canvas.addEventListener("click", handleClick);

    onUnmounted(() => {
      window.removeEventListener("resize", handleResize);
      g_canvas.removeEventListener("mousemove", handleMouseMove);
      g_canvas.removeEventListener("click", handleClick);
      // g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
    });
  });
</script>

<style lang="scss" scoped>
  .container {
    background-color: antiquewhite;
    display: flex;
    justify-content: center;
    .board_wrap {
      position: relative;
      margin: 0 auto;
      width: 720px;
      height: 720px;
      canvas {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
</style>
