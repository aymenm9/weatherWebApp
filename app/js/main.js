const apiKey = `381347a7b6d741da47df9aa67b753a09`;
const icons  = {
    '01d' : '01d.png',
    '01n' : '01n.png',
    '02d' : '02d.png',
    '02n' : '02n.png',
    '03d' : '03.png',
    '03n' : '03.png',
    '04d' : '04.png',
    '04n' : '04.png',
    '09d' : '09.png',
    '09n' : '09.png',
    '10d' : '10d.png',
    '10n' : '10n.png',
    '11d' : '11.png',
    '11n' : '11.png',
    '13d' : '13.png',
    '13n' : '13.png',
    '50d' : '50.png',
    '50n' : '50.png',
}

const search = document.getElementById('search');
const options = document.getElementById('options');

const weatherImg = document.querySelector('#weatherImg img');

const currentTemperature = document.getElementById('temperatureVal');
const currentWeatherCondition = document.getElementById('weatherCondition');
const currentweatherConditionDescription = document.getElementById('weatherConditionDescription');
const currentLocation = document.getElementById('location');

const humidity = document.getElementById('humidityVal');
const WindSpeed = document.getElementById('windSpeedVal');

const TemperatureFelt = document.getElementById('temperatureFeltVal');
const visibility = document.getElementById('visibilityVal');

const timeTempCards = document.querySelectorAll('.timeTempCard');

const ctx = document.getElementById('circleChart').getContext('2d');
let circleChart;
init()

search.addEventListener("keyup", (Event)=>{
    const pl = search.value?search.value:" "
    if (Event.key == 'Enter'){
        const loc = `q=${pl}` 
        fetchMainWeatherData(loc)
        fetchTodayWeatherData(loc)
    }else{

    
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
}})

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
    
    const api = `https://api.openweathermap.org/data/2.5/weather?${location}&exclude=minutely,daily,alerts&units=metric&appid=${apiKey}`;
    fetch(api).then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch weather data.");
        }
        return response.json();
    }).then(data=>{
        currentTemperature.innerText = Math.floor(data.main.temp);
        currentWeatherCondition.innerText = data.weather[0].main;
        currentweatherConditionDescription.innerText = data.weather[0].description;
        currentLocation.innerText = `${data.name}, ${data.sys.country}`;
        humidity.innerHTML = data.main.humidity;
        WindSpeed.innerHTML = Math.floor(data.wind.speed);
        TemperatureFelt.innerHTML = Math.floor(data.main.feels_like);
        visibility.innerHTML = data.visibility/1000;
        weatherImg.src = `/imgs/${icons[data.weather[0].icon]}`
    }).catch (error =>console.error(error)) 
    
}

async function fetchTodayWeatherData(location) {
    
        const api = `https://api.openweathermap.org/data/2.5/forecast?${location}&cnt=6&units=metric&appid=${apiKey}`;
        fetch(api).then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch weather data.");
        }
        return response.json();
    }).then(data=>{
        TodayWeatherData(data)
        draw_chart(ctx,data.list.map(item => item.weather[0].description))
    }).catch (error =>console.error(error)) 
}
async function TodayWeatherData(data) {
    for (let i = 0; i < timeTempCards.length; i++) {
        const element = timeTempCards[i];
        cdata = data.list[i]
        element.children[0].innerText = `${new Date(cdata.dt * 1000).getHours()}:00`
        element.children[1].children[0].src = `/icons/${icons[cdata.weather[0].icon]}`
        element.children[2].innerHTML = cdata.weather[0].main
        element.children[3].children[0].innerHTML = Math.floor(cdata.main.temp)
    }
}
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

function genRandColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`

}

async function draw_chart(canvas,chart_data) {
    if(circleChart){
        circleChart.destroy();
    }
    let backgroundColor = [];
    let data = [];
    let labels = [];
    chart_data.forEach(WeatherCondition => {
        let i = labels.indexOf(WeatherCondition);
        if(i === -1){
            backgroundColor.push(genRandColor())
            labels.push(WeatherCondition)
            data.push(4)
        }else{
            data[i] += 4;
        }
    })
    circleChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

}


