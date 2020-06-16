$(document).ready(function () {

    setInterval(function () {
        var todayDate = moment().format('MMMM Do YYYY, h:mm:ss a');
        // console.log(todayDate);
        $('#clock').html(todayDate);

    }, 1000);

    var apiKey = '&APPID=8f3ed085f2c3b566fb3eb9e5a44a0736';

    $('#search-button').on('click', function (event) {
        event.preventDefault();
        //store user input
        var cityInput = $("#search-value").val();
        //array to store enter Cities from user
        var allCities = [];
        allCities = JSON.parse(localStorage.getItem("allCities")) || [];
        allCities.push(cityInput); // pushes new cities entered to array 
        localStorage.setItem("allCities", JSON.stringify(allCities)); //saves city input to local storage 
        // console.log('local storage: ' + allCities)
        //get current weather function
        getWeather(cityInput);
    })

    function getWeather(cityInput) {

        console.log("User type: " + cityInput);
        // var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q="+ cityInput + apiKey;
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial" + apiKey;
        console.log("API: " + queryURL);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            // var todayDate = moment().format('LL');
            var todayDate = new Date(response.dt * 1000).toLocaleDateString("en-US");
            var weatherIcon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
            var lat = response.coord.lat;
            var lon = response.coord.lon;

            //Generate currentWeather info
            $("#currentWeather").html(`
        <h2>${response.name}, ${response.sys.country} (${todayDate})<img src=${weatherIcon} height="70px"></h2
        <p>Temperature: ${response.main.temp}&#176;F</p>
        <p>Humidity: ${response.main.humidity}%</p>
        <p>Wind Speed: ${response.wind.speed} m/s</p>
        `,
                //uvIndex function(lat,lon)
                uvIndexForcast(lat, lon))
            //saved cities function
            savedCities();
        })
    }

    // UV index and 5 day forcast from lat and lon info
    function uvIndexForcast(lat, lon) {
        var uvqueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial" + apiKey;
        console.log('uvqquery function:' + uvqueryURL);

        $.ajax({
            url: uvqueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            var currUVIndex = response.current.uvi;
            var uvSeverity = "green";
            //Change UV color based on severity - favorable(uvi less than 3)-green, moderate(uvi 3-5)-yellow, sever(6-7)-orange, very high(8 and up)-red
            if (currUVIndex >= 8) {
                uvSeverity = "red";
            } else if (currUVIndex >= 6) {
                uvSeverity = "orange";
            } else if (currUVIndex >= 3) {
                uvSeverity = "yellow";
            }
            $("#currentWeather").append(`<p>UV Index: <span class="text-black uvStyle" style="background-color: ${uvSeverity};"> ${currUVIndex} </span></p>
            <h2>Current Weather</h2> 
            <h3>5-Day Forcast</h3>`);

            //empty 5day forcast
            $('#weatherForecast').empty();
            //Loop thru for 5 day forcast
            for (var i = 1; i < response.daily.length - 2; i++) {
                var forcastDate = response.daily[i].dt;
                //convert Epoch time to EST
                var newDate = new Date(forcastDate * 1000).toLocaleDateString("en-US");
                // console.log('forcast Date:' + newDate);
                var iconPic = response.daily[i].weather[0].icon;
                var weatherIcon = `https://openweathermap.org/img/wn/${iconPic}.png`;
                //append a day forcast
                $('#weatherForecast').append(`
                <div class="col-sm">
                    <div class="card  text-white bg-primary">
                        <div class="card-body text-center">
                            <h4>${newDate} </h4>
                            <img src=${weatherIcon} alt="Icon">
                            <p>Temp: ${response.daily[i].temp.day} &#176;F</p>
                            <p>Humidity: ${response.daily[i].humidity}%</p>
                        </div>
                    </div>
                </div>
                ` )
            }

        })
    }

    function savedCities() {
        $("#cityButtons").empty(); // empties out previous array 
        var arrayFromStorage = JSON.parse(localStorage.getItem("allCities")) || []; // Makes all cities searched a string
        var arrayLength = arrayFromStorage.length; // limits length of array

        for (var i = 0; i < arrayLength; i++) {
            var cityNameFromArray = arrayFromStorage[i]; //

            $("#cityButtons").prepend(`<div class='list-group'> <button class='list-group-item'> ${cityNameFromArray}</button>`)
        }
    }

    savedCities(); // calls function to append cities upon page load 

    // show cities on click 
    $("#cityButtons").on("click", ".list-group-item", function (event) {
        event.preventDefault();
        var cityInput = ($(this).text());
        getWeather(cityInput);
    })

});