const apiKey = '3f2fb54412fdff446633a41487bb3d44';
let weatherDiv = $('#weather');

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
        let temp = response.main.temp + '°F';
        let humid = response.main.humidity + '%';
        let wind = response.wind.speed + 'mph';
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        
    })
}

searchBtn.click(function(e){
    e.preventDefault();
    getWeather();   
})