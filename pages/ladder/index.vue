<template>
  <div class="container">
    <div v-if="!ladderStart" class="people_view">
      <div class="people_wrap">
        <span style="font-size: 30px"
          >인원을 정해주세요 <br />
          (최소 2명 ~ 최대 12명)</span
        >
        <div class="count_wrap">
          <button class="count_btn" :class="count <= 2 ? 'disabled' : ''" @click="count--">
            <span class="mdi mdi-menu-left-outline"></span>
          </button>
          <div>{{ count }}</div>
          <button class="count_btn" :class="count >= 12 ? 'disabled' : ''" @click="count++">
            <span class="mdi mdi-menu-right-outline"></span>
          </button>
        </div>
      </div>
      <span style="font-size: 30px">당첨항목을 적어주세요 <br /> </span>
      <div class="input_wrap">
        <div class="input_item" v-for="i in count" :key="i">
          <label :for="'input' + i">{{ i }}</label>
          <input type="text" :id="'input' + i" />
        </div>
      </div>
      <button class="start_btn" @click="ladderStarted">시작하기</button>
    </div>
    <div v-else class="ladder_view">
      <span style="font-size: 26px; margin: -30px 0 20px 0">이름과 당첨항목을 적어주세요</span>
      <div class="ladder_wrap">
        <div v-for="i in count" :key="i" class="ladderItem_wrap"></div>
      </div>
      <button @click="ladderStart = false">돌아가기</button>
    </div>
  </div>
</template>
<script setup>
  import meta from "../../data/meta.js";
  const count = ref(3);
  const ladderStart = ref(false);

  useHead(meta.ladder);

  function ladderStarted() {
    if (ladderStart.value == true) return;
    ladderStart.value = true;
  }
</script>
<style lang="scss" scoped>
  @import url("/assets/style/ladder.scss");
</style>
