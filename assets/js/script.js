const weatherForm = document.querySelector('#weatherForm');
const weatherInput = document.querySelector('#weatherInput');
const currentWeather = document.querySelector('#currentWeather');
const searchList = document.querySelector('#searchList');
const forecastWeather = document.querySelector('#fiveDay');
const submitButton = document.querySelector('#submit');
let lat;
let lon;
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
  // searchList.classList.remove("show");
}

//adds new searches
const saveSearch = function (searchTerm) {

  searchArray.push(searchTerm);
  localStorage.setItem('searchItem', JSON.stringify(searchArray));

  createRecentSearches();
}

//gives location latitude and longitude
const getWeather = function (location) {
  fetch(`https://dev.virtualearth.net/REST/v1/Locations?query=${location}&key=AlHqyYU_KwIAYUdgDdxmuZEdZI1CciCfJvl8u33LuVbx_bhnP1oMEp7hoqw7UIhF`)
    .then(function (response) {
      response.json()
        .then(function (data) {
          console.log(data)
          latitude = data.resourceSets[0].resources[0].bbox[0];
          longitude = data.resourceSets[0].resources[0].bbox[1];
        })

      //gets city's weather
  const weatherAPI = function() {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=ee7cf386229176507f4fbdf87aa25e5f`) 
  }
          const data = weatherAPI(function (response) {
            response.json().then(function (dataKey) {
              const temp = document.createElement("h1");
              temp.textContent = `${Math.round(dataKey.current.temp)}°F`;

              const locationText = document.createElement("h3");
              locationText.textContent = location;
              locationText.classList.add("card-text");
              locationText.classList.add("capitalize");

              const today = document.createElement("h3");
              today.textContent = "Today";
              today.classList.add("card-text", "-mb-2");

              const windSpeed = document.createElement("p");
              windSpeed.textContent = `Wind: ${Math.round(dataKey.current.wind_speed)} MPH`;
              windSpeed.classList.add("card-text");

              const humidity = document.createElement("p");
              humidity.textContent = `Humidity: ${dataKey.current.humidity}%`;
              humidity.classList.add("card-text");

              const uvIndexContainer = document.createElement("div");
              const uvIndex = document.createElement("p");
              const uvRating = document.createElement("span");
              uvIndex.textContent = dataKey.current.uvi;
              uvIndex.classList.add("card-text");
              uvRating.classList.add("card-text");

              uvIndexContainer.appendChild(uvIndex);
              uvIndex.appendChild(uvRating);

              const icon = document.createElement("img");
              const iconId = dataKey.current.weather[0].icon;
              icon.setAttribute('src', '');
              icon.setAttribute('alt', 'Weather icon');

              currentWeather.appendChild(icon);
              currentWeather.appendChild(temp);
              currentWeather.appendChild(today);
              currentWeather.appendChild(locationText);
              currentWeather.appendChild(uvIndexContainer);

              currentWeather.appendChild(humidity);
              currentWeather.appendChild(windSpeed);

              if (dataKey.current.uvi < 3) {
                uvIndex.classList.add('uv-low');
                uvRating.textContent = " Good"
              } else if (dataKey.current.uvi >= 3 && dataKey.current.uvi < 8) {
                uvIndex.classList.add('uv-medium');
                uvRating.textContent = " Medium"
              } else {
                uvIndex.classList.add('uv-high');
                uvRating.textContent = " High"
              }
              getForecast(dataKey);
            })


            //clears out previous searches
            // currentWeather.textContent = '';
            // console.log(latitude);
            // console.log(longitude);
          });
        });
    };

// Get the 5 day forecast
const getForecast = function (data) {
  console.log(data)
  forecastWeather.textContent = '';

  data.daily.forEach(function (value, index) {
    if (index > 0 && index < 6) {
      const forecastContainer = document.createElement("div");
      forecastContainer.classList.add("text-center");

      const forecastDate = document.createElement("p");
      const unixDate = value.dt;
      forecastDate.textContent = new Date(unixDate * 1000).toLocaleString('en-US', { weekday: 'long' });
      forecastDate.classList.add('pb-14');

      const forecastTemp = document.createElement("h2");
      forecastTemp.textContent = `${Math.round(value.temp.day)}°F`;
      forecastTemp.classList.add('pb-14');

      const forecastWindSpeed = document.createElement("p");
      forecastWindSpeed.textContent = `${Math.round(value.wind_speed)} MPH`;

      const forecastHumidity = document.createElement("p");
      forecastHumidity.textContent = `${value.humidity}%`;

      const forecastIcon = document.createElement("img");
      const forecastIconId = value.weather[0].icon;
      forecastIcon.setAttribute('src', '');
      forecastIcon.setAttribute('alt', 'Weather icon');
      forecastIcon.classList.add('pb-20');

      forecastContainer.appendChild(forecastDate);
      forecastContainer.appendChild(forecastIcon);
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
  searchList.classList.toggle("show");
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