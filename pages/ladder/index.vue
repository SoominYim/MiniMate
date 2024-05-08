<template>
  <div class="container">
    <div v-if="!ladderStart" class="people_view">
      <div class="people_wrap">
        <span style="font-size: 30px"
          >인원을 정해주세요 <br />
          (최소 2명 ~ 최대 12명)</span
        >
        <div class="count_wrap">
          <button class="count_btn" :class="count <= 2 ? 'disabled' : ''" @click="countDown">
            <span class="mdi mdi-menu-left-outline"></span>
          </button>
          <div>{{ count }}</div>
          <button class="count_btn" :class="count >= 12 ? 'disabled' : ''" @click="countUp">
            <span class="mdi mdi-menu-right-outline"></span>
          </button>
        </div>
      </div>
      <div class="setting_wrap">
        <span>내기설정</span>
        <div class="setting_error" v-if="settingError">내기설정을 해주세요</div>
        <div class="btn_area">
          <button class="reset_btn" @click="resetInput"><span class="mdi mdi-restore"></span>초기화</button>
          <button class="auto_btn" @click="autoInput">자동내기</button>
        </div>
      </div>
      <div class="input_wrap">
        <div class="input_item" v-for="i in count" :key="i">
          <label :for="'input' + i">{{ i }}</label>
          <input
            class="result_input"
            type="text"
            :id="'input' + i"
            @input="updateInput($event.target.value, i - 1)"
            :value="inputValue[i - 1]"
          />
        </div>
      </div>
      <button class="start_btn" @click="ladderStarted">시작하기</button>
    </div>
    <div v-else class="ladder_view">
      <span style="font-size: 26px; margin: -30px 0 20px 0">이름과 당첨항목을 적어주세요</span>
      <div class="ladder_wrap">
        <div v-for="(v, i) in inputValue" class="ladderItem_wrap" :key="i">{{ v }}</div>
      </div>
      <button @click="ladderStart = false">돌아가기</button>
    </div>
  </div>
</template>
<script setup>
  import meta from "../../data/meta.js";
  const count = ref(3);
  const ladderStart = ref(false);
  const inputValue = ref(["", "", ""]);
  const settingError = ref(false);

  useHead(meta.ladder);

  function countDown() {
    inputValue.value.pop();
    count.value--;
  }
  function countUp() {
    inputValue.value.push("");
    count.value++;
  }

  function updateInput(v, i) {
    inputValue.value[i] = v;
    if (!inputValue.value.some((v) => v == "")) settingError.value = false;
  }

  function resetInput() {
    const inputs = document.querySelectorAll(".result_input");
    inputs.forEach((input, i) => {
      input.value = "";
      inputValue.value[i] = "";
    });
  }

  function autoInput() {
    inputValue.value.forEach((_, i) => (inputValue.value[i] = "꽝"));
    const randomIndex = Math.floor(Math.random() * inputValue.value.length);
    inputValue.value[randomIndex] = "당첨";
  }

  function ladderStarted() {
    if (ladderStart.value == true) return;
    if (inputValue.value.some((v) => v == "")) {
      settingError.value = true;
      return;
    }

    ladderStart.value = true;
  }
</script>
<style lang="scss" scoped>
  @import url("/assets/style/ladder.scss");
</style>
