const apiKey = '3f2fb54412fdff446633a41487bb3d44';
let weatherDiv = $('#current');
const searchBtn = $('#submit');
let futureDiv = $('#future');

function getWeather() {
    let city = $('#cityname').val();
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
     city + "&units=imperial&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){    
        //first api call to grab lat and long for the more detailed second call
        weatherDiv.empty();
        let location = response.name;
        let nameInfo = $('<h5>').text(location);
        weatherDiv.append(nameInfo);
        let lat = response.coord.lat;
        let lon = response.coord.lon;        
        //second call below contains more detailed current conditions and the forecast, but must be called using latitude and longitude.
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon +'&units=imperial&appid=' + apiKey,
            method : 'GET'
        }).then(function(response){
            
            console.log(response);
            //datadump for weather div which should contain current conditions
            let now = new Date();
            let currentMilli = now.getTime();
            let localOffset = now.getTimezoneOffset() * 60000;
            let utc = currentMilli + localOffset;
            let destTime = utc + (1000 * response.timezone_offset);
            let convertedDestTime = new Date(destTime);
            let localTime = convertedDestTime.toLocaleString('en-US');
            let temp = 'Temperature: ' + response.current.temp + ' °F';
            let humid = 'Humidity: ' + response.current.humidity + '%';
            let wind = 'Windspeed: ' + response.current.wind_speed + 'mph';
            let uv = 'UV Index: ' + response.current.uvi;
            let iconId = response.current.weather[0].icon;
            let icon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/' + iconId + '@2x.png')
            let infoArr = [localTime, temp, humid, wind, uv];
            //for loop to append current conditions to weather div
            for (let i = 0; i < infoArr.length; i++) {
                let info = $('<p>').text(infoArr[i]);
                weatherDiv.append(info);
            };
            weatherDiv.append(icon);
            //datadump for forecast
            //date, icon temperature, humidity, temp
            let dailyArr = response.daily;
            for (i = 1; i < 6; i++) {
                let date = new Date(dailyArr[i].dt * 1000).toLocaleString('en-US');
                let temperature = 'Temp: High ' + dailyArr[i].temp.min + ' °F - Low ' + dailyArr[i].temp.max + ' °F';
                let humidity = 'Humidity: ' + dailyArr[i].humidity + '%';
                let condIcon = dailyArr[i].weather[0].icon;
                let dataArr = [date, temperature, humidity];
                let iconImg = $('<img>').attr('src', ' http://openweathermap.org/img/wn/' + condIcon + '@2x.png')
                let lineBreak = $('<hr>');
                for (let i = 0; i < dataArr.length; i++) {
                    let data = $('<p>').text(dataArr[i])
                    futureDiv.append(data);
                }
                futureDiv.append(iconImg);
                futureDiv.append(lineBreak);
            };
        })
    })
}

searchBtn.click(function(e){
    e.preventDefault();
    getWeather();   
})