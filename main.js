const apiKey = '3f2fb54412fdff446633a41487bb3d44';
let weatherDiv = $('#current');
const searchBtn = $('#submit');
let futureDiv = $('#future');
const clearBtn = $('#clearhistory')


function getWeather(city) {
    
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
            let infoArr = [localTime, temp, humid, wind];
            //for loop to append current conditions to weather div
            for (let i = 0; i < infoArr.length; i++) {
                let info = $('<p>').text(infoArr[i]);
                weatherDiv.append(info);
            };
            let uvp = $('<p>').attr('class', 'uvp').text(uv);
            weatherDiv.append(uvp); 
            weatherDiv.append(icon);
            if (response.current.uvi > 0 || response.current.uvi <= 2) {
                $('.uvp').addClass('low');
            } else if (response.current.uvi > 2 || response.current.uvi <= 5) {
                $('.uvp').addClass('med');
            } else {
                $('.uvp').addClass('high');
            }
            //datadump for forecast
            //date, icon temperature, humidity, temp
            futureDiv.empty();
            let dailyArr = response.daily;
            for (i = 1; i < 6; i++) {
                let date = new Date(dailyArr[i].dt * 1000).toLocaleDateString('en-US');
                let temperature = 'Temp: Low ' + dailyArr[i].temp.min + ' °F - High ' + dailyArr[i].temp.max + ' °F';
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

function pullHistory() {
    //for loop to append each search history as a clickable link
    $('#searchhistory').empty();
    let histArr = JSON.parse(localStorage.getItem('weatherhist'));
    for (let i = 0; i < histArr.length; i++) {
        let histLink = $('<a>').text(histArr[i])
                               .attr('href', '#');                               
        $('#searchhistory').prepend(histLink);
    }
};

searchBtn.click(function(e){
    e.preventDefault();
    getWeather($('#cityname').val());
    //next we store the search history in localStorage
    if (localStorage.getItem('weatherhist') == null) {
        localStorage.setItem('weatherhist', JSON.stringify([$('#cityname').val()]));
    } else {
        let newHist = JSON.parse(localStorage.getItem('weatherhist'));
        newHist.unshift($('#cityname').val());
        localStorage.setItem('weatherhist', JSON.stringify(newHist))
    }
    pullHistory();
});

function populateMostRecent() {
    if (localStorage.getItem('weatherhist') == null) {
        return
    } else {
        let recentArr = JSON.parse(localStorage.getItem('weatherhist'));
        let recent = recentArr[0];
        getWeather(recent);
    };
    pullHistory();
};

populateMostRecent();

clearBtn.click(function(){
    localStorage.removeItem('weatherhist');
    $('#searchhistory').empty();
});

$('a').click(function(){
    let linktext = $(this).text();
    getWeather(linktext);
});




