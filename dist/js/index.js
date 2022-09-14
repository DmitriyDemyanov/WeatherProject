class Time {
  constructor({ time }) {
    this.timeElements = [...document.querySelectorAll(time)];

    this.time = null;

    this.updateTime();
  }

  updateTime() {
    const now = new Date(Date.now());
    this.time = now.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    this.renderTime();
  }

  renderTime() {
    console.log(this.timeElements);
    this.timeElements.forEach((el) => (el.textContent = this.time));
    setTimeout(() => this.updateTime(), 60000);
  }
}

class Weather {
  constructor() {
    this.loader = document.querySelector(".loader");
    this.weatherWrapper = document.querySelector(".daily-weather");
    this.currentTemp = document.querySelector(".current-temp");
    this.feelTemp = document.querySelector(".feel-temp");
    this.currentdescr = document.querySelector(".temperature_subtitle");
    this.humidity = document.querySelector(".humidity");
    this.wind = document.querySelector(".wind");
    this.windDirection = document.querySelector(".wind-direction");
    this.pressure = document.querySelector(".pressure");
    this.mainImage = document.querySelector(".main-image");
    this.visibility = document.querySelector(".visibility");
    this.sunrise = document.querySelector(".sunrise");
    this.sunset = document.querySelector(".sunset");

    this.url =
      "https://api.openweathermap.org/data/2.5/weather?lat=50.404815&lon=30.651682&units=metric&lang=ru&appid=4a181470a6cb181dfbf7ea732910d5c2";
    this.forecastUrl =
      "https://api.openweathermap.org/data/2.5/forecast?lat=50.404815&lon=30.651682&units=metric&lang=ru&appid=4a181470a6cb181dfbf7ea732910d5c2";
    this.updateWeather();
  }

  updateWeather() {
    this.fetchCurrent();
    this.fetchForecast();
  }

  convertToTime(sec) {
    const time = sec * 1000;
    const date = new Date(time);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  convertToDate(ms) {
    return new Date(ms).getDate();
  }

  async fetchForecast() {
    const res = await this.fetchWeather(this.forecastUrl);
    console.log(">>>>>");
    console.log(res);
    let date = this.convertToDate(Date.now());
    console.log(date);
    const filteredList = res.list.filter((el) => {
      const elDate = this.convertToDate(el.dt * 1000);
      if (date !== elDate && el.dt_txt.includes("12:00:00")) {
        return true;
      }
      return false;
    });
    console.log("----", filteredList);
  }

  async fetchCurrent() {
    const res = await this.fetchWeather(this.url);
    console.log(res);

    this.loader.classList.add("hide");
    this.weatherWrapper.classList.remove("hide");

    this.mainImage.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`
    );
    this.currentTemp.textContent = Math.round(res.main.temp);
    this.feelTemp.textContent = Math.round(res.main.feels_like);
    this.currentdescr.textContent = res.weather[0].description;
    this.humidity.textContent = res.main.humidity;
    this.wind.textContent = res.wind.speed;
    this.windDirection.style.transform = `rotate(${res.wind.deg}deg)`;
    this.pressure.textContent = res.main.pressure;
    this.visibility.textContent = res.visibility;
    this.sunrise.textContent = this.convertToTime(res.sys.sunrise);
    this.sunset.textContent = this.convertToTime(res.sys.sunset);
  }

  fetchWeather(url) {
    return fetch(url).then((res) => res.json());
  }
}

const siteTime = new Time({
  time: ".current-time",
});

const siteWeather = new Weather();
