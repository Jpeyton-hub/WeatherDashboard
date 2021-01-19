const apiKey = '3f2fb54412fdff446633a41487bb3d44';
const city = 'kansas city';
const queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
"q=" + city + "&units=imperial&appid=" + apiKey;
 
console.log('connected');

$.ajax({
    url: queryURL,
    method: 'GET'
}).then(function(response){
    console.log(response);
})