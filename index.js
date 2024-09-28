console.log("Running");

const url = "https://api.open-meteo.com/v1/forecast?latitude=42.4667&longitude=-2.45&hourly=temperature_2m&timezone=auto&forecast_days=1";
const openCageKey = "9bef2c108e834b51a76d21be45b334f0";

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

function positionSuccess(pos) {
    console.log(pos);
    const {latitude} 
}

navigator.geolocation.getCurrentPosition(positionSuccess);         // Obtains user's coordinates



/*fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error: ", error)); */