<template>
  <loading v-if="isLoading" />
  <div v-show="!isLoading" class="container" :style="{ width: windowWidth + 'px' }">
    <div class="board_wrap" :style="{ width: canvasSize + 'px', height: canvasSize + 'px' }">
      <canvas id="b_canvas"></canvas>
      <canvas id="g_canvas"></canvas>
      <div class="start_wrap" v-if="!gameStart" :style="{ width: canvasSize + 'px', height: canvasSize + 'px' }">
        <button
          @click="startGame"
          class="start_btn"
          :style="{
            width: canvasSize / 3 + 'px',
            height: canvasSize / 7.2 + 'px',
            fontSize: canvasSize / 240 + 'rem',
            left: canvasSize / 2 - canvasSize / 6 + 'px',
            top: canvasSize / 2 - canvasSize / 14.4 + 'px',
          }"
        >
          시작 하기
        </button>
      </div>
    </div>
    <div class="table_wrap">
      <div class="count">
        <div class="black_count">흑돌 : 3:00</div>
        <div class="white_count">백돌 : 3:00</div>
      </div>
      <div v-if="!gameStart" class="setting_wrap">
        <label for="a">15</label>
        <input type="radio" name="boardSize" v-model="boardSize" id="a" value="15" />
        <label for="b">19</label>
        <input type="radio" name="boardSize" v-model="boardSize" id="b" value="19" />
      </div>
      <div v-show="gameStart" class="btn_wrap">
        <button class="return_btn">무르기</button>
        <button class="reset_btn">다시하기</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from "vue";
  import meta from "../../data/meta.js";
  useHead(meta.omok);

  const isLoading = ref(true);

  interface Point {
    x: number;
    y: number;
    type: string;
  }
  const clickedPoints = ref<Point[]>([]);
  const thisType = ref("black");

  const boardSize = ref(15);
  let board = Array.from({ length: boardSize.value }, (_, i) =>
    Array.from({ length: boardSize.value }, (_, j) => ({ x: i, y: j, type: "" }))
  );
  const maxSize = 869;
  const canvasSize = ref(720);

  // 게임이 시작됐는지 확인
  const gameStart = ref(false);

  // 게임이 종료 되었는지 확인
  const gameEnd = ref(false);

  const blackCount = ref("3:00");
  const whiteCount = ref("3:00");

  const windowWidth = ref(0);

  const directions = [
    { dx: 1, dy: 0 }, // 오른쪽
    { dx: -1, dy: 0 }, // 왼쪽
    { dx: 0, dy: 1 }, // 아래쪽
    { dx: 0, dy: -1 }, // 위쪽
    { dx: 1, dy: 1 }, // 오른쪽 아래 대각선
    { dx: -1, dy: -1 }, // 왼쪽 위 대각선
    { dx: 1, dy: -1 }, // 오른쪽 위 대각선
    { dx: -1, dy: 1 }, // 왼쪽 아래 대각선
  ];

  function startGame() {
    gameStart.value = true;
  }

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

  function checkDirection(x: number, y: number, dx: number, dy: number, type: string): number {
    let count = 0;
    let nx = x + dx;
    let ny = y + dy;
    while (nx >= 0 && nx < boardSize.value && ny >= 0 && ny < boardSize.value && board[nx][ny].type === type) {
      count++;
      nx += dx;
      ny += dy;
    }
    return count;
  }

  function checkWin(x: number, y: number, type: string): boolean {
    for (const { dx, dy } of directions) {
      const count = 1 + checkDirection(x, y, dx, dy, type) + checkDirection(x, y, -dx, -dy, type);
      if (count >= 5) return true;
    }
    return false;
  }

  onMounted(() => {
    const b_canvas = document.getElementById("b_canvas") as HTMLCanvasElement;
    const g_canvas = document.getElementById("g_canvas") as HTMLCanvasElement;
    const b_ctx = b_canvas.getContext("2d");
    const g_ctx = g_canvas.getContext("2d");

    windowWidth.value = window.innerWidth;

    const updateCanvasSize = () => {
      if (window.innerWidth < maxSize) {
        canvasSize.value = window.innerWidth;
      } else {
        canvasSize.value = maxSize;
      }
      b_canvas.width = g_canvas.width = canvasSize.value;
      b_canvas.height = g_canvas.height = canvasSize.value;
      windowWidth.value = window.innerWidth;
    };

    const redrawBoard = () => {
      if (b_ctx) {
        b_ctx.clearRect(0, 0, b_canvas.width, b_canvas.height);
        b_ctx.fillStyle = "#ffa701";
        b_ctx.fillRect(0, 0, b_canvas.width, b_canvas.height);

        const margin = canvasSize.value / boardSize.value / 2;
        const blockInterval = canvasSize.value / boardSize.value;

        drawBoard(b_ctx, boardSize.value, blockInterval, margin);
        drawClickedPoints(b_ctx, blockInterval);
        isLoading.value = false;
      }
    };

    updateCanvasSize();
    redrawBoard();

    const resetGame = () => {
      if (b_ctx && g_ctx) {
        const margin = canvasSize.value / boardSize.value / 2;
        const blockInterval = canvasSize.value / boardSize.value;
        g_ctx.clearRect(0, 0, b_canvas.width, b_canvas.height);
        b_ctx.clearRect(0, 0, b_canvas.width, b_canvas.height);
        b_ctx.fillStyle = "#ffa701";
        b_ctx.fillRect(0, 0, b_canvas.width, b_canvas.height);
        drawBoard(b_ctx, boardSize.value, blockInterval, margin);

        board = Array.from({ length: boardSize.value }, (_, i) =>
          Array.from({ length: boardSize.value }, (_, j) => ({ x: i, y: j, type: "" }))
        );
        clickedPoints.value = [];

        gameStart.value = false;
        thisType.value = "black";
      }
    };

    // boardSize 선택 시 캔버스 다시 그리고, board 초기화
    watch(boardSize, () => {
      updateCanvasSize();
      redrawBoard();

      board = Array.from({ length: boardSize.value }, (_, i) =>
        Array.from({ length: boardSize.value }, (_, j) => ({ x: i, y: j, type: "" }))
      );
      clickedPoints.value = [];
    });
    const handleMouseMove = (e: MouseEvent) => {
      const rect = g_canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const margin = canvasSize.value / boardSize.value / 2;
      const blockInterval = canvasSize.value / boardSize.value;
      if (!gameEnd.value) {
        if (g_ctx) {
          g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
          for (let i = 0; i <= boardSize.value; i++) {
            for (let j = 0; j <= boardSize.value; j++) {
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
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = g_canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const margin = canvasSize.value / boardSize.value / 2;
      const blockInterval = canvasSize.value / boardSize.value;
      if (!gameEnd.value) {
        for (let i = 0; i < boardSize.value; i++) {
          for (let j = 0; j < boardSize.value; j++) {
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
                if (checkWin(i, j, board[i][j].type)) {
                  alert(`Player ${board[i][j].type} wins!`);
                  gameEnd.value = true;
                }
                break;
              }
            }
          }
        }
      }
    };

    const resetBtn = document.querySelector(".reset_btn");

    resetBtn?.addEventListener("click", resetGame);
    const handleResize = () => {
      updateCanvasSize();
      redrawBoard();
    };
    watch(clickedPoints, (newValue, oldValue) => {
      console.log(newValue);
      console.log(oldValue);
    });
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
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .board_wrap {
      position: relative;

      canvas {
        position: absolute;
        top: 0;
        left: 0;
      }
      .start_wrap {
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 2;
        position: relative;
        .start_btn {
          position: absolute;
          border: 3px #333 solid;
          background-color: #41b883;
          border-radius: 10px;
          font-size: 20px;
        }
      }
    }
    .table_wrap {
      .count {
        font-size: 30px;
      }
      .btn_wrap {
        button {
          border: 3px #333 solid;
          background-color: #41b883;
          border-radius: 10px;
          font-size: 20px;
          width: 100px;
          height: 60px;
        }
      }
    }
  }
</style>
