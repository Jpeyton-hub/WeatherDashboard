const apiKey = '3f2fb54412fdff446633a41487bb3d44';
let weatherDiv = $('#weather');
let now = new Date()
const searchBtn = $('#submit');


function getWeather() {
    let city = $('#cityname').val();
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
     city + "&units=imperial&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){
        console.log(response)
        let timezone = response.timezone;
        let localTime = new Date(now.getTime() + timezone);       
        let temp = 'Temperature: ' + response.main.temp + '°F';
        let humid = 'Humidity: ' + response.main.humidity + '%';
        let wind = 'Windspeed: ' + response.wind.speed + 'mph';
        let lat = response.coord.lat;
        let lon = response.coord.lon;        
        let infoArr = [localTime, temp, humid, wind];
        for (let i = 0; i < infoArr.length; i++) {
            let info = $('<p>').text(infoArr[i]);
            weatherDiv.append(info);
        };
    })
}

searchBtn.click(function(e){
    e.preventDefault();
    getWeather();   
})