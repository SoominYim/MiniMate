<template>
  <div id="stars-container">
    <!-- 첫 번째 크기의 별들 -->
    <div class="stars"></div>
    <!-- 두 번째 크기의 별들 -->
    <div class="stars1"></div>
    <!-- 세 번째 크기의 별들 -->
    <div class="stars2"></div>
  </div>
</template>

<script>
  export default {
    name: "MiniStar",
    mounted() {},
  };
</script>

<style lang="scss" scoped>
  /* 파티클 애니메이션에 사용되는 변수들 */
  $starFieldWidth: 2560;
  $starFieldHeight: 2560;
  $starStartOffset: 600px;
  $starOneScrollDuration: 400s;
  $starTwoScrollDuration: 700s;
  $starThreeScrollDuration: 900s;
  $numStarOneStars: 1700;
  $numStarTwoStars: 300;
  $numStarThreeStars: 200;
  $numShootingStars: 10;

  /* 별들의 위치와 색상을 랜덤으로 생성하는 함수 */
  @function create-stars($n) {
    $stars: "#{random($starFieldWidth)}px #{random($starFieldHeight)}px #fff";

    @for $i from 2 through $n {
      $stars: "#{$stars} , #{random($starFieldWidth)}px #{random($starFieldHeight)}px #FFF";
    }

    @return unquote($stars);
  }

  /* 요소를 가운데 정렬하는 데 사용되는 믹스인 */
  @mixin translate50 {
    -webkit-transform: translate(-50, -50%);
    -ms-transform: translate(-50, -50%);
    -o-transform: translate(-50, -50%);
    transform: translate(-50, -50%);
  }

  /* 별들의 공통 스타일과 애니메이션 속성을 설정하는 믹스인 */
  @mixin star-template($numStars, $starSize, $scrollSpeed) {
    z-index: 10;
    width: $starSize;
    height: $starSize;
    border-radius: 50%;
    background: transparent;
    /* 별들의 위치와 색상 설정 */
    box-shadow: create-stars($numStars);
    /* 별들의 스크롤 애니메이션 */
    animation: animStar $scrollSpeed linear infinite;

    /* 같은 모양과 위치에 또 다른 별들을 생성 */
    &:after {
      content: " ";
      top: -$starStartOffset;
      width: $starSize;
      height: $starSize;
      border-radius: 50%;
      position: absolute;
      background: transparent;
      /* 별들의 위치와 색상 설정 */
      box-shadow: create-stars($numStars);
    }
  }

  #stars-container {
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
    @include translate50;
  }

  /* 첫 번째 크기의 별들 스타일 */
  .stars {
    @include star-template($numStarOneStars, 1px, $starOneScrollDuration);
  }

  /* 두 번째 크기의 별들 스타일 */
  .stars1 {
    @include star-template($numStarTwoStars, 1.5px, $starTwoScrollDuration);
  }

  /* 세 번째 크기의 별들 스타일 */
  .stars2 {
    @include star-template($numStarThreeStars, 2px, $starThreeScrollDuration);
  }

  /* 키프레임 애니메이션: 별들이 스크롤되는 애니메이션 */
  @keyframes animStar {
    from {
      transform: translateY(0px);
    }

    to {
      transform: translateY(-#{$starFieldHeight}px) translateX(-#{$starFieldWidth}px);
    }
  }

  /* 키프레임 애니메이션: 사용되지 않는 깜빡 애니메이션 (예시) */
  @keyframes 깜빡 {
    10% {
      opacity: 1;
    }

    40% {
      opacity: 0.2;
    }

    70% {
      opacity: 0.7;
    }

    100% {
      opacity: 1;
    }
  }
</style>
