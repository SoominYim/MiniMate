import { defineStore } from "pinia";

// 환경 변수 사용 예시
export const useWeather = defineStore("weather", () => {
  const url_base = "https://api.openweathermap.org/data/2.5/";
  const url_weather = "weather?q=seoul&units=metric&APPID=";
  const url_forecast = "forecast?q=seoul&units=metric&appid=";
  const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const weatherData = ref({});
  const weatherDaily = ref({});

  const config = useRuntimeConfig();

  const getDate = computed(() => {
    let d = new Date();
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    return `${year}년 ${month} ${date}일 ${day} `;
  });

  async function fetchData() {
    const fetchUrl = `${url_base}${url_weather}${config.public.weatherKey}`;
    try {
      const response = await fetch(fetchUrl);
      const results = await response.json();
      setDate(results);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }

  async function fetchDataDaily() {
    const fetchUrl = `${url_base}${url_forecast}${config.public.weatherKey}`;
    try {
      const response = await fetch(fetchUrl);
      const results = await response.json();
      setDaily(results);
    } catch (error) {
      console.error("Error fetching daily weather data:", error);
    }
  }

  function setDate(results: object) {
    weatherData.value = results;
  }

  function setDaily(results: object) {
    weatherDaily.value = results;
  }

  return {
    weatherData,
    weatherDaily,
    getDate,
    fetchData,
    fetchDataDaily,
    days,
  };
});
