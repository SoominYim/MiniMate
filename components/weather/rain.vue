<template>
  <div class="container">
    <div v-for="i in 50" class="drop" :style="'--i: ' + i" :key="i"></div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    pointer-events: none;
  }

  @function random_range($min, $max) {
    $rand: random();
    $random_range: $min + floor($rand * (($max - $min) + 1));
    @return $random_range;
  }

  .drop {
    $drop-count: 50;

    --drop-width: 1px;
    --drop-height: 72px;

    position: absolute;
    left: var(--drop-left, 0);
    bottom: var(--drop-bottom, 100%);
    width: var(--drop-width);
    height: var(--drop-height);
    background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.25));
    animation: fall var(--drop-fall-duration, 1s) var(--drop-fall-delay, 0s) linear infinite;

    @for $i from 1 through $drop-count {
      &:nth-child(#{$i}) {
        --ratio: calc(100 / #{$drop-count});
        --seed: calc(#{random_range(0, 10000)} / 100);
        --seed-percent: calc(var(--seed) / 100);
        --drop-left: calc(var(--i) * var(--ratio) * 1vw);
        --drop-bottom: calc(100% + #{100 / #{$drop-count}} / 100 * 1%);
        --drop-fall-duration: calc(1s + calc(var(--seed-percent) * 0.1 * 1s));
        --drop-fall-delay: calc(var(--seed-percent) * 1s);
      }
    }
  }

  @keyframes fall {
    0% {
      transform: translateY(0);
      opacity: 1;
    }

    65% {
      opacity: 1;
    }

    75% {
      transform: translateY(105vh);
      opacity: 0;
    }

    100% {
      transform: translateY(105vh);
      opacity: 0;
    }
  }
</style>
