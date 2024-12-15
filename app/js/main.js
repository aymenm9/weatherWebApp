

const search = document.getElementById('search');
const options = document.getElementById('options');

const weatherImg = document.querySelector('#weatherImg img');

const currentTemperature = document.getElementById('temperature');
const currentWeatherCondition = document.getElementById('weatherCondition');
const currentLocation = document.getElementById('location');

const humidity = document.getElementById('humidity')[1][0] // div img div 2span span0 is the val
const WindSpeed = document.getElementById('windSpeed')[1][0] // div img div 2span span0 is the val

const TemperatureFelt = document.getElementById('temperatureFelt')[0] // span0 is the val
const visibility = document.getElementById('visibility')[0] // span0 is the val



function get_location() {
    
}
function locationSuccess(pos) {
    
}
navigator.geolocation.getCurrentPosition(locationSuccess,error)