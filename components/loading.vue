<template>
  <div
    class="convertLoading"
    style="background: rgba(0, 0, 0, 0.3); width: 100%; height: calc(100% - 50px); position: absolute; z-index: 9999"
  >
    <div class="loading-overlay">
      <div class="loader"></div>
    </div>
    <div style="position: relative; font-size: 50px; color: #f3f3f3; top: calc(50% - -75px); text-align: center">
      <span>로딩중</span>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loader {
    border: 16px solid #f3f3f3; /* 회색 테두리 */
    border-top: 16px solid #41b883; /* 파란색 테두리 */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite; /* 회전 애니메이션 */
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
