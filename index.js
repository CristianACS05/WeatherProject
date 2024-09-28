console.log("Running");

const meteoApiUrl = "https://api.open-meteo.com/v1/forecast?";
const openCageKey = "9bef2c108e834b51a76d21be45b334f0";
const openCageApiUrl = "https://api.opencagedata.com/geocode/v1/json";

function getTime() {            // Obtains user's time to display
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let minutesString = String(minutes).padStart(2, "0");
    return {
        hours,
        minutesString,
        stringTime: hours + ":" + minutesString,
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
            userTown = data.results[0].components.town;
            userRegion = data.results[0].components.state;
            userCountry = data.results[0].components.country;

            document.getElementById("localidad").innerHTML = userTown;
            document.getElementById("comunidadpais").innerHTML = userRegion + ", " + userCountry;

            let meteoApiRequestUrl = meteoApiUrl + "latitude=" + userLatitude + "&longitude=" + userLongitude + "&current=temperature_2m" 

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
                })
                .catch(error => console.error("Error: ", error))
    });
}

navigator.geolocation.getCurrentPosition(positionSuccess);         // Obtains user's coordinates

/*fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error: ", error)); */