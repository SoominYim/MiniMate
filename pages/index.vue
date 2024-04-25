<template>
  <weather-star v-show="new Date().getHours() >= 20 || new Date().getHours() < 6"></weather-star>
  <main :style="{ background: backgroundStyle }" class="h-100">
    <weather-rain v-if="isRain" />
    <weather-snow v-if="isSnow" />

    <div class="weather-wrap" v-if="weather.weatherData.main !== undefined && weather.weatherDaily.list !== undefined">
      <div class="location-box">
        <div class="location">서울</div>
        <div class="date">{{ weather.getDate }}</div>
      </div>
      <div class="weather-box">
        <div class="temp">
          <div>{{ filteredWeatherList[0].main.temp.toFixed(1) }}°</div>
          <div class="min_max">
            <span class="min">
              {{
                weather.weatherDaily.list
                  .filter((v) => new Date().getDate() === new Date(v.dt_txt).getDate())
                  .map((v) => v.main.temp)
                  .reduce((min, temp) => Math.min(min, temp), Infinity)
                  .toFixed(1)
              }}°</span
            >/
            <span class="max">
              {{
                weather.weatherDaily.list
                  .filter((v) => new Date().getDate() === new Date(v.dt_txt).getDate())
                  .map((v) => v.main.temp)
                  .reduce((max, temp) => Math.max(max, temp), -Infinity)
                  .toFixed(1)
              }}°</span
            >
          </div>
          <v-img
            :width="100"
            :aspect-ratio="1"
            class="mx-auto"
            cover
            :src="`https://openweathermap.org/img/wn/${filteredWeatherList[0].weather[0].icon}@2x.png`"
          ></v-img>
          <div class="weather">{{ filteredWeatherList[0].weather[0].main }}</div>
        </div>
        <v-sheet class="mx-auto mt-8" elevation="3" max-width="800" theme="false" rounded>
          <v-slide-group v-model="model" class="pa-4" selected-class="selected" center-active>
            <v-slide-group-item
              v-for="(item, i) in filteredWeatherList"
              :key="i"
              v-slot="{ isSelected, toggle, selectedClass }"
            >
              <v-card
                color="rgba(255, 255, 255, 0.25)"
                :class="['ma-4', selectedClass]"
                height="130"
                width="70"
                @click="toggle"
              >
                <div class="isDay pt-2">
                  <div v-if="new Date(item.dt_txt).getDate() === new Date().getDate()" class="today">오늘</div>
                  <div v-else-if="new Date(item.dt_txt).getDate() === new Date().getDate() + 1" class="tomorrow">
                    내일
                  </div>
                  <div v-else-if="new Date(item.dt_txt).getDate() === new Date().getDate() + 2" class="afterTomorrow">
                    내일모레
                  </div>
                  <div
                    v-else-if="new Date(item.dt_txt).getDate() === new Date().getDate() + 3"
                    class="postAfterTomorrow"
                  >
                    글피
                  </div>
                  <div class="postAfterTomorrow" v-else>먼훗날</div>
                </div>
                <div class="d-flex fill-height align-center flex-column justify-center pb-6">
                  <v-img
                    :width="60"
                    :aspect-ratio="1"
                    class="mt-10"
                    cover
                    :src="`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`"
                  ></v-img>
                  <div class="text-center date-text">
                    {{ formatDate(item.dt_txt, i) }}<br />
                    {{ item.main.temp.toFixed(1) }}°
                  </div>
                </div>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>

          <v-expand-transition>
            <v-sheet v-if="model != null" height="130">
              <div class="d-flex fill-height align-center justify-center">
                <h3 class="text-h6">
                  강수 확률: {{ ~~(filteredWeatherList[model].pop * 100) }}%
                  <br />
                  강수량:
                  {{
                    filteredWeatherList[model].snow
                      ? filteredWeatherList[model].snow["3h"]
                        ? filteredWeatherList[model].snow["3h"] + "mm"
                        : "데이터 없음"
                      : filteredWeatherList[model].rain
                      ? filteredWeatherList[model].rain["3h"]
                        ? filteredWeatherList[model].rain["3h"] + "mm"
                        : "데이터 없음"
                      : "데이터 없음"
                  }}
                  <br />
                  바람 속도: {{ filteredWeatherList[model].wind.speed }}m/s
                  <br />
                  습도: {{ filteredWeatherList[model].main.humidity }}%
                </h3>
              </div>
            </v-sheet>
          </v-expand-transition>
        </v-sheet>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
  import { useWeather } from "/store/useWeather.ts";
  const weather = useWeather();
  const model = ref(null);
  weather.fetchData();
  weather.fetchDataDaily();

  const filteredWeatherList = computed(() => {
    if (weather.weatherDaily.list && weather.weatherDaily.list.length > 0) {
      const currentTime = new Date();
      const currentDateString = currentTime.toISOString().slice(0, 10);

      // 현재 시간 이후의 데이터 인덱스 찾기
      let startIndex = weather.weatherDaily.list.findIndex((item) => {
        const itemDate = new Date(item.dt_txt.replace(/-/g, "/"));
        const itemDateString = itemDate.toISOString().slice(0, 10);
        if (itemDateString > currentDateString) return true;
        else if (itemDateString < currentDateString) return false;
        else {
          return (
            parseInt(item.dt_txt.substring(11, 13)) > currentTime.getHours() ||
            currentTime.getHours() - item.dt_txt.substring(11, 13) <= 2
          );
        }
      });
      // 현재 시간 이후의 데이터만 필터링하여 반환
      return weather.weatherDaily.list.slice(startIndex);
    } else {
      return [];
    }
  });

  const isSnow = computed(() => {
    return filteredWeatherList.length > 0 && filteredWeatherList[0].weather[0].main === "Snow";
  });
  const isRain = computed(() => {
    return filteredWeatherList.length > 0 && filteredWeatherList[0].weather[0].main === "Rain";
  });

  const backgroundStyle = computed(() => {
    const currentTime = new Date().getHours();
    if (currentTime >= 6 && currentTime < 9) {
      return "linear-gradient(to bottom, rgba(220, 66, 37, 0.6), rgba(0, 47, 75, 0.8))"; // 06:00 ~ 09:00
    } else if (currentTime >= 9 && currentTime < 12) {
      return "linear-gradient(rgba(56, 127, 251, 0.8) 0%, rgba(52, 196, 255, 0.8) 30%, rgba(255, 198, 208, 0.8) 75%, rgba(255, 206, 170, 0.8) 95%)"; // 09:00 ~ 12:00
    } else if (currentTime >= 12 && currentTime < 17) {
      // 비 또는 눈이 오는지 확인
      if (isSnow === true || isRain === true) {
        return "linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75))"; // 비 또는 눈이 오는 경우
      } else {
        return "linear-gradient(to bottom, rgba(179, 140, 34, 0.75), rgba(236, 95, 24, 0.75))"; // 비 또는 눈이 오지 않는 경우
      }
    } else if (currentTime >= 17 && currentTime < 20) {
      return "linear-gradient(to bottom, rgba(0, 47, 75, 0.8), rgba(220, 66, 37, 0.6))"; // 17:00 ~ 20:00
    } else {
      return "linear-gradient(315deg, #2d3436 30%, #000000 74%)"; // 20:00 ~ 06:00
    }
  });

  const formatDate = computed(() => {
    return (t, i) => {
      const d = new Date(t);
      return `${i === 0 ? "지금" : d.getHours() + "시"} \n${weather.days[d.getDay()]}`;
    };
  });
</script>

<style lang="scss" scoped>
  main {
    transition: 0.4s;
    overflow: hidden;
    height: 100%;
    padding: 25px;
  }
  .location-box .location {
    color: #fff;
    font-size: 2rem;
    font-weight: 500;
    text-align: center;
    text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
  }
  .location-box .date {
    color: #fff;
    font-size: 20px;
    font-weight: 300;
    font-style: italic;
    text-align: center;
  }
  .weather-box {
    text-align: center;
  }
  .weather-box .temp {
    display: inline-block;
    padding: 10px 25px;
    color: #fff;
    font-size: 102px;
    font-weight: 900;
    text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 255, 255, 0.25);
    border-radius: 16px;
    margin: 30px 0px;
    box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  }
  .weather-box .weather {
    color: #fff;
    font-size: 48px;
    font-weight: 700;
    font-style: italic;
    text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  }
  .min_max {
    font-size: 50px;
    text-shadow: 1px 2px rgba(0, 0, 0, 0.25);
  }
  .min {
    color: #2178ef;
  }
  .max {
    color: #cd3534;
  }
  .date-text {
    color: #444;
    font-size: 15px;
    font-weight: bold;
    white-space: pre-line;
  }
  .v-sheet {
    background: rgba(255, 255, 255, 0.25);
  }
  .selected {
    --v-theme-overlay-multiplier: var(--v-theme-success-overlay-multiplier);
    background-color: rgba(255, 255, 255, 0.5) !important;
    color: rgba(255, 255, 255, 0.5) !important;
  }
  .isDay {
    position: absolute;
    width: 70px;
    font-size: 18px;
    font-weight: bold;
    z-index: 10;
    .today {
      color: #444;
    }
    .tomorrow {
      color: #7a59f1;
    }
    .afterTomorrow {
      color: #31889d;
    }
    .postAfterTomorrow {
      color: #975220;
    }
  }
  .isDay * {
    text-align: center;
  }

  @media all and (max-width: 767px) {
    .location-box .location {
      font-size: 1.5rem;
    }
    .location-box .date {
      font-size: 15px;
    }
    .weather-box .temp {
      font-size: 70px;
      margin: 15px 0px;
    }
    .weather-box .weather {
      font-size: 48px;
    }
    .min_max {
      font-size: 30px;
    }
  }
</style>
