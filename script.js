// Set this in a separate config file loaded before this script:
// window.WEATHER_API_KEY = "your_visual_crossing_api_key";

const API_KEY = window.WEATHER_API_KEY;

const form = document.getElementById("weather-form");
const locationInput = document.getElementById("location-input");
const message = document.getElementById("message");
const weatherCard = document.getElementById("weather-card");

const locationElement = document.getElementById("location");
const dateElement = document.getElementById("date");
const temperatureElement = document.getElementById("temperature");
const conditionsElement = document.getElementById("conditions");
const feelsLikeElement = document.getElementById("feels-like");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");

async function getWeather(location) {
  if (!API_KEY) {
    message.textContent = "Weather API key is not configured.";
    return;
  }

  const encodedLocation = encodeURIComponent(location);
  const url =
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
    `${encodedLocation}?key=${API_KEY}&include=hours&forecastDataset=gfs&unitGroup=metric`;

  message.textContent = "Loading weather…";
  weatherCard.classList.add("hidden");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Unable to find weather for that location.");
    }

    const data = await response.json();
    const current = data.currentConditions ?? data.days?.[0]?.hours?.[0];

    if (!current || !data.days?.[0]) {
      throw new Error("The weather API did not return usable forecast data.");
    }

    locationElement.textContent = data.resolvedAddress ?? location;
    dateElement.textContent = new Date(`${data.days[0].datetime}T00:00:00`).toLocaleDateString(
      undefined,
      { weekday: "long", month: "long", day: "numeric" }
    );

    temperatureElement.textContent = `${Math.round(current.temp)}°`;
    conditionsElement.textContent = current.conditions ?? "Unavailable";
    feelsLikeElement.textContent = `${Math.round(current.feelslike)}°`;
    humidityElement.textContent = `${Math.round(current.humidity)}%`;
    windElement.textContent = `${Math.round(current.windspeed)} km/h`;

    message.textContent = "";
    weatherCard.classList.remove("hidden");
  } catch (error) {
    message.textContent = error.message || "Something went wrong.";
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const location = locationInput.value.trim();

  if (location) {
    getWeather(location);
  }
});

if (locationInput.value.trim()) {
  getWeather(locationInput.value.trim());
}