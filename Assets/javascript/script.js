setInterval(function () {
    var todayDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    // console.log(todayDate);
    $('#clock').html(todayDate);

}, 1000);

var apiKey = '&APPID=8f3ed085f2c3b566fb3eb9e5a44a0736';

$('#search-button').on('click', function (event) {
    event.preventDefault();
    var cityInput = $("#search-value").val();
    var cityList = $("<button>").attr({ id: "city" }).html(cityInput);
    $('.list-group').prepend(cityList);


    console.log("User type: " + cityInput);
    // var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q="+ cityInput + apiKey;
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityInput +"&units=imperial" + apiKey;
    console.log("API: " + queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (response) {
        var todayDate = moment().format('LL');
        var weatherIcon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        //Generate currentWeather info
        $("#currentWeather").html(`
        <h2>${response.name} (${todayDate})<img src=${weatherIcon} height="70px"></h2
        <p>Temperature: ${response.main.temp} &#176;C</p>
        <p>Humidity: ${response.main.humidity}%</p>
        <p>Wind Speed: ${response.wind.speed} m/s</p>
        `,
        //uvIndex function(lat,lon)
            uvIndex(lat, lon))
        // createHistoryBtn(response.name);
    })


    

    // The current UV index is collected at the same time as the current weather
    // by making use of the searched city's returned coordinates
    function uvIndex(lat, lon) {
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
            $("#currentWeather").append(`<p>UV Index: <span class="text-black p-1" style="background-color: ${uvSeverity};">${currUVIndex}</span></p>`);
        
            //empty 5day forcast
            $('#weatherForecast').empty();

            for(var i=1; i< response.daily.length -2 ; i++){
                var forcastDate = response.daily[i].dt;
                // console.log('forcast Date Epoch:' + forcastDate);
                //convert unix time to EST
                var newDate= new Date(forcastDate * 1000).toLocaleDateString("en-US");
                console.log('forcast Date:' + newDate);
                var iconPic = response.daily[i].weather[0].icon;
                console.log('icon weather; '+iconPic);
                var weatherIcon = `https://openweathermap.org/img/wn/${iconPic}.png`;

                $('#weatherForecast').append(`
                <div class="col-sm">
                    <div class="card  text-white bg-primary">
                        <div class="card-body text-center">
                            <h4>${newDate} </h4>
                            <img src=${weatherIcon} alt="Icon">
                            <p>Temp: ${response.daily[i].temp.day} &#176;C</p>
                            <p>Humidity: ${response.daily[i].humidity}%</p>
                        </div>
                    </div>
                </div>
                ` )
            }

        })
    }

})