import axios, { isCancel, AxiosError } from "axios";

function Javascript() {
  let apiKey = "a9b525cfaeea4a0447315d17428bd246";
  let searchButton = document.querySelector("#Search-button");
  let cityNameElement = document.querySelector("#city-name");
  let temperatureElement = document.querySelector("#temperature");
  let windElement = document.querySelector("#wind");
  let precipitationElement = document.querySelector("#precipitation");
  let weatherDescriptionElement = document.querySelector(
    "#weather-description"
  );
  let humidityElement = document.querySelector("#humidity");

  function getInitialWeather(cityName) {
    getWeatherData(cityName, apiKey, function (error, weatherData) {
      if (error) {
        alert(error);
      } else {
        cityNameElement.textContent = weatherData.cityName;
        updateWeatherUI(weatherData);
      }
    });

    getWeeklyWeatherData(cityName, apiKey, function (error, weeklyWeatherData) {
      if (error) {
        alert(error);
      } else {
        updateWeeklyWeatherUI(weeklyWeatherData);
      }
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    getInitialWeather("Johannesburg");
  });
  function getWeatherData(cityName, apiKey, callback) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    function handleResponse(response) {
      let weatherData = {
        cityName: cityName,
        temperature: Math.round(response.data.main.temp),
        wind: response.data.wind.speed,
        precipitation: response.data.rain
          ? response.data.rain["1h"] || "0mm"
          : "0mm",
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        iconCode: response.data.weather[0].icon,
      };
      callback(null, weatherData);
    }

    function handleError(error) {
      callback(
        `Failed to fetch weather data for ${cityName}. Please try again later.`,
        null
      );
    }

    axios
      .get(apiUrl)
      .then(function (response) {
        handleResponse(response);
      })
      .catch(function (error) {
        handleError(error);
      });
  }

  function updateWeatherUI(weatherData) {
    cityNameElement.textContent = weatherData.cityName;
    temperatureElement.textContent = `${Math.round(weatherData.temperature)}°C`;
    windElement.textContent = `${weatherData.wind} km/h`;
    weatherDescriptionElement.textContent = weatherData.description;
    precipitationElement.textContent = weatherData.precipitation;
    humidityElement.textContent = `${weatherData.humidity}%`;

    const weatherIcon = document.getElementById("weather-icon");
    const iconCode = weatherData.iconCode;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
    weatherIcon.alt = weatherData.description;

    weatherIcon.style.display = "block";
  }

  function getWeeklyWeatherData(cityName, apiKey, callback) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    axios
      .get(apiUrl)
      .then(function (response) {
        callback(null, response.data.list);
      })
      .catch(function (error) {
        callback(
          `Failed to fetch weather data for ${cityName}. Please try again later.`,
          null
        );
      });
  }

  function updateWeeklyWeatherUI(weatherDataList) {
    let weeklyWeatherElement = document.querySelector(".weather-row");

    weeklyWeatherElement.innerHTML = ""; // Clear existing content

    let dailyWeatherData = {};

    weatherDataList.forEach((weatherData) => {
      let date = new Date(weatherData.dt * 1000); // Convert timestamp to Date
      let dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
      // Check if we already have weather data for this day
      if (!dailyWeatherData[dayOfWeek]) {
        dailyWeatherData[dayOfWeek] = {
          maxTemp: weatherData.main.temp_max,
          minTemp: weatherData.main.temp_min,
          iconCode: weatherData.weather[0].icon,
        };
      } else {
        // Compare temperatures and keep the forecast with the highest temperature (assuming it's the daytime forecast)
        if (weatherData.main.temp_max > dailyWeatherData[dayOfWeek].maxTemp) {
          dailyWeatherData[dayOfWeek].maxTemp = weatherData.main.temp_max;
        }
        if (weatherData.main.temp_min < dailyWeatherData[dayOfWeek].minTemp) {
          dailyWeatherData[dayOfWeek].minTemp = weatherData.main.temp_min;
        }
      }
    });

    // Create and add weather items for each day
    for (let dayOfWeek in dailyWeatherData) {
      let iconCode = dailyWeatherData[dayOfWeek].iconCode;
      let maxTemp = Math.round(dailyWeatherData[dayOfWeek].maxTemp);
      let minTemp = Math.round(dailyWeatherData[dayOfWeek].minTemp);

      let weatherItem = document.createElement("div");
      weatherItem.className = "col";
      weatherItem.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon" /><br />
      ${dayOfWeek}<br />
    <div class="weekly-temperature">
          <span class="max-temperature">${maxTemp}°</span>
          <span class="min-temperature">${minTemp}°</span>
        </div>`;

      weeklyWeatherElement.appendChild(weatherItem);
    }
  }

  function getWeather(event) {
    event.preventDefault();

    let searchInput = document.querySelector("#searchExample");
    let cityName = searchInput.value.trim();

    if (cityName === "") {
      alert("Please enter a city name.");
      return false;
    }

    getWeatherData(cityName, apiKey, function (error, weatherData) {
      if (error) {
        alert(error);
      } else {
        updateWeatherUI(weatherData);
      }
    });

    getWeeklyWeatherData(cityName, apiKey, function (error, weeklyWeatherData) {
      if (error) {
        alert(error);
      } else {
        updateWeeklyWeatherUI(weeklyWeatherData);
      }
    });
    getInitialWeather(cityName);
    getWeeklyWeatherData(cityName);
    return false;
  }

  searchButton.addEventListener("click", getWeather);
}

export default Javascript;
