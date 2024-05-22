import { defineStore } from "pinia";

export const useLadder = defineStore("ladder", () => {
  const count = ref(3);
  const inputValue = ref(["", "", ""]);
  const settingError = ref(false);
  const selectedAvatar = ref();
  const isPlay = ref(false);
  const randomColors = ref<string[]>([]);
  function countDown() {
    inputValue.value.pop();
    count.value--;
  }

  function countUp() {
    inputValue.value.push("");
    count.value++;
    generateRandomColors();
  }
  function getSelected(i: number) {
    if (!isPlay.value) selectedAvatar.value = i;
  }
  function generateRandomColors() {
    randomColors.value = Array.from(
      { length: count.value },
      () =>
        `rgba(${Math.floor(Math.random() * 255) + 1}, ${Math.floor(Math.random() * 255) + 1}, ${
          Math.floor(Math.random() * 255) + 1
        }, 1)`
    );
  }

  return {
    count,
    inputValue,
    settingError,
    selectedAvatar,
    countDown,
    countUp,
    getSelected,
    isPlay,
    randomColors,
    generateRandomColors,
  };
});
