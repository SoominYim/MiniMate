<template>
  <div
    class="container"
    :style="{
      display: !ladderStart ? 'flex' : 'block',
    }"
  >
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
          <button class="auto_btn" @click="autoInput()">자동내기</button>
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
        <div class="avatar_wrap">
          <div
            class="avatar"
            v-for="(_, i) in inputValue"
            :key="i"
            :style="{
              borderColor: randomColors[i],
            }"
            @click="getSelected(i)"
          >
            {{ i }}
          </div>
        </div>
        <div class="canvas_wrap" :style="{ width: 50 * count + 'px' }">
          <ladder-canvas></ladder-canvas>
        </div>
        <div class="ladderItem_wrap">
          <div v-for="(v, i) in inputValue" :key="i" class="result">
            {{ v }}
          </div>
        </div>
      </div>
      <button class="re_btn" @click="ladderStart = false">다시하기</button>
    </div>
  </div>
</template>
<script setup>
  import { useLadder } from "../../store/useLadder";
  import { storeToRefs } from "pinia";
  import meta from "../../data/meta.js";
  const store = useLadder();
  const { count, inputValue, settingError, randomColors } = storeToRefs(store);
  const { countUp, countDown, getSelected, generateRandomColors } = useLadder();
  const ladderStart = ref(false);

  useHead(meta.ladder);

  function updateInput(v, i) {
    inputValue.value[i] = v.replaceAll(" ", "");
    if (!inputValue.value.some((v) => v == "")) settingError.value = false;
  }

  function resetInput() {
    const inputs = document.querySelectorAll(".result_input");
    inputs.forEach((input, i) => {
      input.value = "";
      inputValue.value[i] = "";
    });
    settingError.value = false;
  }

  function autoInput() {
    inputValue.value.forEach((_, i) => (inputValue.value[i] = "꽝"));
    const randomIndex = Math.floor(Math.random() * inputValue.value.length);
    inputValue.value[randomIndex] = "당첨";
    settingError.value = false;
  }

  function ladderStarted() {
    if (ladderStart.value == true) return;
    if (inputValue.value.some((v) => v == "")) {
      settingError.value = true;
      return;
    }
    ladderStart.value = true;
    generateRandomColors();
  }

  onMounted(() => {
    generateRandomColors();
  });
</script>
<style lang="scss" scoped>
  @import url("/assets/style/ladder.scss");
</style>
