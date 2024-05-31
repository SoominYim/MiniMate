<template>
  <loading v-if="isLoading" />
  <div
    v-show="!isLoading"
    class="container"
    :style="{ width: windowWidth + 'px', flexWrap: windowWidth > maxSize ? 'nowrap' : 'wrap' }"
  >
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
    <div
      class="table_wrap"
      :style="{
        width: canvasSize + 'px',
      }"
    >
      <div class="user_wrap">
        <div class="black_count">
          <div class="title">흑돌</div>
          <div class="count">
            {{ blackCount }}
          </div>
        </div>
        <div class="white_count">
          <div class="title">백돌</div>
          <div class="count">
            {{ whiteCount }}
          </div>
        </div>
      </div>
      <div class="count_setting_wrap" v-if="!gameStart">
        <div class="time_setting_title">시간 설정</div>
        <select v-model="minute" name="" id="" class="dropdown">
          <option>3</option>
          <option>5</option>
          <option>10</option>
          <option>15</option>
          <option>30</option>
          <option>60</option>
        </select>
      </div>
      <div v-if="!gameStart" class="setting_wrap">
        <div>오목판 크기 설정</div>
        <label for="a">15 * 15</label>
        <input type="radio" name="boardSize" v-model="boardSize" id="a" value="15" />
        <label for="b">19 * 19</label>
        <input type="radio" name="boardSize" v-model="boardSize" id="b" value="19" />
      </div>
      <div v-show="gameStart" class="btn_wrap">
        <button class="return_btn" :class="{ disabled: gameEnd }">무르기</button>
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

  const minute = ref(3);

  const blackCount = ref(`${minute.value}:00`);
  const whiteCount = ref(`${minute.value}:00`);

  const windowWidth = ref(0);

  let blackInterval: any = null;
  let whiteInterval: any = null;

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

  // 시간 설정
  const updateTime = () => {
    blackCount.value = `${minute.value}:00`;
    whiteCount.value = `${minute.value}:00`;
  };

  watch(minute, updateTime);

  const startBlackCountdown = () => {
    if (blackInterval) clearInterval(blackInterval);
    blackInterval = setInterval(() => {
      const [min, sec] = blackCount.value.split(":").map(Number);
      if (min === 0 && sec === 0) {
        clearInterval(blackInterval);
        alert(`Player white wins!`);
        gameEnd.value = true;
      } else {
        let newMin = min;
        let newSec = sec - 1;
        if (newSec < 0) {
          newSec = 59;
          newMin = min - 1;
        }
        blackCount.value = `${newMin}:${newSec < 10 ? "0" + newSec : newSec}`;
      }
    }, 1000);
  };
  const startWhiteCountdown = () => {
    if (whiteInterval) clearInterval(whiteInterval);
    whiteInterval = setInterval(() => {
      const [min, sec] = whiteCount.value.split(":").map(Number);
      if (min === 0 && sec === 0) {
        clearInterval(whiteInterval);
        alert(`Player black wins!`);
        gameEnd.value = true;
      } else {
        let newMin = min;
        let newSec = sec - 1;
        if (newSec < 0) {
          newSec = 59;
          newMin = min - 1;
        }
        whiteCount.value = `${newMin}:${newSec < 10 ? "0" + newSec : newSec}`;
      }
    }, 1000);
  };

  // 게임 시작
  function startGame() {
    gameStart.value = true;
    gameEnd.value = false;

    startBlackCountdown();
  }

  // 보드판 그리기
  function drawBoard(ctx: CanvasRenderingContext2D, boardSize: number, blockInterval: number, margin: number) {
    for (var i = 1; i < boardSize; i++) {
      for (var j = 1; j < boardSize; j++) {
        // 정사각형 그리기
        ctx.lineWidth = canvasSize.value / 360;
        ctx.strokeStyle = "black";
        ctx.strokeRect(blockInterval * i - margin, blockInterval * j - margin, blockInterval, blockInterval);
      }
    }
  }

  // 클릭한 포인트에 수를 그려줌
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

  // 수를 둔 곳의 8방향을 탐색함
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

  // 5목을 만들었을시에 승리
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

    // canvasSize 반응형
    const updateCanvasSize = () => {
      if (window.innerWidth < maxSize) {
        canvasSize.value = window.innerWidth;
      } else if (window.innerWidth < maxSize * 2) {
        canvasSize.value = window.innerWidth / 2;
      } else {
        console.log(maxSize);
        canvasSize.value = maxSize;
      }
      b_canvas.width = g_canvas.width = canvasSize.value;
      b_canvas.height = g_canvas.height = canvasSize.value;
      windowWidth.value = window.innerWidth;
    };

    // 보드판 초기화
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

    // 게임 다시하기 시 보드판을 새로그리고 기존 board를 초기화
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

        updateTime();
        clearInterval(blackInterval);
        clearInterval(whiteInterval);
      }
    };
    const returnPoint = () => {
      if (clickedPoints.value.length > 2) {
        const lastPoint = clickedPoints.value.pop();
        if (lastPoint) {
          board[lastPoint.x][lastPoint.y].type = "";
          thisType.value = thisType.value == "black" ? "white" : "black";
          redrawBoard();
        }
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

    // 보드판에서 수를 두기전에 미리 놓을 자리를 보여줌
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

    // 마우스 무브와 동일함
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
                if (thisType.value === "black") {
                  clearInterval(blackInterval);
                  startWhiteCountdown();
                } else {
                  clearInterval(whiteInterval);
                  startBlackCountdown();
                }
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
    const returnBtn = document.querySelector(".return_btn");

    const handleResize = () => {
      updateCanvasSize();
      redrawBoard();
    };

    resetBtn?.addEventListener("click", resetGame);
    returnBtn?.addEventListener("click", returnPoint);

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
    gap: 10px;
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
      padding: 20px 25px 10px 10px;
      text-align: center;
      & > div:not(div:first-child) {
        margin-top: 50px;
      }
      .user_wrap {
        display: flex;
        flex-grow: 1;
        gap: 30px;
        div {
          width: 100%;
          .title {
            background-color: #333;
            color: #ccc;
            border-radius: 2px 2px 0 0;
            font-size: 24px;
          }
          .count {
            background-color: #eee;
            border: 1px #9ebdd2 solid;
            border-radius: 0 0 5px 5px;
            font-size: 24px;
          }
        }
      }
      .count_setting_wrap {
        font-size: 24px;
        .time_setting_title {
          font-size: 30px;
        }

        /* 드롭다운 스타일 */
        .dropdown {
          margin-top: 10px;
          width: 200px;
          padding: 10px;
          padding-right: 30px; /* 화살표 공간 확보 */
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #fff;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          font-size: 16px;
          color: #333;
          position: relative;
          background-color: #fff;
          &::after {
            content: "";
            position: absolute;
            top: 50%;
            right: 10px;
            width: 0;
            height: 0;
            border: 5px solid transparent;
            border-top-color: #333;
            pointer-events: none;
            transform: translateY(-50%);
          }

          /* 드롭다운 포커스 및 호버 스타일 */
          &:focus,
          &:hover {
            border-color: #888;
          }
        }
      }
      .setting_wrap {
        font-size: 24px;
        & div:first-child {
          margin-bottom: 20px;
          font-size: 30px;
        }
        label {
          margin-right: 6px;
          & ~ input {
            margin-right: 10px;
          }
        }
      }
      .btn_wrap {
        button {
          border: 3px #333 solid;
          background-color: #41b883;
          border-radius: 10px;
          font-size: 20px;
          width: 100px;
          height: 60px;
          &:first-child {
            margin-right: 20px;
          }
          &.disabled {
            background-color: #888;
            pointer-events: none;
          }
        }
      }
    }
  }
</style>
