<template>
  <div class="container">
    <div class="form">
      <div class="result_box">
        <span>{{ displayText }}</span>
      </div>
      <div class="radio-box-wrap">
        <div class="radio-box">
          <input
            type="radio"
            class="radio-btn"
            name="country_menu"
            id="all"
            value="all"
            @click="radioChange($event)"
            checked="checked"
          />
          <label class="radio-label" for="all">전체</label>
          <div class="spinner"></div>
        </div>
        <div class="radio-box" v-for="(country_menu, i) in Object.keys(groupedIndexes)" :key="i">
          <input
            type="radio"
            class="radio-btn"
            name="country_menu"
            :id="country_menu"
            @click="radioChange($event)"
            :value="country_menu"
          />
          <label class="radio-label" :for="country_menu">
            <span>
              {{
                country_menu === "korean"
                  ? "한식"
                  : country_menu === "chinese"
                  ? "중식"
                  : country_menu === "japanese"
                  ? "일식"
                  : country_menu === "western"
                  ? "양식"
                  : country_menu === "asian"
                  ? "아시안"
                  : "없는 나라"
              }}
            </span>
          </label>
        </div>
      </div>
      <span class="marker"></span>
      <!-- 결과값 -->
      <button type="button" :disabled="isButtonDisabled" @click="submitSelect()">{{ btnTitle }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import foods from "/data/foods";

  const selectedFood = ref("");
  const selectedCountry = ref("all");
  const groupedIndexes = {};

  const displayText = ref("종류를 선택하세요");
  const btnTitle = ref("뭐 먹지");
  const isButtonDisabled = ref(false);

  foods.forEach((v, i) => {
    const country = v.country;
    groupedIndexes[country] = [];
    groupedIndexes[country].push(i);
  });

  function radioChange(event) {
    selectedCountry.value = event.target.value;
  }

  /**
   *
   * @param {object} f
   * 랜덤으로 뽑을 object
   */

  function getRandomFood(f) {
    if (f.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * f.length);
    return f[randomIndex].food;
  }
  function submitSelect() {
    if (selectedCountry.value === "all") {
      selectedFood.value = getRandomFood(foods);
    } else {
      selectedFood.value = getRandomFood(foods.filter((v) => v.country === selectedCountry.value));
    }

    displayText.value = "뽑는중...";
    btnTitle.value = "뽑는중...";
    isButtonDisabled.value = true;

    setTimeout(() => {
      displayText.value = selectedFood.value;
      btnTitle.value = "다시 뽑기";
      isButtonDisabled.value = false;
    }, 2000);
  }
</script>

<style lang="scss" scoped>
  @import url("/assets/style/lunch.scss");
</style>
