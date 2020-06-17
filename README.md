# 06 Server-Side APIs: Weather Dashboard

This app is a weather dashboard that allows the user to input a city and display the current weather conditions, the temperature, the humidity, the wind speed, and the UV index and 5 day forecast. The user's search history is saved as a button and allows them to quickly check the weather of that city by clicking it.

We use the [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities. 


https://mikewclee.github.io/Weather-Dashboard/


## Design

```
I use 2 weather API as one had city and weather info but need another to get UV and 5 day weather forcast by passing the city's latitude and longitude. 
I changed API parameters to get Fahrenheit and logic to display UV severity with color indicating favorable(green), moderate(orange), or severe (red).
The searched cities are stored in localStorage allowing user quick access.  Duplicate cities are not populated.

Technologies used: HTML5, CSS3, JavaScript, jQuery, Moment.js. OpenWeather API
```

https://mikewclee.github.io/Weather-Dashboard/


## Acceptance Criteria
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast
```


![weatherdemo](Assets/images/weather.JPG)
