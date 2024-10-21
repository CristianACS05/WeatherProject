console.log("Running");

const meteoApiUrl = "https://api.open-meteo.com/v1/forecast?";
const openCageKey = "9bef2c108e834b51a76d21be45b334f0";
const openCageApiUrl = "https://api.opencagedata.com/geocode/v1/json";

let userLatitude, userLongitude;
let userTown, userRegion, userCountry;
let userTemp;
let userAdministrativeLocation = [];

function getTime() {            // Obtains user's time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let hoursString = String(hours).padStart(2, "0");
    let minutesString = String(minutes).padStart(2, "0");
    return {
        hoursString,
        minutesString,
        stringTime: hoursString + ":" + minutesString,
    };
}

const {stringTime} = getTime();    
document.getElementById("horalocal").innerHTML = stringTime;        // Displays the time obtained through getTime()

async function fetchAdministrativePositionInfo(navigatorPos) {        // Function that handles the GeolocationPosition object from navigator, fetches OpenCage with the coordinates from navigator and inputs the data in the relevant DOM elements
  userLatitude = navigatorPos.coords.latitude;
  userLongitude = navigatorPos.coords.longitude;

  let query = userLatitude + "," + userLongitude;       // Build the URL for the openCage geolocalization request
  const requestUrl = openCageApiUrl + "?" + "key=" + openCageKey + "&q=" + query + "&pretty=1" + "&no_annotations=1";

  return fetch(requestUrl)        // Fetch from the OpenCage API with the previously built request URL
    .then(
      results => {
        return results.json();
      })
    .then(data => {
        userTown = data.results[0].components.town || data.results[0].components.city;      // Format the data, obtaining what we need and returning it
        userRegion = data.results[0].components.state || data.results[0].components.county;
        userCountry = data.results[0].components.country;

        document.getElementById("localidad").innerHTML = userTown;
        document.getElementById("comunidadpais").innerHTML = userRegion + ", " + userCountry;
        return data;
    })
    .catch(
      error => {
        console.error(error);
      }
    )
} 

async function fetchWeather() {
  let meteoApiRequestUrl = meteoApiUrl + "latitude=" + userLatitude + "&longitude=" + userLongitude + "&current=temperature_2m,is_day,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m"; 
  
  return fetch(meteoApiRequestUrl)
    .then(
      results => {
        return results.json();
      })
    .then(weather => {
      userTemp = weather.current.temperature_2m;
      document.getElementById("temp").innerHTML = Math.round(userTemp) + " ºC";
      function getWeatherDescription(weatherCode) {
          switch (weatherCode) {    // weather icons obtained from https://github.com/Makin-Things/weather-icons/tree/main
            case 0:
              return ["Clear sky", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/clear-day.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/clear-night.svg"];
            case 1:
              return ["Mainly clear", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-1-day.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-1-night.svg"];
            case 2:
              return ["Partly cloudy", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-2-day.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-2-night.svg"];
            case 3:
              return ["Overcast", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy.svg"];
            case 45:
              return ["Fog", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/fog-day.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/fog-night.svg"];
            case 48:
              return ["Depositing Rime Fog", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/fog.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/fog.svg"];
            case 51:
              return ["Light drizzle", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1-day.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1-night.svg"];
            case 53:
              return ["Moderate drizzle", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1-day.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1-night.svg"];
            case 55:
              return ["Intense drizzle", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1-day.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1-night.svg"];
            case 56:
              return ["Light freezing drizzle", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-3-day.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-3-night.svg"];
            case 57:
              return ["Intense freezing drizzle", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rain-and-sleet-mix.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rain-and-sleet-mix.svg"];
            case 61:
              return ["Slight Rain", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1.svg"];
            case 63:
              return ["Moderate Rain", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-2.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-2.svg"];
            case 65:
              return ["Heavy Rain", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-3.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-3.svg"];
            case 66:
              return ["Light Freezing Rain", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rain-and-sleet-mix.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rain-and-sleet-mix.svg"];
            case 67:
              return ["Heavy Freezing Rain", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rain-and-sleet-mix.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rain-and-sleet-mix.svg"];
            case 71:
              return ["Slight Snow Fall", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-1-day.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-1-night.svg"];
            case 73:
              return ["Moderate Snow Fall", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-2.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-2.svg"];
            case 75:
              return ["Heavy Snow Fall", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-3.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-3.svg"];
            case 77:
              return ["Snow grains", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rain-and-snow-mix.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rain-and-snow-mix.svg"];
            case 80:
              return ["Slight Rain Showers", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1.svg"];
            case 81:
              return ["Moderate Rain Showers", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-2.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-2.svg"];
            case 82:
              return ["Violent Rain Showers", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-3.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-3.svg"];
            case 85:
              return ["Slight Snow Showers", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-1-day.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-1-night.svg"];
            case 86:
              return ["Heavy Snow Showers", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-3.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-3.svg"];
            case 95:
              return ["Thunderstorm", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/thunderstorms.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/thunderstorms.svg"];
            case 96:
              return ["Thunderstorm with slight hail", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/thunderstorms.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/thunderstorms.svg"];
            case 99:
              return ["Thunderstorm with heavy hail", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/severe-thunderstorm.svg", "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/severe-thunderstorm.svg"];
          }
        }
      document.getElementById("weatherstatus").innerHTML = (getWeatherDescription(weather.current.weather_code))[0];  
      
      if (weather.current.is_day == 0) {
        document.getElementById("weatherIconDisplay").src = (getWeatherDescription(weather.current.weather_code))[2];
      } else {
        document.getElementById("weatherIconDisplay").src = (getWeatherDescription(weather.current.weather_code))[1];
      }

      document.getElementById("apparenttempvalue").innerHTML = weather.current.apparent_temperature + " ºC";
      document.getElementById("humidityvalue").innerHTML = weather.current.relative_humidity_2m + " %";
      document.getElementById("pressurevalue").innerHTML = weather.current.surface_pressure + " hPa";
      document.getElementById("windspeedvalue").innerHTML = weather.current.wind_speed_10m + " km/h";
      })
    .catch(
        error => {
          console.error(error);
        }
      )
}

function getUserCurrentPosition() {       // gets the coordinates of the user through a HTML geolocation method and wraps it in a promise and returns the promise
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      navigatorPos => resolve(navigatorPos),
      error => reject(error)
  )
  });
}

async function main() {       // principal function which calls the others in order, making them wait for the necessary info
  const navigatorPos = await getUserCurrentPosition();
  const info = await fetchAdministrativePositionInfo(navigatorPos);
  await fetchWeather();
}

main();