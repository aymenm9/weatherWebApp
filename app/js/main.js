const apiKey = `381347a7b6d741da47df9aa67b753a09`;


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

init()

search.addEventListener("keyup", (Event)=>{
    const pl = search.value?search.value:" "
    if (Event.key == 'Enter'){
        const loc = `q=${pl}` 
        fetchMainWeatherData(loc)
        fetchTodayWeatherData(loc)
    }
    const api =  `http://api.openweathermap.org/geo/1.0/direct?q=${pl}&limit=5&appid=${apiKey}`
    fetch(api).then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch weather data.");
        }
        return response.json();
    }).then(data =>{
        options.innerHTML = "";
        data.forEach(place => {
            const opt = createOption(place.name, place.country)
            options.appendChild(opt)
        });
    }).catch(e=> console.log(e))
})

function createOption(val,country) {
    const opt = document.createElement('option')
    opt.value = val
    opt.innerText = `${val}, ${country}`
    return opt
}
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
async function init() {
    try {
        let location = await get_location();
        const loc = `lat=${location.latitude}&lon=${location.longitude}` 
        fetchMainWeatherData(loc)
        fetchTodayWeatherData(loc)
        
    } catch (error) {
        console.error(error);
    }
    
}
async function fetchMainWeatherData(location) {
    try {
        //let location = await get_location();
    
        const api = `https://api.openweathermap.org/data/2.5/weather?${location}&exclude=minutely,daily,alerts&units=metric&appid=${apiKey}`;
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
        visibility.innerHTML = data.visibility/1000;
        let n = data.weather[0].icon
        n = n[n.length-1] == 'n' && data.weather[0].main =='Clear'? '_n' : '';
        weatherImg.src = `/imgs/${data.weather[0].main}${n}.png`
    })
    } catch (error) {
        console.error(error);
}}

async function fetchTodayWeatherData(location) {
    try {
        //let location = await get_location();
        const api = `https://api.openweathermap.org/data/2.5/forecast?${location}&cnt=6&units=metric&appid=${apiKey}`;
        fetch(api).then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch weather data.");
        }
        return response.json();
    }).then(data=>{
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

/*async function fetchWeekWeatherData() {
    try {
        let location = await get_location();
        const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${location.latitude}&lon=${location.longitude}&exclude=hourly,minutely,alerts&units=metric&appid=${apiKey}`;
                             
        
        fetch(api).then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch weather data.");
        }
        return response.json();
    }).then(data=>{
        console.log(data);
    })
    } catch (error) {
        console.error(error);
}}*/