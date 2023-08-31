import React, { useState } from "react";
import axios, { isCancel, AxiosError } from "axios";
import ReactAnimatedWeather from "react-animated-weather";
import "./App.css";

function Weather() {
  let [temperature, setTemperature] = useState(null);
  let [city, setCity] = useState("");
  let apiKey = "a9b525cfaeea4a0447315d17428bd246";

  const defaults = {
    icon: "CLEAR_DAY",
    color: "goldenrod",
    size: 25,
    animate: true,
  };
  const rain = {
    icon: "RAIN",
    color: "goldenrod",
    size: 25,
    animate: true,
  };

  function weather(response) {
    setTemperature(response.data.main.temp);
  }

  function handleSubmit(event) {
    event.preventDefault();
    let newCity = event.target.elements.city.value;
    setCity(newCity);
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${apiKey}&units=metric`;

    axios
      .get(apiUrl)
      .then(weather)
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        // Handle the error appropriately, e.g., show an error message to the user
      });
  }

  return (
    <div className="search">
      <form onSubmit={handleSubmit}>
        <div className="search-input">
          <input type="search" name="city" placeholder="Search City" />
          <button type="submit" value="search">
            Search
          </button>
        </div>
        <p>
          The temperature for {city} is {temperature}°C
        </p>

        <div className="weather-description">
          <ul>
            <li>Precipitation: 10%</li>
            <li>Humadity: 40 </li>
            <li>Wind: 5km/h</li>
          </ul>

          {/* <span id="humidity"></span> <br />
          <span id="wind"></span> */}
        </div>
        <div className="weekly-weather">
          <div className="col">
            <br />
            Mon <br />
            <div className="weekly-temperature">
              <ReactAnimatedWeather
                icon={defaults.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <br />
              <span className="max-temperature">19</span>
              {/* <span className="min-temperature">4</span> */}
            </div>
          </div>
          <div className="col">
            <br />
            Tue <br />
            <div className="weekly-temperature">
              <ReactAnimatedWeather
                icon={defaults.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />{" "}
              <br />
              <span className="max-temperature">22</span>
              {/* <span className="min-temperature">6</span> */}
            </div>
          </div>
          <div className="col">
            <br />
            Wed <br />
            <div className="weekly-temperature">
              <ReactAnimatedWeather
                icon={rain.icon}
                color={rain.color}
                size={rain.size}
                animate={rain.animate}
              />{" "}
              <br />
              <span className="max-temperature">25</span>
              {/* <span className="min-temperature">8</span> */}
            </div>
          </div>
          <div className="col">
            <br />
            Thu <br />
            <div className="weekly-temperature">
              <ReactAnimatedWeather
                icon={defaults.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
                className="weekly-icons"
              />{" "}
              <br />
              <span className="max-temperature">27</span>
              {/* <span className="min-temperature">11</span> */}
            </div>
          </div>
          <div className="col">
            <br />
            Fri <br />
            <div className="weekly-temperature">
              <ReactAnimatedWeather
                icon={rain.icon}
                color={rain.color}
                size={rain.size}
                animate={rain.animate}
              />{" "}
              <br />
              <span className="max-temperature">23</span>
              {/* <span className="min-temperature">7</span> */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Weather;
