<template>
  <div>
    <div class="game_wrap">
      <div class="game">
        <div class="item_wrap">
          <div
            v-for="(v, i) in 16"
            class="item_backGround"
            :style="{ left: (i % 4) * 100 + 'px', top: Math.floor(i / 4) * 100 + 'px' }"
          ></div>
          <div v-for="(v, i) in 16" class="item"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  console.log(Array.from({ length: 16 }, (v, i) => i * 100));
</script>

<style lang="scss">
  .game {
    position: relative;
    margin: 0 auto;
    background: #9a9a95;
    padding: 7px;
    display: inline-block;
    border-radius: 3px;
    box-sizing: border-box;
    .item_wrap {
      border-radius: 6px;
      position: relative;
      width: 400px;
      height: 400px;
      .item_backGround {
        display: block;
        color: #f8ffe5;
        position: absolute;
        width: 100px;
        height: 100px;
        box-sizing: border-box;
        z-index: 1;
        text-align: center;
        border: 7px solid #9a9a95;
        background-color: #f8ffe5;
      }
    }
  }
</style>
