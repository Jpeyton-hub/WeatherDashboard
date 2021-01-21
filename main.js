const apiKey = '3f2fb54412fdff446633a41487bb3d44';
let weatherDiv = $('#current');
const searchBtn = $('#submit');


function getWeather() {
    let city = $('#cityname').val();
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
     city + "&units=imperial&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){    
        //first api call to grab lat and long for the more detailed second call
        
        let location = response.name;
        let lat = response.coord.lat;
        let lon = response.coord.lon;        
        //second call below contains more detailed current conditions and the forecast, but must be called using latitude and longitude.
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon +'&units=imperial&appid=' + apiKey,
            method : 'GET'
        }).then(function(response){
            weatherDiv.empty();
            console.log(response);
            //datadump for weather div which should contain current conditions             
            let convertedDestTime = new Date(response.current.dt * 1000);
            let localTime = convertedDestTime.toLocaleString('en-US');
            let temp = 'Temperature: ' + response.current.temp + '°F';
            let humid = 'Humidity: ' + response.current.humidity + '%';
            let wind = 'Windspeed: ' + response.current.wind_speed + 'mph';
            let uv = 'UV Index: ' + response.current.uvi;
            let infoArr = [location, localTime, temp, humid, wind, uv];
            //for loop to append current conditions to weather div
            for (let i = 0; i < infoArr.length; i++) {
                let info = $('<p>').text(infoArr[i]);
                weatherDiv.append(info);
            };
            //datadump for forecast

        })
    })
}

searchBtn.click(function(e){
    e.preventDefault();
    getWeather();   
})