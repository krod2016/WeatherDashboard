const weatherForm = document.querySelector('#weatherForm');
const weatherInput = document.querySelector('#weatherInput');
const currentWeather = document.querySelector('#currentWeather');
const searchList = document.querySelector('#searchList');
const forecastWeather = document.querySelector('#fiveDay');
const submitButton = document.querySelector('#submit');
const openKey = 'ee7cf386229176507f4fbdf87aa25e5f';
let searchArray = []

//recent searches 
const createRecentSearches = function () {
  if (JSON.parse(localStorage.getItem('searchItem'))) {
    const searchData = JSON.parse(localStorage.getItem('searchItem'));

    const searchList = recentSearchHandler;

    //shows searches from most recent 
    searchData.reverse();
    searchList.textContent = '';

    var searchDataKey = (function (item, index) {
      //shows 5 most recent
      if (index < 5) {
        const searchText = document.createElement('li');
        searchText.textContent = item;
        searchText.classList.add("capitalize");
        searchList.appendChild(searchText);
      }
    });
  }
}

//most recent city searched
const recentSearchHandler = function (event) {
  weatherInput.value = event.target.textContent;

  searchList.classList.toggle("show");

  const location = weatherInput.value.trim();
  if (location) {
    getWeather(location);
  }
  saveSearch(location);
}

const formSubmitHandler = function (event) {
  //prevents refreshing page
  event.preventDefault();

  const location = weatherInput.value.trim();
  if (location) {
    getWeather(location);
  }

  saveSearch(location);
  searchList.classList.remove("show");
}

//adds new searches
const saveSearch = function (searchTerm) {

  searchArray.push(searchTerm);
  localStorage.setItem('searchItem', JSON.stringify(searchArray));

  createRecentSearches();
}

//gives location latitude and longitude
const getWeather = async function (location) {
  const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${openKey}`)
  const weatherObj = await weatherRes.json()
  const { lat, lon } = weatherObj.coord
  console.log("Weather Log: ", weatherObj);

  const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${openKey}&units=imperial`)
  const forecastObj = await forecastRes.json()
  console.log("Forecast Log: ", forecastObj);

  getForecast(forecastObj)
};

// Gets daily forecast
const getForecast = function (data) {
  console.log("data", data);
  console.log(data.daily[0].dt)

  const currentDate = document.createElement("h2");
      const unixDate = data.daily[0].dt;
      currentDate.textContent = new Date(unixDate * 1000).toLocaleString('en-US', { weekday: 'long' });

  const currentForecast = document.createElement("h2");
  currentForecast.textContent = `${Math.round(data.current.temp)}°F`;
  
  const currentWindspeed = document.createElement("h2");
  currentWindspeed.textContent = `${Math.round(data.current.wind_speed)} MPH`;
  
  const currentHumidity = document.createElement("h2");
  currentHumidity.textContent = `${data.current.humidity}%`;

  document.getElementById("dailyForecastContainer").appendChild(currentDate);
  document.getElementById("dailyForecastContainer").appendChild(currentForecast);
  document.getElementById("dailyForecastContainer").appendChild(currentWindspeed);
  document.getElementById("dailyForecastContainer").appendChild(currentHumidity);

// Gets 5 day forecast
  data.daily.forEach(function (value, index) {
    if (index > 0 && index < 6) {
      const forecastContainer = document.createElement("div");
      forecastContainer.classList.add("text-center");

      const forecastDate = document.createElement("p");
      const unixDate = data.daily[index].dt;
      forecastDate.textContent = new Date (unixDate * 1000).toLocaleString('en-US', { weekday: 'long' });

      const forecastTemp = document.createElement("h2");
      forecastTemp.textContent = `${Math.round(value.temp.day)}°F`;

      const forecastWindSpeed = document.createElement("p");
      forecastWindSpeed.textContent = `${Math.round(value.wind_speed)} MPH`;

      const forecastHumidity = document.createElement("p");
      forecastHumidity.textContent = `${value.humidity}%`;

      forecastContainer.appendChild(forecastDate);
      forecastContainer.appendChild(forecastTemp);
      forecastContainer.appendChild(forecastWindSpeed);
      forecastContainer.appendChild(forecastHumidity);
      forecastWeather.appendChild(forecastContainer);
    }
  });
}

submitButton.addEventListener('click', formSubmitHandler);
createRecentSearches();
weatherInput.addEventListener('click', function (e) {
  // searchList.classList.toggle("show");
});

window.onclick = function (event) {
  if (!event.target.matches('#weatherInput') && !event.target.matches('#searchList')) {
    // searchList.classList.remove("show");
  }
}

window.onload = function () {
  createRecentSearches();

  // Get the most recent location from localstorage
  if (localStorage.getItem('searchItem')) {
    searchArray = JSON.parse(localStorage.getItem('searchItem'));
    searchArray.reverse();
  } else {
    searchArray = [""];
  }

  getWeather(searchArray[0]);

  weatherInput.value = searchArray[0];
};