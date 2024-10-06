console.log("Running");

const meteoApiUrl = "https://api.open-meteo.com/v1/forecast?";
const openCageKey = "9bef2c108e834b51a76d21be45b334f0";
const openCageApiUrl = "https://api.opencagedata.com/geocode/v1/json";

function getTime() {            // Obtains user's time to display
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

document.getElementById("horalocal").innerHTML = stringTime;        // Displays time

let userLatitude, userLongitude;

let userTown, userRegion, userCountry;

let userTemp;

function positionSuccess(pos) {
    console.log(pos);

    userLatitude = pos.coords.latitude;
    userLongitude = pos.coords.longitude;

    let query = userLatitude + "," + userLongitude;
    const requestUrl = openCageApiUrl + "?" + "key=" + openCageKey + "&q=" + query + "&pretty=1" + "&no_annotations=1";
    console.log(requestUrl);

   fetch(requestUrl)
        .then((response) => {
            const data = response.json();
            return data; 
    })
        .then((data) => {
            console.log(data);
            userTown = data.results[0].components.town || data.results[0].components.city;
            userRegion = data.results[0].components.state || data.results[0].components.county;
            userCountry = data.results[0].components.country;

            document.getElementById("localidad").innerHTML = userTown;
            document.getElementById("comunidadpais").innerHTML = userRegion + ", " + userCountry;

            let meteoApiRequestUrl = meteoApiUrl + "latitude=" + userLatitude + "&longitude=" + userLongitude + "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m"; 

            fetch(meteoApiRequestUrl)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    return data;
                })
                .then(data => {
                    userTemp = data.current.temperature_2m;
                    console.log(userTemp);
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
                            return ["Fog";
                          case 48:
                            return ["Depositing Rime Fog";
                          case 51:
                            return ["Light drizzle";
                          case 53:
                            return ["Moderate drizzle";
                          case 55:
                            return ["Intense drizzle";
                          case 56:
                            return ["Light freezing drizzle";
                          case 57:
                            return ["Intense freezing drizzle";
                          case 61:
                            return ["Slight Rain";
                          case 63:
                            return ["Moderate Rain";
                          case 65:
                            return ["Heavy Rain";
                          case 66:
                            return ["Light Freezing Rain";
                          case 67:
                            return ["Heavy Freezing Rain";
                          case 71:
                            return ["Slight Snow Fall";
                          case 73:
                            return ["Moderate Snow Fall";
                          case 75:
                            return ["Heavy Snow Fall";
                          case 77:
                            return ["Snow grains";
                          case 80:
                            return ["Slight Rain Showers";
                          case 81:
                            return ["Moderate Rain Showers";
                          case 82:
                            return ["Violent Rain Showers";
                          case 85:
                            return ["Slight Snow Showers";
                          case 86:
                            return ["Heavy Snow Showers";
                          case 95:
                            return ["Thunderstorm";
                          case 96:
                            return ["Thunderstorm with slight hail";
                          case 99:
                            return ["Thunderstorm with heavy hail";
                        }
                      }
                    document.getElementById("weatherstatus").innerHTML = (getWeatherDescription(data.current.weather_code))[0];
                    document.getElementById("weatherIconDisplay").src = (getWeatherDescription(data.current.weather_code))[2];
                    document.getElementById("apparenttempvalue").innerHTML = data.current.apparent_temperature + " ºC";
                    document.getElementById("humidityvalue").innerHTML = data.current.relative_humidity_2m + " %";
                    document.getElementById("pressurevalue").innerHTML = data.current.surface_pressure + " hPa";
                    document.getElementById("windspeedvalue").innerHTML = data.current.wind_speed_10m + " km/h";
                })
                .catch(error => console.error("Error: ", error))
    });
}

navigator.geolocation.getCurrentPosition(positionSuccess);         // Obtains user's coordinates

/*fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error: ", error)); */