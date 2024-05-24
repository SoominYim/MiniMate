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
          <div
            v-for="(v, i) in 16"
            :class="['item', 'tile', 'tile--' + tile[i]]"
            :style="{ left: (i % 4) * 100 + 'px', top: Math.floor(i / 4) * 100 + 'px' }"
          >
            {{ tile[i] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const tile = ref(Array.from({ length: 11 }, (v, i) => 2 ** (i + 1)));

  onMounted(() => {});
</script>

<style lang="scss">
  .game_wrap {
    display: flex;
    justify-content: center;
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
        .tile {
          z-index: 2;
          color: #f8ffe5;
          display: flex;
          position: absolute;
          width: 100px;
          height: 100px;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          align-items: center;
          transition: 110ms ease-in-out;
          border-radius: 3px;
          border: 7px solid #9a9a95;
          box-sizing: border-box;
          &--2 {
            background-color: #ffc43d;
          }
          &--4 {
            background-color: #ef476f;
          }
          &--8 {
            background-color: #1b9aaa;
          }
          &--16 {
            background-color: #06d6a0;
          }
          &--32 {
            background-color: lighten(#ef476f, 15%);
          }
          &--64 {
            background-color: lighten(#1b9aaa, 15%);
          }
          &--128 {
            background-color: lighten(#06d6a0, 15%);
          }
          &--256 {
            background-color: lighten(#ffc43d, 15%);
          }
          &--512 {
            background-color: lighten(#ef476f, 30%);
            color: #aaa;
          }
          &--1024 {
            background-color: lighten(#1b9aaa, 40%);
            color: #aaa;
          }
          &--2048 {
            background-color: lighten(#06d6a0, 40%);
            color: #555;
          }
        }
      }
    }
  }
</style>
