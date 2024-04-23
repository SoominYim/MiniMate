import { defineStore } from "pinia";

const url_base = ref("https://api.openweathermap.org/data/2.5/");
const months = ref(["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]);
const days = ref(["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]);
const weatherData = ref({});
const weatherDaily = ref({});

export const useWeather = defineStore("weather", () => {
  const getDate = computed(() => {
    let d = new Date();
    let day = days.value[d.getDay()];
    let date = d.getDate();
    let month = months.value[d.getMonth()];
    let year = d.getFullYear();
    return `${year}년 ${month} ${date}일 ${day} `;
  });
  return { getDate };
});
