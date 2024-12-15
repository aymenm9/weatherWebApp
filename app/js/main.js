
const search = document.getElementById('search');
const options = document.getElementById('options');

const weatherImg = document.querySelector('#weatherImg img');

const currentTemperature = document.getElementById('temperatureVal');
const currentWeatherCondition = document.getElementById('weatherCondition');
const currentLocation = document.getElementById('location');

const humidity = document.getElementById('humidityVal');
const WindSpeed = document.getElementById('windSpeedVal');

const TemperatureFelt = document.getElementById('temperatureFeltVal');
const visibility = document.getElementById('visibilityVal');

const timeTempCards = document.querySelectorAll('.timeTempCard');

fetchMainWeatherData();
fetchTodayWeatherData();
function get_location() {
    if (!navigator.geolocation) {
        throw new Error("This browser doesn't support geolocation");
    }
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            pos =>{
                resolve({latitude : pos.coords.latitude,longitude : pos.coords.longitude });
            },
            err =>{
                reject(err);
            }
        )
    })
}

async function fetchMainWeatherData() {
    try {
        let location = await get_location();
        
        const apiKey = `381347a7b6d741da47df9aa67b753a09`;
        const api = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&exclude=minutely,daily,alerts&units=metric&appid=${apiKey}`;
        fetch(api).then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch weather data.");
        }
        return response.json();
    }).then(data=>{
        currentTemperature.innerText = Math.floor(data.main.temp);
        currentWeatherCondition.innerText = data.weather[0].main;
        currentLocation.innerText = `${data.name}, ${data.sys.country}`;
        humidity.innerHTML = data.main.humidity;
        WindSpeed.innerHTML = Math.floor(data.wind.speed);
        TemperatureFelt.innerHTML = Math.floor(data.main.feels_like);
        visibility.innerHTML = data.visibility;
        let n = data.weather[0].icon
        n = n[n.length-1] == 'n' && data.weather[0].main =='Clear'? '_n' : '';
        weatherImg.src = `/imgs/${data.weather[0].main}${n}.png`
    })
    } catch (error) {
        console.error(error);
}}

async function fetchTodayWeatherData() {
    try {
        let location = await get_location();
        
        const apiKey = `381347a7b6d741da47df9aa67b753a09`;
        const api = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&cnt=6&units=metric&appid=${apiKey}`;
        fetch(api).then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch weather data.");
        }
        return response.json();
    }).then(data=>{
        console.log(data);
        for (let i = 0; i < timeTempCards.length; i++) {
            const element = timeTempCards[i];
            cdata = data.list[i]
            element.children[0].innerText = `${new Date(cdata.dt * 1000).getHours()}:00`
            let n = cdata.weather[0].icon
            n = n[n.length-1] == 'n' && cdata.weather[0].main =='Clear'? '_n' : '';
            element.children[1].children[0].src = `/icons/${cdata.weather[0].main}${n}.png`
            element.children[2].innerHTML = cdata.weather[0].main
            element.children[3].children[0].innerHTML = Math.floor(cdata.main.temp)
        }
    })
    } catch (error) {
        console.error(error);
}}