import { defineStore } from "pinia";

export const useLadder = defineStore("ladder", () => {
  const count = ref(3);
  const inputValue = ref(["", "", ""]);

  function countDown() {
    inputValue.value.pop();
    count.value--;
    console.log(count.value);
  }

  function countUp() {
    inputValue.value.push("");
    count.value++;
    console.log(count.value);
  }

  function autoInput(settingError: any) {
    inputValue.value.forEach((_, i) => (inputValue.value[i] = "꽝"));
    const randomIndex = Math.floor(Math.random() * inputValue.value.length);
    inputValue.value[randomIndex] = "당첨";
    settingError.value = false;
  }

  return {
    count,
    inputValue,
    countDown,
    countUp,
    autoInput,
  };
});
