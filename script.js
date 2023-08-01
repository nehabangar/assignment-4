let selectedCityId = null;

const weatherConditionToGIFKeyword = {
  Clear: "sunny sky",
  Clouds: "cloudy",
  Rain: "rain",
  Snow: "snow",
  Thunderstorm: "thunderstorm",
  Drizzle: "drizzle",
  Mist: "fog",
  Smoke: "smoke",
  Haze: "haze",
  Dust: "dust",
  Sand: "sand",
  Ash: "ash",
  Squall: "squall",
  Tornado: "tornado",
};

async function getWeatherAndGIF() {
  const location = document.getElementById("location").value;
  try {
    const cities = await searchCities(location);
    if (cities.length === 0) {
      throw new Error("City not found");
    } else if (cities.length === 1) {
      selectedCityId = cities[0].id;
      const weatherResult = await getWeatherData(selectedCityId);
      const gifResult = await getGIF(weatherResult.weather[0].main);
      displayWeather(weatherResult);
      displayGIF(gifResult);
    } else {
      displayCitySelection(cities);
    }
  } catch (error) {
    displayError(error.message);
  }
}

async function searchCities(location) {
  const apiKey = "b6f54e6aa35cb3f3a2a53fb693f982e1";
  const apiUrl = `https://api.openweathermap.org/data/2.5/find?q=${location}&units=metric&appid=${apiKey}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("City search failed");
  }
  const data = await response.json();
  return data.list;
}

async function getWeatherData(cityId) {
  const apiKey = "b6f54e6aa35cb3f3a2a53fb693f982e1";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&appid=${apiKey}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Weather data not found");
  }
  const data = await response.json();
  return data;
}

async function getGIF(weatherCondition) {
  const gifKeyword = weatherConditionToGIFKeyword[weatherCondition];
  if (!gifKeyword) {
    throw new Error("GIF not found for this weather condition");
  }

  const apiKey = "2GGhMBThamriG7BLTqC121NIO777s5Xi";
  const apiUrl = `https://api.giphy.com/v1/gifs/random?tag=${gifKeyword}&api_key=${apiKey}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("GIF not found");
  }
  const data = await response.json();
  return data.data.images.original.url;
}

function displayWeather(weatherData) {
  const weatherElement = document.getElementById("weather");
  weatherElement.innerHTML = `
    <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
    <p>${weatherData.weather[0].description}</p>
    <p>Temperature: ${weatherData.main.temp}°C</p>
    <p>Humidity: ${weatherData.main.humidity}%</p>
  `;
}

function displayGIF(gifUrl) {
  const gifElement = document.getElementById("gif");
  gifElement.innerHTML = `<img src="${gifUrl}" alt="GIF">`;
}

function displayError(errorMessage) {
  const errorElement = document.getElementById("error");
  errorElement.innerText = errorMessage;
}

function displayCitySelection(cities) {
  const cityElement = document.getElementById("city");
  const options = cities
    .map((city) => `<option value="${city.id}">${city.name}, ${city.sys.country}</option>`)
    .join("");
  cityElement.innerHTML = `
    <select onchange="selectCity(this)">
      ${options}
    </select>
    <button onclick="submitCity()">Submit</button>
  `;
}

function selectCity(selectElement) {
  selectedCityId = selectElement.value;
}

async function submitCity() {
  try {
    if (!selectedCityId) {
      throw new Error("Please select a city");
    }
    const weatherResult = await getWeatherData(selectedCityId);
    const gifResult = await getGIF(weatherResult.weather[0].main);
    displayWeather(weatherResult);
    displayGIF(gifResult);
  } catch (error) {
    displayError(error.message);
  }
}
