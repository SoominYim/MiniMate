import { defineStore } from "pinia";

export const useWeather = defineStore("weather", {
  state: () => ({
    num: 0,
  }),
  actions: {
    count(num: number) {
      this.num++;
    },
  },
});
