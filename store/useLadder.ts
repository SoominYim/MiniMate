import { defineStore } from "pinia";

export const useLadder = defineStore("ladder", () => {
  const count = ref(10);
  const inputValue = ref(["", "", "", "", "", "", "", "", "", ""]);
  const settingError = ref(false);

  function countDown() {
    inputValue.value.pop();
    count.value--;
  }

  function countUp() {
    inputValue.value.push("");
    count.value++;
  }

  return {
    count,
    inputValue,
    settingError,
    countDown,
    countUp,
  };
});
