import { defineStore } from "pinia";

export const useLadder = defineStore("ladder", () => {
  const count = ref(12);
  const inputValue = ref(["", "", "", "", "", "", "", "", "", "", "", ""]);
  const settingError = ref(false);
  const selectedAvatar = ref();

  function countDown() {
    inputValue.value.pop();
    count.value--;
  }

  function countUp() {
    inputValue.value.push("");
    count.value++;
  }
  function getSelected(i: number) {
    selectedAvatar.value = i;
  }
  return {
    count,
    inputValue,
    settingError,
    selectedAvatar,
    countDown,
    countUp,
    getSelected,
  };
});
