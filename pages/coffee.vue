<template>
  <div class="container">
    <span :style="{ fontSize: `30px` }">커피 살 사람을 뽑아주세요</span>
    <div
      class="input-box"
      :style="{ height: '50px', display: 'flex', justifyContent: `center`, alignItems: 'center', gap: `20px` }"
    >
      <input v-if="choice === ''" type="text" class="peopleInput" v-model="input" @keydown.enter="addPeople" />
      <button v-if="choice === ''" @click="addPeople" :style="{ fontSize: `24px` }">추가</button>
    </div>
    <div v-if="choice === ''" ref="peopleBox" class="people-box">
      <p v-if="people.length <= 0" :style="{ fontSize: `30px`, display: 'block', margin: `0 auto` }">
        {{ "인원을 추가해주세요" }}
      </p>
      <div class="people_item" v-for="(p, i) in people" :key="i">
        <span :style="{ fontSize: `20px` }">{{ p }}</span>
        <div>
          <button :style="{ fontSize: `20px` }" @click="delPeople(i)">X</button>
        </div>
      </div>
    </div>
    <div v-else class="people-box" :style="{ height: `${boxHeight}px`, display: `flex`, justifyContent: `center` }">
      <span :style="{ fontSize: `30px`, alignItems: 'center' }">{{ choice }}</span>
    </div>
    <button v-if="choice === ''" @click="choicePeople">커피 살 사람?</button>
    <button :disabled="isButtonDisabled" v-else @click="rePeople">{{ reTitle }}</button>

    <p :style="{ fontSize: '24px', color: `red` }" v-if="isPeopleError">2명 이상이어야 합니다</p>
    <p :style="{ fontSize: '24px', color: `red` }" v-if="isDuplicationError">
      중복 이름은 구분지어 주세요 <br />(ex: 홍길동1,홍길동2)
    </p>
  </div>
</template>

<script setup lang="ts">
  const choice = ref("");
  const people = ref([]);
  const input = ref("");

  const isPeopleError = ref(false);
  const isDuplicationError = ref(false);
  const isButtonDisabled = ref(false);

  const reTitle = ref("커피 살 사람?");
  const boxHeight = ref(0);
  function addPeople() {
    if (input.value.length < 1) return;
    if (people.value.includes(input.value)) {
      isDuplicationError.value = true;
      return;
    } else {
      isDuplicationError.value = false;
    }

    if (input.value.length > 0) people.value.push(input.value.replaceAll(" ", ""));
    if (isPeopleError.value && people.value.length === 2) isPeopleError.value = false;
    input.value = "";
  }

  function delPeople(i) {
    people.value.splice(i, 1);
  }

  function choicePeople() {
    const peopleBox = document.querySelector(".people-box");
    if (people.value.length < 2) return (isPeopleError.value = true);

    choice.value = "뽑는중...";
    isButtonDisabled.value = true;

    setTimeout(() => {
      choice.value = people.value[Math.floor(Math.random() * people.value.length)];
      reTitle.value = "다시 뽑기";
      isButtonDisabled.value = false;
    }, 2000);
    boxHeight.value = peopleBox.getBoundingClientRect().height;
  }
  function rePeople() {
    choice.value = "";
  }
</script>

<style lang="scss" scoped>
  @import url("/assets/style/coffee.scss");
</style>
