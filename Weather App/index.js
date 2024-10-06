const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const currentBtn = document.getElementById("currentBtn");
const daysBtn = document.getElementById("daysBtn");

const card = document.querySelector(".card");
const cards = document.querySelector(".cards");

const timeCard = document.querySelector(".timeCard");
const timeCards = document.querySelector(".timeCards");

const apiKey = "146ebbd2e0e3372876138c9ed29fc9d5";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

currentBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const city = cityInput.value;
  if (city) {
    try {
      const currentWeatherData = await getCurrentWeatherData(city);
      displayCurrentWeatherInfo(currentWeatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Enter a city");
  }
});

daysBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const city = cityInput.value;
  if (city) {
    try {
      const daysWeatherData = await get5DayWeatherData(city);

      display5DaysWeatherInfo(daysWeatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Enter a city");
  }
});

async function getCurrentWeatherData(city) {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await fetch(currentWeatherUrl);

  if (!response.ok) {
    throw new Error("Could not fetch a current weather data");
  } else {
    const res = await response.json();
    console.log(res);

    return res;
  }
}

async function get5DayWeatherData(city) {
  const daysWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  const response = await fetch(daysWeatherUrl);

  if (!response.ok) {
    throw new Error("Could not fetch a weather data");
  } else {
    const res = await response.json();
    console.log(res);

    return res;
  }
}

function displayCurrentWeatherInfo(data) {
  const weatherList = {
    name: data.name,
    humidity: data.main.humidity,
    temp: data.main.temp,
    id: data.weather[0].id,
    description: data.weather[0].description,
    feels: data.main.feels_like,
  };

  card.innerHTML = "";
  card.style.display = "flex";
  timeCard.style.display = "none";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");
  const tempGroupDisplay = document.createElement("p");

  cityDisplay.innerHTML = weatherList.name;
  card.appendChild(cityDisplay);
  cityDisplay.classList.add("cityDisplay");

  tempDisplay.innerHTML = `${(weatherList.temp - 273.15).toFixed()}°C`;
  card.appendChild(tempDisplay);
  tempDisplay.classList.add("tempDisplay");

  tempGroupDisplay.innerHTML = `Feels like: ${(
    weatherList.feels - 273.15
  ).toFixed()}°C`;
  card.appendChild(tempGroupDisplay);
  tempGroupDisplay.classList.add("tempGroupDisplay");

  humidityDisplay.innerHTML = `Humidity: ${weatherList.humidity}%`;
  card.appendChild(humidityDisplay);
  humidityDisplay.classList.add("humidityDisplay");

  descDisplay.innerHTML = weatherList.description;
  card.appendChild(descDisplay);
  descDisplay.classList.add("descDisplay");

  weatherEmoji.innerHTML = getWeatherEmoji(weatherList.id);
  card.appendChild(weatherEmoji);
  weatherEmoji.classList.add("weatherEmoji");
}

function display5DaysWeatherInfo(data) {
  card.innerHTML = "";
  cards.innerHTML = "";
  card.style.display = "flex";

  const array = dateNewArray(data);
  const weatherList = [];

  for (let i = 0; i < array.length - 1; i++) {
    weatherList.push({
      humidity: averageHumidity(array[i]),
      maxTemp: maxTemperature(array[i]),
      minTemp: minTemperature(array[i]),
      id: array[i][0].weather[0].id,
      description: array[i][0].weather[0].description,
      date: array[i][0].dt_txt,
      date2: new Date(array[i][0].dt_txt),
    });

    let currentDayOfWeek = weatherList[i].date.split(" ")[0];
    let currentDayOfWeek2 = daysOfWeek[weatherList[i].date2.getDay()];

    const cardDays = document.createElement("div");
    cardDays.classList.add("cardDays");
    cards.classList.add("cards");

    const humidityDisplay = document.createElement("p");
    const tempDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    const dayDisplay = document.createElement("p");
    const dayDisplayButoon = document.createElement("button");

    weatherEmoji.innerHTML = getWeatherEmoji(weatherList[i].id);
    cardDays.appendChild(weatherEmoji);
    weatherEmoji.classList.add("weatherEmoji");

    tempDisplay.innerHTML = `${weatherList[i].maxTemp}°C / <spam class="minTempDisplay">${weatherList[i].minTemp}°C</spam>`;
    cardDays.appendChild(tempDisplay);
    tempDisplay.classList.add("tempDisplay");

    humidityDisplay.innerHTML = `Humidity: ${weatherList[i].humidity}%`;
    cardDays.appendChild(humidityDisplay);
    humidityDisplay.classList.add("humidityDisplay");

    descDisplay.innerHTML = `${weatherList[i].description}`;
    cardDays.appendChild(descDisplay);
    descDisplay.classList.add("descDisplay");

    //Display button

    dayDisplayButoon.style.visibility = "hidden";

    cardDays.addEventListener("mouseover", () => {
      dayDisplayButoon.style.visibility = "visible";
    });

    cardDays.addEventListener("mouseout", () => {
      dayDisplayButoon.style.visibility = "hidden";
    });

    dayDisplay.innerHTML = `${currentDayOfWeek2}`;
    cardDays.appendChild(dayDisplay);
    dayDisplay.classList.add("dayDisplay");

    dayDisplayButoon.innerHTML = `Per three hour`;
    cardDays.appendChild(dayDisplayButoon);
    dayDisplayButoon.classList.add("dayDisplayButton");

    dayDisplayButoon.addEventListener("click", (event) => {
      event.preventDefault();
      timeCard.innerHTML = "";
      timeCards.innerHTML = "";
      timeCard.style.display = "flex";

      perTimeDisplay(currentDayOfWeek, data);
    });

    cards.appendChild(cardDays);
    cards.classList.add("cards");

    card.appendChild(cards);
  }

  const name = data.city.name;
  const cityDisplay = document.createElement("h1");

  cityDisplay.innerHTML = name;
  card.appendChild(cityDisplay);
  cityDisplay.classList.add("cityDisplay");

  card.appendChild(cards);
}

function perTimeDisplay(currentDayOfWeek, data) {
  const currentDate = currentDayOfWeek;
  const array = dateNewArray(data);

  const weatherList = [];

  for (let i = 0; i < array[i].length; i++) {
    const dates = array[i][0].dt_txt.split(" ")[0];

    if (dates === currentDate) {
      for (let j = 0; j < array[i].length; j++) {
        weatherList.push({
          humidity: array[i][j].main.humidity,
          temp: array[i][j].main.temp,
          id: array[i][j].weather[0].id,
          description: array[i][j].weather[0].description,
          date: array[i][j].dt_txt,
        });
      }

      for (let i = 0; i < weatherList.length; i++) {
        const cardDays = document.createElement("div");
        cardDays.classList.add("cardDays");
        timeCards.classList.add("timeCards");

        const humidityDisplay = document.createElement("p");
        const tempDisplay = document.createElement("p");
        const weatherEmoji = document.createElement("p");
        const descDisplay = document.createElement("p");
        const timeDisplay = document.createElement("p");

        weatherEmoji.innerHTML = getWeatherEmoji(weatherList[i].id);
        cardDays.appendChild(weatherEmoji);
        weatherEmoji.classList.add("weatherEmoji");

        tempDisplay.innerHTML = `${(weatherList[i].temp - 273.15).toFixed()}°C`;
        cardDays.appendChild(tempDisplay);
        tempDisplay.classList.add("tempDisplay");

        humidityDisplay.innerHTML = `Humidity: ${weatherList[i].humidity}%`;
        cardDays.appendChild(humidityDisplay);
        humidityDisplay.classList.add("humidityDisplay");

        descDisplay.innerHTML = `${weatherList[i].description}`;
        cardDays.appendChild(descDisplay);
        descDisplay.classList.add("descDisplay");

        const time = weatherList[i].date.split(" ")[1];
        const time2 = time.split(":")[0];

        timeDisplay.innerHTML = `${time2}h`;
        cardDays.appendChild(timeDisplay);
        timeDisplay.classList.add("dayDisplay");

        timeCards.appendChild(cardDays);
        timeCards.classList.add();
      }
      timeCard.appendChild(timeCards);
    }
  }
}

function dateArraySet(data, dateArray = []) {
  for (let i = 0; i < data.list.length; i++) {
    const dates = data.list[i].dt_txt.split(" ")[0];
    dateArray.push(dates);
  }

  dateArray = new Set(dateArray);
  dateArray = Array.from(dateArray);

  return dateArray;
}

function dateNewArray(data, newArray = []) {
  let dateArray = dateArraySet(data);

  for (let j = 0; j < dateArray.length; j++) {
    let array = [];
    for (let i = 0; i < data.list.length; i++) {
      const dates = data.list[i].dt_txt.split(" ")[0];
      if (dates === dateArray[j]) {
        array.push(data.list[i]);
      }
    }
    newArray.push(array);
  }

  return newArray;
}

function getWeatherEmoji(weatherId) {
  const weatherEmoji = document.createElement("p");
  weatherEmoji.innerHTML = weatherId;

  if (weatherId >= 200 && weatherId < 300) {
    return "🌩";
  } else if (weatherId >= 300 && weatherId < 400) {
    return "🌦";
  } else if (weatherId >= 500 && weatherId < 600) {
    return "🌧";
  } else if (weatherId >= 600 && weatherId < 700) {
    return "🌨";
  } else if (weatherId >= 700 && weatherId < 800) {
    return "🌪";
  } else if (weatherId === 800) {
    return "☀️";
  } else if (weatherId >= 800 && weatherId < 810) {
    return "☁️";
  } else {
    return "❓";
  }
}

function averageHumidity(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum = sum + array[i].main.humidity;
  }

  return (sum / array.length).toFixed();
}

// ...............First way.................

// function maxTemperature(array) {
//   let max = array[0].main.temp_max;
//   for (let i = 0; i < array.length; i++) {
//     if (max < array[i].main.temp_max) {
//       max = array[i].main.temp_max;
//     }
//   }

//   return (max - 273.15).toFixed();
// }

// .............Second way..................

// function maxTemperature(array) {
//   let max = 0;
//   for (let i = 0; i < array.length; i++) {
//     max = Math.max(max, array[i].main.temp_max);
//   }

//   return (max - 273.15).toFixed();
// }

// ................Third way................

function maxTemperature(array) {
  const maxList = [];

  for (let i = 0; i < array.length; i++) {
    maxList.push(array[i].main.temp_max);
  }

  let max = 0;
  max = Math.max(...maxList);

  return (max - 273.15).toFixed();
}

function minTemperature(array) {
  const minList = [];

  for (let i = 0; i < array.length; i++) {
    minList.push(array[i].main.temp_min);
  }

  let min = 0;
  min = Math.min(...minList);

  return (min - 273.15).toFixed();
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.innerHTML = message;
  errorDisplay.classList.add("errorDisplay");

  card.innerHTML = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}
