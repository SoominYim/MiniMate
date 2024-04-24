import { defineStore } from "pinia";

const url_base = ref("https://api.openweathermap.org/data/2.5/");
const url_weather = ref("weather?q=seoul&units=metric&APPID=");
const url_forecast = ref("forecast?q=seoul&units=metric&appid=");
const months = ref(["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]);
const days = ref(["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]);
const weatherData = ref({});
const weatherDaily = ref({});

export const useWeather = defineStore("weather", (asd) => {
  const getDate = computed(() => {
    let d = new Date();
    let day = days.value[d.getDay()];
    let date = d.getDate();
    let month = months.value[d.getMonth()];
    let year = d.getFullYear();
    return `${year}년 ${month} ${date}일 ${day} `;
  });

  async function fetchData() {
    const fetchUrl = `${url_base.value}${url_weather}${process.env.VUE_APP_WEATHER_API_KEY}`;
    try {
      const response = await fetch(fetchUrl);
      const results = await response.json();
      setDate(results);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }

  async function fetchDataDaily() {
    const fetchUrl = `${url_base.value}${url_forecast}${process.env.VUE_APP_WEATHER_API_KEY}`;
    try {
      const response = await fetch(fetchUrl);
      const results = await response.json();
      setDaily(results);
    } catch (error) {
      console.error("Error fetching daily weather data:", error);
    }
  }

  function setDate(results) {
    weatherData.value = results;
  }

  function setDaily(results) {
    weatherDaily.value = results;
  }

  return {
    getDate,
    fetchData,
    fetchDataDaily,
  };
});
